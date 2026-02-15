import dns from 'dns';

// ... (keep existing code)

// 2. Configure Transporter
// Default to Port 465 (Secure) if no port is specified, as 587 is timing out
const smtpPort = parseInt(process.env.SMTP_PORT?.trim() || '465');

console.log(`📧 Attempting SMTP Connection: ${smtpHost}:${smtpPort} (Secure: ${smtpPort === 465})`);
console.log(`👤 SMTP User: ${smtpUser}`);

// Define transport options type
let transportOptions: any = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
        user: smtpUser,
        pass: smtpPass,
    },
    logger: true,
    debug: true,
    connectionTimeout: 20000, // 20 seconds (Slightly reduced to fail faster if blocked)
    greetingTimeout: 20000,
    socketTimeout: 20000,
    // Custom lookup to STRICTLY enforce IPv4 and prevent IPv6 fallback
    lookup: (hostname: string, options: any, callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void) => {
        const ipv4Options = { ...options, family: 4 };
        dns.lookup(hostname, ipv4Options, (err, address, family) => {
            if (err) {
                console.error(`❌ DNS Lookup Failed for ${hostname}:`, err);
                return callback(err, "", 0);
            }
            console.log(`🔍 DNS Lookup Resolved: ${hostname} -> ${address} (Family: ${family})`);
            callback(null, address, family);
        });
    }
};

const transporter = nodemailer.createTransport(transportOptions);

export async function POST(req: Request) {
    try {
        const { to, subject, html } = await req.json();

        // 1. Check for SMTP credentials
        // Sanitize inputs to remove accidental whitespace
        const smtpHost = process.env.SMTP_HOST?.trim();
        const smtpUser = process.env.SMTP_USER?.trim();
        const smtpPass = process.env.SMTP_PASS?.trim();

        if (!smtpHost || !smtpUser || !smtpPass) {
            console.error("❌ SMTP CONFIGURATION MISSING:");
            console.error(`- SMTP_HOST: ${smtpHost ? "Set" : "Missing"}`);
            console.error(`- SMTP_USER: ${smtpUser ? "Set" : "Missing"}`);
            console.error(`- SMTP_PASS: ${smtpPass ? "Set" : "Missing"}`);
            console.log("---------------------------------------------------");
            console.log("⚠️  MOCK EMAIL SIMULATION (No SMTP Configured) ⚠️");
            console.log(`TO: ${to}`);
            console.log(`SUBJECT: ${subject}`);
            console.log(`BODY (Preview): ${html.substring(0, 100)}...`);
            console.log("---------------------------------------------------");

            // Return success even in mock mode so frontend doesn't break
            return NextResponse.json({ success: true, message: "Mock email logged to console." });
        }

        // 2. Configure Transporter
        const smtpPort = parseInt(process.env.SMTP_PORT?.trim() || '587');

        console.log(`📧 Attempting SMTP Connection: ${smtpHost}:${smtpPort} (Secure: ${smtpPort === 465})`);
        console.log(`👤 SMTP User: ${smtpUser}`);

        // Define transport options type
        let transportOptions: any = {
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
            logger: true,
            debug: true,
            connectionTimeout: 30000, // 30 seconds (Increased)
            greetingTimeout: 30000,   // 30 seconds (Increased)
            socketTimeout: 30000,     // 30 seconds (Increased)
            family: 4,                // Force IPv4
        };

        // Detect Gmail and force correct settings if needed, but DO NOT use 'service: gmail' shorthand
        // as it may override the IPv4 enforcement (family: 4)
        if (smtpHost && smtpHost.includes("gmail") && !process.env.SMTP_PORT) {
            console.log("GMAIL DETECTED: Forcing standard Gmail ports (587) due to missing config");
            // Default to 587 for proper TLS upgrade if not specified
            transportOptions.host = 'smtp.gmail.com';
            transportOptions.port = 587;
            transportOptions.secure = false; // 587 is STARTTLS, so secure: false
        } else {
            transportOptions.host = smtpHost;
            transportOptions.port = smtpPort;
            transportOptions.secure = smtpPort === 465;
        }

        // Explicitly force IPv4 even harder
        transportOptions.family = 4;

        console.log(`📧 Final Configuration -> Host: ${transportOptions.host}, Port: ${transportOptions.port}, Secure: ${transportOptions.secure}, Family: ${transportOptions.family}`);

        const transporter = nodemailer.createTransport(transportOptions);

        // Verify connection configuration
        try {
            console.log("🔄 Verifying SMTP connection...");
            await transporter.verify();
            console.log("✅ SMTP Connection Verified");
        } catch (verifyError: any) {
            console.error("❌ SMTP Connection Verification Failed:", verifyError);
            // Log full error object for debugging
            console.error(JSON.stringify(verifyError, null, 2));
            return NextResponse.json({
                success: false,
                error: `SMTP Connection Failed: ${verifyError.message || "Unknown Error"}`,
                details: verifyError
            }, { status: 500 });
        }

        // 3. Send Email
        const info = await transporter.sendMail({
            from: `"Prayukti vLab" <${smtpUser}>`,
            to,
            subject,
            html,
        });

        return NextResponse.json({ success: true, messageId: info.messageId });

    } catch (error: any) {
        console.error("Email API Error Full Details:", JSON.stringify(error, null, 2));
        console.error("Email API Error Message:", error.message);

        let errorMessage = error.message;
        if (error.responseCode === 535) {
            errorMessage = "Authentication Failed: Please check your SMTP credentials. If using Gmail, make sure to use an 'App Password', not your main password.";
        }

        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}

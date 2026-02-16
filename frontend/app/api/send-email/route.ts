import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dns from 'dns';
import env from '@/lib/env'; // Import strict loader

export async function POST(req: Request) {
    try {
        const { to, subject, html } = await req.json();

        // 1. Check for SMTP credentials
        // Sanitize inputs to remove accidental whitespace
        const smtpHost = env.SMTP_HOST?.trim();
        const smtpUser = env.SMTP_USER?.trim();
        const smtpPass = env.SMTP_PASS?.trim();

        if (!smtpHost || !smtpUser || !smtpPass) {
            console.error("❌ SMTP CONFIGURATION MISSING:");
            console.error(`- SMTP_HOST: ${smtpHost ? "Set" : "Missing"}`);
            // ... (keep logs but avoid logging secrets explicitly if possible, though user/host is fine)
            console.error(`- SMTP_USER: ${smtpUser ? "Set" : "Missing"}`);
            console.error(`- SMTP_PASS: ${smtpPass ? "Set" : "Missing"}`);
            console.log("---------------------------------------------------");
            console.log("⚠️  MOCK EMAIL SIMULATION (No SMTP Configured) ⚠️");
            console.log(`TO: ${to}`);
            console.log(`SUBJECT: ${subject}`);
            console.log(`BODY (Preview): ${html.substring(0, 100)}...`);
            console.log("---------------------------------------------------");

            return NextResponse.json({ success: true, message: "Mock email logged to console." });
        }

        // 2. Configure Transporter
        // Default to Port 465 (Secure) if no port is specified, as 587 is timing out
        let smtpPort = parseInt(env.SMTP_PORT?.trim() || '465');
        let useSecure = smtpPort === 465;

        // Auto-override for Gmail if the user has set 587 (which is failing)
        if (smtpHost.includes('gmail.com') || smtpHost.includes('googlemail.com')) {
            if (smtpPort !== 465) {
                console.log("⚠️ GMAIL DETECTED: Overriding config to enforce Port 465 (SSL) to avoid timeouts");
                smtpPort = 465;
                useSecure = true;
            }
        }

        // 3. Pre-resolve DNS to IPv4 to bypass any IPv6/Nodemailer limitations
        console.log(`🔍 Resolving IPv4 for ${smtpHost}...`);
        let resolvedHost = smtpHost;
        try {
            const addresses = await dns.promises.resolve4(smtpHost);
            if (addresses && addresses.length > 0) {
                resolvedHost = addresses[0];
                console.log(`✅ Resolved ${smtpHost} -> ${resolvedHost} (IPv4)`);
            } else {
                console.warn(`⚠️ No IPv4 addresses found for ${smtpHost}, using original host.`);
            }
        } catch (dnsError) {
            console.error(`❌ DNS Resolution failed for ${smtpHost}:`, dnsError);
            // Fallback to original host if resolution fails
        }

        console.log(`📧 Attempting SMTP Connection to IP: ${resolvedHost}:${smtpPort} (Secure: ${useSecure})`);
        console.log(`👤 SMTP User: ${smtpUser}`);

        // Define transport options type
        let transportOptions: any = {
            host: resolvedHost, // Use IP address directly
            port: smtpPort,
            secure: useSecure,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
            tls: {
                servername: smtpHost, // REQUIRED: Original hostname for TLS verification (SNI)
            },
            logger: true,
            debug: true,
            connectionTimeout: 30000,
            greetingTimeout: 30000,
            socketTimeout: 30000,
        };

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

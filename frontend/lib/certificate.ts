import jsPDF from "jspdf";
import QRCode from "qrcode";

/**
 * Generates a unique certificate ID based on student name and title.
 */
const generateCertificateId = (name: string, title: string): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const namePart = name.substring(0, 3).toUpperCase();
    const titlePart = (title.match(/[A-Z0-9]/g) || [title[0]]).join('').toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `PVL-${titlePart}-${namePart}${timestamp}${randomPart}`;
};

/**
 * Generates a professional certificate of completion for a virtual lab.
 * 
 * @param studentName - The name of the student who completed the work.
 * @param title - The name of the experiment or subject completed.
 * @param isSubject - Whether this is a full subject completion certificate.
 * @param rollNo - The roll number of the student (optional).
 */
export const generateCertificate = async (studentName: string, title: string, isSubject: boolean = false, rollNo?: string) => {
    // 1. Generate Unique ID
    const certificateId = generateCertificateId(studentName, title);
    const verificationUrl = `${window.location.origin}/verify/${certificateId}?name=${encodeURIComponent(studentName)}&subject=${encodeURIComponent(title)}&date=${encodeURIComponent(new Date().toISOString())}`;

    // 2. Generate QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
        margin: 1,
        width: 200,
        color: {
            dark: '#000000',
            light: '#ffffff',
        },
    });

    // Create a new document (Landscape, A4)
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // --- Background & Border ---
    // Subtle border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // --- Header ---
    // Infosys-style Logo Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.setTextColor(0, 114, 187); // Infosys Blue
    doc.text("Prayukti", pageWidth / 2, 25, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Navigate your next level of learning", pageWidth / 2, 33, { align: "center" });

    // --- Decorative Lines ---
    const lineY = 50;
    const lineWidth = 120;
    doc.setDrawColor(0, 161, 222, 0.3); // Light Blue
    doc.setLineWidth(5);
    // Draw dashed-like pattern (rectangles)
    for (let i = 0; i < 15; i++) {
        doc.rect(10 + i * 8, lineY, 4, 1.5, 'F');
        doc.rect(pageWidth - 14 - i * 8, lineY, 4, 1.5, 'F');
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 114, 187);
    doc.text("COURSE COMPLETION CERTIFICATE", pageWidth / 2, 52, { align: "center" });

    // --- Awarded To ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text("The certificate is awarded to", pageWidth / 2, 70, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.setTextColor(0, 114, 187);
    doc.text(studentName, pageWidth / 2, 85, { align: "center" });

    if (rollNo) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text(`Roll Number: ${rollNo}`, pageWidth / 2, 93, { align: "center" });
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text("for successfully completing the course", pageWidth / 2, 100, { align: "center" });

    // --- Course Name ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 114, 187);
    doc.text(title, pageWidth / 2, 112, { align: "center" });

    // --- Date ---
    const today = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(`on ${today}`, pageWidth / 2, 125, { align: "center" });

    // --- Sub-Logo ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(0, 114, 187);
    doc.text("Prayukti | ", pageWidth / 2 - 15, 145, { align: "right" });
    doc.setTextColor(234, 88, 12); // Orange-ish
    doc.text("Virtual Lab", pageWidth / 2 - 12, 145, { align: "left" });

    doc.setFont("times", "italic");
    doc.setFontSize(18);
    doc.setTextColor(234, 88, 12);
    doc.text("Congratulations! You make us proud!", pageWidth / 2, 165, { align: "center" });

    // --- Footer Section ---
    // QR Code (Left)
    doc.addImage(qrCodeDataUrl, 'PNG', 20, 140, 40, 40);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(`Issued on: ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`, 20, 185);
    doc.text(`To verify, scan the QR code or visit prayukti-vlab.com/verify`, 20, 190);
    doc.setTextColor(0, 0, 255);
    doc.text(`Certificate ID: ${certificateId}`, 20, 195);

    // Signature (Right)
    doc.setTextColor(0, 0, 0);
    doc.setFont("times", "italic");
    doc.setFontSize(16);
    // Draw a fancy signature-like text
    doc.text("Thirumala Arohi", pageWidth - 30, 175, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Executive Vice President and Global Head", pageWidth - 30, 180, { align: "right" });
    doc.text("Education, Training & Assessment (ETA)", pageWidth - 30, 184, { align: "right" });
    doc.text("Prayukti Labs Limited", pageWidth - 30, 188, { align: "right" });

    // Save the PDF
    doc.save(`${studentName.replace(/\s+/g, '_')}_Certificate.pdf`);
};

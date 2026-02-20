import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'experiment-videos.json');

// Helper to ensure file exists
async function ensureFile() {
    try {
        await fs.access(DATA_FILE);
    } catch (error) {
        await fs.writeFile(DATA_FILE, '{}', 'utf-8');
    }
}

export async function GET() {
    await ensureFile();
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        console.error("Error reading video data:", error);
        return NextResponse.json({}, { status: 500 });
    }
}

export async function POST(request: Request) {
    await ensureFile();
    try {
        const body = await request.json();
        // Expecting body: { [labId]: "url", ... } OR just the whole object replacement if simpler, 
        // but better to merge partial updates if we want granularity.
        // For this specific 'Video Manager' feature, the admin sends the full map or partial updates.
        // Let's implement partial updates (patch-like) logic for robustness.

        // Read existing
        const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
        const existingData = JSON.parse(fileContent);

        // Merge new data
        const updatedData = { ...existingData, ...body };

        // Write back
        await fs.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2), 'utf-8');

        return NextResponse.json({ success: true, data: updatedData });
    } catch (error) {
        console.error("Error saving video data:", error);
        return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
    }
}

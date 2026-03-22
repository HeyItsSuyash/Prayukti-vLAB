import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    try {
        // Read token from Authorization header or cookies
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1] || req.cookies.get('vlab_token')?.value || req.cookies.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ message: "No session found" }, { status: 401 });
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

        // Call backend logout
        await axios.post(`${API_URL}/api/attendance/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return NextResponse.json({ message: "Logout successful" });
    } catch (err: any) {
        console.error("[LOGOUT PROXY ERROR]:", err.response?.data || err.message);
        // We still return 200/success to frontend so it can proceed with clearing local state
        return NextResponse.json({ message: "Logout processed with errors" }, { status: 200 });
    }
}

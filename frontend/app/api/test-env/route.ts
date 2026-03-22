export async function GET() {
    return Response.json({ 
        api_url: process.env.NEXT_PUBLIC_API_URL ?? null
    });
}

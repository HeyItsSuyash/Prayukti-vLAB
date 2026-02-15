
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: Request) {
    if (!GROQ_API_KEY) {
        return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    // 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const ratelimit = checkRateLimit(ip);

    if (!ratelimit.success) {
        return NextResponse.json({
            error: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((ratelimit.resetTime - Date.now()) / 1000)
        }, {
            status: 429,
            headers: { 'Retry-After': Math.ceil((ratelimit.resetTime - Date.now()) / 1000).toString() }
        });
    }

    try {
        const body = await req.json();
        const { message, subject } = body;

        // 2. Input Validation
        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message must be a non-empty string' }, { status: 400 });
        }

        if (message.length > 2000) {
            return NextResponse.json({ error: 'Message is too long (max 2000 characters)' }, { status: 400 });
        }

        if (!subject || typeof subject !== 'string') {
            return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
        }

        // Sanitize input (basic)
        const sanitizedMessage = message.trim();
        const sanitizedSubject = subject.trim();

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful and knowledgeable Lab Assistant for the subject "${sanitizedSubject}". 
Your goal is to help students understand concepts related to ${sanitizedSubject}. 

Formatting Guidelines:
- **Structure**: Organize your response into clear sections with descriptive headers if needed.
- **Highlighting**: Use **bolding** for key terms, definitions, and critical concepts.
- **Clarity**: Use bullet points or numbered lists for steps, items, or multiple points.
- **Conciseness**: Keep your answers accurate and easy to understand for engineering students.

If the question is not related to ${sanitizedSubject} or engineering, politely redirect them to the subject matter.`
                    },
                    {
                        role: "user",
                        content: sanitizedMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1,
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API Error Response:', errorText);
            throw new Error(`Groq API Error (${response.status})`);
        }

        const data = await response.json();
        const botResponse = data.choices?.[0]?.message?.content || "I'm having trouble processing that right now. Please try again.";

        return NextResponse.json({ response: botResponse.trim() });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch response from AI provider',
            details: error.message
        }, { status: 500 });
    }
}

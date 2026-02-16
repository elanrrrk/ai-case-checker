import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const runtime = 'edge';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { caseTitle, profession, solution, systemLogic, idealConcepts } = await req.json();

        if (!solution) {
            return NextResponse.json({ error: 'Solution is required' }, { status: 400 });
        }

        const systemPrompt = `You are a Senior Lead Mentor. Evaluate the user's solution for the case "${caseTitle}" in the field of "${profession}".
    
Context for evaluation:
${systemLogic || 'Эссе на профессиональную тему'}

Key terms that should be mentioned or concepts that should be covered:
${(idealConcepts || []).join(', ')}

Use a 0-10 scale. 
Provide a JSON response with:
- score (number)
- criteria (object with keys: logic, depth, practicality, all numbers 0-10)
- verdict (exactly 1 sentence in Russian)
- errors (array of strings in Russian, explaining what is wrong)
- missing_points (array of strings in Russian, what points were forgotten)
- recommendation (1-2 sentences in Russian, how to get 10/10)
- ideal_concepts (array of key terms from the provided list that WERE mentioned or relevant).

Response MUST be in Russian language and in valid JSON format. If you cannot evaluate, return a JSON with error field.`;

        let chatCompletion;
        try {
            chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: solution },
                ],
                model: 'llama-3.3-70b-versatile',
                response_format: { type: 'json_object' },
            });
        } catch (groqError: any) {
            console.error('Groq API Error Detail:', {
                status: groqError.status,
                message: groqError.message,
                error: groqError.error
            });

            if (groqError.status === 403) {
                return NextResponse.json({
                    error: 'Groq API Access Forbidden (403)',
                    details: 'Это обычно означает блокировку по региону (РФ) или отсутствие доступа к модели. Попробуйте использовать VPN на сервере.',
                    raw: groqError.message
                }, { status: 403 });
            }
            throw groqError; // Re-throw to be caught by the outer catch
        }

        const result = JSON.parse(chatCompletion.choices[0].message.content || '{}');
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('General Evaluation Error:', error);
        return NextResponse.json({
            error: 'Failed to evaluate solution',
            message: error.message
        }, { status: 500 });
    }
}

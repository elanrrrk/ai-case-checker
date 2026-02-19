import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            console.error("GROQ_API_KEY is not defined");
            return NextResponse.json(
                { error: "Конфигурация API не завершена" },
                { status: 500 }
            );
        }

        const { profession, caseTitle, description, solution, systemLogic, idealConcepts } = await req.json();

        const systemPrompt = `Ты — Senior Mentor и эксперт в области аналитики. Твоя специализация: ${profession}. 
    Оцени решение кейса "${caseTitle}".
    Описание кейса: ${description}
    Логика оценки и ожидаемые аспекты: ${systemLogic}
    Ключевые концепции, которые должны быть отражены: ${idealConcepts?.join(', ')}
    
    Оцени решение пользователя максимально объективно и конструктивно. Если решение отсутствует или не относится к теме, ставь 0.
    Если решение качественное, давай развернутый фидбек.
    {
      "score": number,
      "criteria": {
        "logic": "оценка (0-10)",
        "depth": "оценка (0-10)",
        "practicality": "оценка (0-10)"
      },
      "verdict": "краткое резюме",
      "errors": ["список ошибок"],
      "missing_points": ["чего не хватает"],
      "recommendation": "как улучшить",
      "ideal_concepts": ["ключевые термины"]
    }`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Решение пользователя: ${solution}` }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");
        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Evaluation error:", error);
        return NextResponse.json(
            { error: "Ошибка сервера при оценке" },
            { status: 500 }
        );
    }
}
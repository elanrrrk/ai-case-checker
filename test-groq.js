const { Groq } = require('groq-sdk');
try {
    require('dotenv').config({ path: '.env.local' });
} catch (e) {
    console.log('Note: dotenv not found, using process.env directly.');
}

async function main() {
    console.log('--- Groq Diagnostic Tool ---');
    console.log('API Key present:', !!process.env.GROQ_API_KEY);

    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });

    const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'];

    for (const model of models) {
        console.log(`\nTesting model: ${model}...`);
        try {
            const response = await groq.chat.completions.create({
                messages: [{ role: 'user', content: 'Say hello in Russian' }],
                model: model,
            });
            console.log('SUCCESS!');
            console.log('Response:', response.choices[0].message.content);
            break;
        } catch (err) {
            console.error(`FAILED (${model}):`, err.message);
            if (err.status === 403) {
                console.log('Observation: 403 Forbidden detected. This usually means:');
                console.log('1. Your region is blocked (Cloudflare).');
                console.log('2. The model is not available for your API key tier.');
            }
        }
    }
}

main();

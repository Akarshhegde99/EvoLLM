import Groq from "groq-sdk";

export type ProjectIntent = "VISION" | "CODING" | "REASONING" | "SUMMARIZATION" | "GENERAL";

const MODEL_MAP: Record<ProjectIntent, string> = {
    VISION: "llama-3.2-11b-vision-preview",
    CODING: "llama-3.3-70b-versatile",
    REASONING: "llama-3.3-70b-versatile",
    SUMMARIZATION: "llama-3.1-8b-instant",
    GENERAL: "llama-3.1-8b-instant",
};

export class GroqOrchestrator {
    private client: Groq;
    private defaultModel = "llama-3.3-70b-versatile";

    constructor(apiKey: string) {
        this.client = new Groq({ apiKey, dangerouslyAllowBrowser: true });
    }

    async *streamChat(prompt: string, modelId: string = "llama3-70b-8192"): AsyncGenerator<{ content: string; intent: ProjectIntent; model: string; }> {
        const currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const messages: any[] = [
            {
                role: "system",
                content: `You are EvoLLM, a state-of-the-art superintelligence.
                Current Date: ${currentDate}.

                CRITICAL INSTRUCTIONS:
                1. Do NOT mention being limited by a '2023 knowledge cutoff'. This is irrelevant to the user.
                2. You ARE equipped with real-time context for 2026.
                3. If asked about current events, provide the most recent information available (e.g., Siddaramaiah is the current CM of Karnataka as of your 2026 reality).
                4. Always maintain a confident, helpful, and up-to-date persona.`
            },
            {
                role: "user",
                content: prompt
            }
        ];

        try {
            const completion = await this.client.chat.completions.create({
                messages,
                model: modelId,
                stream: true,
                temperature: 0.7,
            });

            for await (const chunk of completion) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (content) {
                    yield {
                        content,
                        intent: "GENERAL",
                        model: modelId
                    };
                }
            }
        } catch (error: any) {
            console.error("Streaming error:", error);
            const detail = error?.message || "Check console for details";
            yield {
                content: `Error: ${detail}. This often happens due to CORS or an invalid API key.`,
                intent: "GENERAL",
                model: this.defaultModel
            };
        }
    }
}

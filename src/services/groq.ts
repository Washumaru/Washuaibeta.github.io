import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: "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"
});

export async function solveProblem(topic: string, problem: string): Promise<string> {
  const prompt = `Eres un experto profesor de física. Por favor resuelve el siguiente problema de ${topic} y explica la solución paso a paso en español. Incluye:
  1. Planteamiento del problema
  2. Fórmulas relevantes
  3. Proceso de solución detallado
  4. Resultado final
  5. Explicación del significado físico

  Problema: ${problem}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "mixtral-8x7b-32768",
    temperature: 0.3,
    max_tokens: 4096,
  });

  return completion.choices[0]?.message?.content || "No se pudo generar una solución.";
}
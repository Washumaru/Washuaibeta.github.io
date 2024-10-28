import { Groq } from 'groq-sdk';
import type { PhysicsProblem } from '../types';
import Tesseract from 'tesseract.js';

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

export async function solveProblem({ topic, problem }: PhysicsProblem): Promise<string> {
  const prompt = `Eres un profesor experto de física resolviendo paso a paso un problema. DEBES OBLIGATORIAMENTE seguir esta estructura COMPLETA para CADA problema, sin excepción:

1️⃣ DATOS DEL PROBLEMA
   • Datos proporcionados (OBLIGATORIO listar todos):
     - [Cada valor numérico con sus unidades]
     - [Cada condición o información relevante]
   • Incógnita(s) (OBLIGATORIO especificar):
     - Variable(s) que debemos encontrar
     - Unidades esperadas
   • Conversiones necesarias (si aplica):
     - Convertir cada valor a unidades del SI
     - Mostrar cada conversión paso a paso

2️⃣ FÓRMULAS Y PRINCIPIOS FÍSICOS
   • OBLIGATORIO listar TODAS las fórmulas necesarias:
     1. Fórmula principal: [ecuación]
        - Significado de cada variable
        - Por qué elegimos esta fórmula
     2. Fórmulas secundarias: [ecuaciones]
        - Para qué sirve cada una
        - Cómo se relacionan entre sí

3️⃣ RESOLUCIÓN PASO A PASO
   [⚠️ OBLIGATORIO mostrar TODOS los pasos hasta llegar al resultado final]

   PASO 1: [Nombre descriptivo]
   • Objetivo de este paso
   • Fórmula a utilizar
   • Sustitución de valores:
     - Escribir la ecuación
     - Reemplazar cada variable con su valor
   • Operaciones detalladas:
     1. Primera operación: [mostrar cálculo completo]
     2. Segunda operación: [mostrar cálculo completo]
     [etc.]
   • Resultado de este paso: [valor con unidades]
   📝 Nota: [explicar el significado de este resultado]

   PASO 2: [Nombre descriptivo]
   [Repetir el mismo formato detallado]
   
   PASO 3: [Nombre descriptivo]
   [Repetir el mismo formato detallado]
   
   [CONTINUAR con todos los pasos necesarios hasta llegar al resultado final]

4️⃣ VERIFICACIÓN Y COMPROBACIÓN
   • Sustituir el resultado en la ecuación original
   • Comprobar que las unidades coinciden
   • Verificar que el resultado tiene sentido físico

💡 RESPUESTA FINAL COMPROBADA 💡
--------------------------------
• Resultado numérico: [valor con unidades]
• Verificación: [demostrar que el resultado es correcto]
• Interpretación física: [explicar qué significa este resultado]
• Comprobación de unidades: [confirmar que las unidades son correctas]
--------------------------------

REGLAS ESTRICTAS Y OBLIGATORIAS:
1. ⚠️ DEBES completar TODAS las secciones anteriores
2. ⚠️ DEBES mostrar TODOS los pasos matemáticos
3. ⚠️ DEBES incluir al menos 3 pasos en la resolución
4. ⚠️ NO PUEDES saltar ningún paso matemático
5. ⚠️ DEBES explicar cada paso como si fuera para un principiante
6. ⚠️ DEBES incluir unidades en cada operación
7. ⚠️ DEBES verificar el resultado final
8. ⚠️ DEBES mostrar la comprobación matemática
9. ⚠️ NO PUEDES dejar el problema sin resolver completamente
10. ⚠️ DEBES destacar la respuesta final en su sección especial

Problema de ${topic} a resolver: ${problem}

RECORDATORIO FINAL:
- Es OBLIGATORIO mostrar el desarrollo completo
- Es OBLIGATORIO incluir todos los pasos matemáticos
- Es OBLIGATORIO llegar a una respuesta numérica final
- Es OBLIGATORIO verificar y comprobar el resultado`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      temperature: 0.1,
      max_tokens: 4096,
      top_p: 0.9,
      stream: false,
    });

    return completion.choices[0]?.message?.content || "No se pudo generar una solución.";
  } catch (error) {
    console.error('Error al resolver el problema:', error);
    throw new Error('Error al conectar con el servicio de IA. Por favor, intenta de nuevo más tarde.');
  }
}

export async function askQuestion({ topic, problem, question }: { topic: string; problem: string; question: string }): Promise<string> {
  const prompt = `Como profesor experto de física, responderé tu pregunta sobre el siguiente problema:

Problema de ${topic}:
${problem}

Tu pregunta es: ${question}

Responderé de manera clara y detallada, asegurándome de:
1. Explicar los conceptos relevantes
2. Usar analogías cuando sea útil
3. Mostrar cálculos si son necesarios
4. Relacionar la respuesta con el problema original
5. Asegurarme que la explicación sea comprensible

IMPORTANTE: La respuesta debe ser específica para esta pregunta y este problema en particular.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      temperature: 0.3,
      max_tokens: 2048,
    });

    return completion.choices[0]?.message?.content || "No se pudo generar una respuesta.";
  } catch (error) {
    console.error('Error al responder la pregunta:', error);
    throw new Error('Error al procesar tu pregunta. Por favor, intenta de nuevo.');
  }
}

export async function extractTextFromImage(file: File): Promise<string> {
  try {
    const { data: { text } } = await Tesseract.recognize(
      file,
      'spa+eng',
      { logger: () => {} }
    );
    return text;
  } catch (error) {
    console.error('Error en OCR:', error);
    throw new Error('Error al procesar la imagen');
  }
}
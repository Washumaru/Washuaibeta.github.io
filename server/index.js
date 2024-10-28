import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { Groq } from 'groq-sdk';
import Tesseract from 'tesseract.js';
import path from 'path';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Cache configuration (30 minutes TTL)
const cache = new NodeCache({ stdTTL: 1800 });

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const groq = new Groq({
  apiKey: "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"
});

// Helper function to generate cache key
const getCacheKey = (type, params) => {
  return `${type}:${JSON.stringify(params)}`;
};

app.post('/solve', async (req, res) => {
  try {
    const { topic, problem } = req.body;
    
    if (!topic || !problem) {
      return res.status(400).json({ error: 'Tema y problema son requeridos' });
    }

    const cacheKey = getCacheKey('solve', { topic, problem });
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      return res.json({ solution: cachedResult });
    }

    const prompt = `Eres un profesor experto de física que explica de manera clara y detallada. Resuelve el siguiente problema de ${topic} en español, siguiendo esta estructura específica:

    1. ANÁLISIS INICIAL
       - Identifica las variables dadas y las incógnitas
       - Explica los conceptos físicos relevantes
       - Menciona las suposiciones o aproximaciones necesarias

    2. FÓRMULAS Y PRINCIPIOS
       - Lista todas las fórmulas necesarias
       - Explica el significado físico de cada fórmula
       - Justifica por qué son aplicables en este caso

    3. SOLUCIÓN PASO A PASO
       Para cada paso:
       - Explica detalladamente qué se hace y por qué
       - Muestra los cálculos completos
       - Si un paso requiere explicación adicional, agrégala como una nota después del paso
       - Verifica las unidades en cada operación

    4. RESULTADO FINAL
       - Presenta el resultado con unidades apropiadas
       - Verifica si el resultado es razonable
       - Explica el significado físico del resultado

    5. CONSIDERACIONES ADICIONALES
       - Discute limitaciones de la solución
       - Sugiere posibles variaciones del problema
       - Menciona aplicaciones prácticas

    IMPORTANTE:
    - Para cada paso que requiera una explicación más profunda, agrega una nota explicativa precedida por "📝 Nota:"
    - Si un concepto es particularmente complejo, incluye una analogía o ejemplo de la vida real
    - Verifica que cada paso sea comprensible para estudiantes de nivel intermedio

    Problema a resolver: ${problem}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      temperature: 0.3,
      max_tokens: 4096,
    });

    const solution = completion.choices[0]?.message?.content;
    
    if (!solution) {
      return res.status(500).json({ error: 'No se pudo generar una solución' });
    }

    cache.set(cacheKey, solution);
    res.json({ solution });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/ocr', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    const cacheKey = getCacheKey('ocr', { buffer: req.file.buffer.toString('base64') });
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      return res.json({ text: cachedResult });
    }

    const { data: { text } } = await Tesseract.recognize(
      req.file.buffer,
      'spa+eng',
      { logger: () => {} }
    );

    cache.set(cacheKey, text);
    res.json({ text });
  } catch (error) {
    console.error('Error OCR:', error);
    res.status(500).json({ error: 'Error al procesar la imagen' });
  }
});

// Serve static files in development
if (process.env.NODE_ENV === 'development') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
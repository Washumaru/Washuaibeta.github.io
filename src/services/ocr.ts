import Tesseract from 'tesseract.js';

export async function extractTextFromImage(imageFile: File): Promise<string> {
  try {
    const result = await Tesseract.recognize(
      imageFile,
      'spa+eng',
      {
        logger: () => {} // Disable logging
      }
    );
    return result.data.text;
  } catch (error) {
    console.error('Error en OCR:', error);
    throw new Error('No se pudo procesar la imagen');
  }
}
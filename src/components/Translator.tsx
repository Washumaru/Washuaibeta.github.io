import React, { useState } from 'react';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { translateText } from '../services/api';

export function Translator() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState<'en' | 'es'>('en');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText) return;
    
    try {
      setLoading(true);
      const result = await translateText(inputText, sourceLang);
      setOutputText(result);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchLanguages = () => {
    setSourceLang(sourceLang === 'en' ? 'es' : 'en');
    setInputText(outputText);
    setOutputText(inputText);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Traductor de Física</h2>
        <button
          onClick={switchLanguages}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
        >
          <ArrowRightLeft className="w-5 h-5" />
          <span>Cambiar idiomas</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {sourceLang === 'en' ? 'Inglés' : 'Español'}
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg h-40 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder={`Escribe el texto en ${sourceLang === 'en' ? 'inglés' : 'español'}...`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {sourceLang === 'en' ? 'Español' : 'Inglés'}
          </label>
          <textarea
            value={outputText}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg h-40 bg-gray-50"
            placeholder="Traducción..."
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleTranslate}
          disabled={loading || !inputText}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span>Traducir</span>
          )}
        </button>
      </div>
    </div>
  );
}
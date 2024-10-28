import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { askQuestion } from '../services/api';

interface QuestionSectionProps {
  problem: string;
  topic: string;
}

export function QuestionSection({ problem, topic }: QuestionSectionProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionHistory, setQuestionHistory] = useState<Array<{ question: string; answer: string }>>([]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setLoading(true);
      const response = await askQuestion({ topic, problem, question });
      setQuestionHistory(prev => [...prev, { question, answer: response }]);
      setQuestion('');
      setAnswer(response);
    } catch (error) {
      console.error('Error al hacer la pregunta:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-purple-900 mb-4">
        ¿Tienes dudas sobre el problema?
      </h2>
      
      <form onSubmit={handleSubmitQuestion} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>Preguntar</span>
          </button>
        </div>
      </form>

      {questionHistory.length > 0 && (
        <div className="space-y-6">
          {questionHistory.map((item, index) => (
            <div key={index} className="border-l-4 border-purple-500 pl-4">
              <div className="font-semibold text-purple-900 mb-2">
                Pregunta: {item.question}
              </div>
              <div className="text-gray-700 bg-purple-50 p-4 rounded-lg">
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
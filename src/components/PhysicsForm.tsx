import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, Send, Loader2 } from 'lucide-react';
import { solveProblem, extractTextFromImage } from '../services/api';
import { SolutionDisplay } from './SolutionDisplay';
import { QuestionSection } from './QuestionSection';
import type { PhysicsTopic } from '../types';

const PHYSICS_TOPICS: PhysicsTopic[] = [
  { id: 'mechanics', name: 'Mecánica' },
  { id: 'thermodynamics', name: 'Termodinámica' },
  { id: 'electromagnetism', name: 'Electromagnetismo' },
  { id: 'waves', name: 'Ondas y Óptica' },
  { id: 'modern', name: 'Física Moderna' },
  { id: 'quantum', name: 'Física Cuántica' }
];

export function PhysicsForm() {
  const [topic, setTopic] = useState('');
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState('');
  const [error, setError] = useState('');
  const [currentProblem, setCurrentProblem] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      
      try {
        setLoading(true);
        setError('');
        const text = await extractTextFromImage(acceptedFiles[0]);
        setProblem(text);
      } catch (err) {
        setError('Error al procesar la imagen. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !problem) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await solveProblem({ topic, problem });
      setSolution(result);
      setCurrentProblem(problem); // Save current problem for context
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al resolver el problema');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tema de Física
          </label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Selecciona un tema</option>
            {PHYSICS_TOPICS.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escribe tu problema
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg h-40 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Describe tu problema de física aquí..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              O sube una imagen
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 h-40 flex flex-col items-center justify-center cursor-pointer ${
                isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Arrastra una imagen o haz clic para seleccionar
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50"
            onClick={() => {
              alert('Funcionalidad de cámara próximamente');
            }}
          >
            <Camera className="w-5 h-5" />
            <span>Tomar Foto</span>
          </button>
          <button
            type="submit"
            disabled={loading || !problem || !topic}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>Resolver</span>
          </button>
        </div>
      </form>

      {solution && (
        <>
          <SolutionDisplay solution={solution} />
          <QuestionSection problem={currentProblem} topic={topic} />
        </>
      )}
    </div>
  );
}
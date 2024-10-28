import React from 'react';

interface SolutionDisplayProps {
  solution: string;
}

export function SolutionDisplay({ solution }: SolutionDisplayProps) {
  const formatSolution = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Format final answer section
      if (line.includes('💡 RESPUESTA FINAL COMPROBADA 💡')) {
        return (
          <div key={index} className="my-8 bg-green-50 p-6 rounded-lg border-2 border-green-500">
            <h3 className="text-xl font-bold text-green-800 mb-4 text-center">
              💡 RESPUESTA FINAL COMPROBADA 💡
            </h3>
            <div className="border-t-2 border-green-300 pt-4">
              {/* Content will be handled by subsequent lines */}
            </div>
          </div>
        );
      }

      // Format the dashed lines in final answer section
      if (line.match(/^-+$/)) {
        return null; // Skip dashed lines
      }

      // Format content within final answer section
      if (line.startsWith('•') && text.includes('💡 RESPUESTA FINAL COMPROBADA 💡')) {
        return (
          <div key={index} className="mb-3 text-green-800 font-medium">
            {line}
          </div>
        );
      }

      // Format section headers (numbered sections)
      if (line.match(/^\d+\.\s+[A-Z]/)) {
        return (
          <h3 key={index} className="text-xl font-bold text-purple-800 mt-8 mb-4 border-b-2 border-purple-200 pb-2">
            {line}
          </h3>
        );
      }

      // Format subsection headers (with bullets)
      if (line.match(/^•\s+[A-Z]/)) {
        return (
          <h4 key={index} className="text-lg font-semibold text-purple-700 mt-4 mb-2">
            {line}
          </h4>
        );
      }

      // Format notes with emoji
      if (line.includes('📝 Nota:')) {
        return (
          <div key={index} className="bg-purple-50 p-4 rounded-lg my-3 border-l-4 border-purple-400">
            <p className="text-purple-800 font-medium">{line}</p>
          </div>
        );
      }

      // Format mathematical formulas and equations
      if (line.includes('=') && !line.includes('Ejemplo:')) {
        return (
          <div key={index} className="bg-blue-50 p-3 rounded-lg my-2 font-mono text-blue-800">
            {line}
          </div>
        );
      }

      // Format calculation steps
      if (line.match(/^\d+\.\s+[A-Za-z]/)) {
        return (
          <div key={index} className="ml-4 my-2 font-mono text-gray-700">
            {line}
          </div>
        );
      }

      // Format bullet points
      if (line.match(/^\s*[-•]\s/)) {
        return (
          <li key={index} className="ml-6 mb-2 list-disc">
            {line.replace(/^\s*[-•]\s/, '')}
          </li>
        );
      }

      // Regular text
      return (
        <p key={index} className="my-2 text-gray-700">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="mt-8 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">Solución Detallada:</h2>
      <div className="prose max-w-none">
        {formatSolution(solution)}
      </div>
      <div className="mt-6 text-sm text-gray-500 text-right">
        Powered by WashuAI Physics Solver
      </div>
    </div>
  );
}
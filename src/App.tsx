import React from 'react';
import { Brain, GraduationCap } from 'lucide-react';
import { PhysicsForm } from './components/PhysicsForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Brain className="w-10 h-10 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                WashuAI Physics Solver
              </h1>
              <p className="text-gray-500 flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>Tu asistente inteligente para problemas de física</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <main className="bg-white rounded-xl shadow-sm p-6">
          <PhysicsForm />
        </main>
      </div>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} WashuAI Physics Solver. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
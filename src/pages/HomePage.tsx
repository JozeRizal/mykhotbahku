import React from 'react';
import { useSermons } from '../context/SermonContext';
import { BookOpen, Clock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { sermons, setCurrentSermon } = useSermons();
  const navigate = useNavigate();

  const handleCreateNew = () => {
    setCurrentSermon(null);
    navigate('/write');
  };

  return (
    <div className="p-6 pb-24 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shalom, Pelayan Tuhan</h1>
        <p className="text-gray-500">Siapkan pesan terbaik untuk jemaat hari ini.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={handleCreateNew}
          className="flex items-center justify-between p-6 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
        >
          <div className="text-left">
            <h2 className="text-xl font-semibold">Tulis Khotbah Baru</h2>
            <p className="text-indigo-100 text-sm">Mulai draf atau gunakan AI</p>
          </div>
          <Plus size={32} />
        </button>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Terakhir Diedit</h3>
            <button onClick={() => navigate('/archive')} className="text-indigo-600 text-sm font-medium">Lihat Semua</button>
          </div>

          {sermons.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl">
              <BookOpen className="mx-auto text-gray-300 mb-2" size={40} />
              <p className="text-gray-400 text-sm">Belum ada khotbah yang tersimpan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sermons.slice(0, 3).map((sermon) => (
                <div
                  key={sermon.id}
                  onClick={() => {
                    setCurrentSermon(sermon);
                    navigate('/write');
                  }}
                  className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm active:bg-gray-50 transition-colors"
                >
                  <h4 className="font-semibold text-gray-900 truncate">{sermon.title || 'Tanpa Judul'}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {new Date(sermon.updatedAt).toLocaleDateString()}
                    </p>
                    {sermon.duration && (
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md font-bold">{sermon.duration}m</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <footer className="pt-8 text-center text-gray-400 text-xs">
        <p>© 2026 Joze Rizal</p>
      </footer>
    </div>
  );
};

import React from 'react';
import { useSermons } from '../context/SermonContext';
import { Book, Trash2, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ArchivePage: React.FC = () => {
  const { sermons, setCurrentSermon, deleteSermon } = useSermons();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');

  const filteredSermons = sermons.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.verse.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 pb-24 space-y-6">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Arsip Khotbah</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari tema atau ayat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </header>

      <div className="space-y-3">
        {filteredSermons.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Book className="mx-auto mb-2 opacity-20" size={48} />
            <p>Tidak ada khotbah ditemukan.</p>
          </div>
        ) : (
          filteredSermons.map((sermon) => (
            <div
              key={sermon.id}
              className="group bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm active:bg-gray-50 transition-colors"
            >
              <div 
                className="flex-1 min-w-0 mr-4"
                onClick={() => {
                  setCurrentSermon(sermon);
                  navigate('/write');
                }}
              >
                <h4 className="font-semibold text-gray-900 truncate">{sermon.title || 'Tanpa Judul'}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-gray-500 truncate">{sermon.verse || 'Tanpa Ayat'}</p>
                  {sermon.duration && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md font-bold">{sermon.duration}m</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => deleteSermon(sermon.id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <ChevronRight size={20} className="text-gray-300" />
              </div>
            </div>
          ))
        )}
      </div>

      <footer className="pt-8 text-center text-gray-400 text-xs">
        <p>© 2026 Joze Rizal</p>
      </footer>
    </div>
  );
};

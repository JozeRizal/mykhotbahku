import React, { useState, useEffect, useRef } from 'react';
import { useSermons } from '../context/SermonContext';
import { Play, Pause, Settings, ChevronLeft, Type, FastForward, Home, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TeleprompterPage: React.FC = () => {
  const { currentSermon, sermons } = useSermons();
  const navigate = useNavigate();
  
  const sermon = currentSermon || sermons[0];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [fontSize, setFontSize] = useState(32);
  const [scrollSpeed, setScrollSpeed] = useState(0.6);
  const [showSettings, setShowSettings] = useState(false);
  const [timeLeft, setTimeLeft] = useState(parseInt(sermon?.duration || '10') * 60);
  
  useEffect(() => {
    if (sermon) {
      setTimeLeft(parseInt(sermon.duration || '10') * 60);
    }
  }, [sermon?.id]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(null);
  const scrollPosRef = useRef<number>(0);

  useEffect(() => {
    if (isPlaying && scrollRef.current) {
      scrollPosRef.current = scrollRef.current.scrollTop;
    }
  }, [isPlaying]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scroll = () => {
    if (scrollRef.current && isPlaying) {
      scrollPosRef.current += scrollSpeed;
      scrollRef.current.scrollTop = scrollPosRef.current;
    }
    requestRef.current = requestAnimationFrame(scroll);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(scroll);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, scrollSpeed]);

  if (!sermon) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-500 mb-4">Belum ada khotbah yang dipilih untuk ditampilkan di mimbar.</p>
        <button onClick={() => navigate('/write')} className="bg-indigo-600 px-6 py-2 rounded-full font-semibold">Tulis Sekarang</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col z-[60]">
      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md z-20">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 text-gray-400 active:bg-zinc-800 rounded-full transition-colors"
          aria-label="Kembali ke Beranda"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-sm font-medium text-gray-300 truncate max-w-[150px]">{sermon.title}</h2>
        <div className={`px-3 py-1 rounded-full font-mono text-sm font-bold bg-red-500/20 text-red-500 ${timeLeft < 60 ? 'animate-pulse' : ''}`}>
          {formatTime(timeLeft)}
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)} 
          className="p-2 text-gray-400 active:bg-zinc-800 rounded-full transition-colors"
        >
          <Settings size={24} />
        </button>
      </header>

      {/* Settings Overlay */}
      {showSettings && (
        <div className="absolute top-16 right-4 left-4 bg-zinc-800 p-4 rounded-2xl shadow-2xl z-20 space-y-4 border border-zinc-700">
          <div className="space-y-2">
            <label className="text-xs text-gray-400 flex items-center">
              <Type size={14} className="mr-2" /> Ukuran Teks: {fontSize}px
            </label>
            <input 
              type="range" min="20" max="80" value={fontSize} 
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-400 flex items-center">
              <FastForward size={14} className="mr-2" /> Kecepatan Scroll: {scrollSpeed}
            </label>
            <input 
              type="range" min="0.1" max="5" step="0.1" value={scrollSpeed} 
              onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="pt-2">
            <button 
              onClick={() => setTimeLeft(parseInt(sermon?.duration || '10') * 60)}
              className="w-full flex items-center justify-center space-x-2 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-xl transition-colors text-xs"
            >
              <Clock size={14} />
              <span>Reset Timer ({sermon?.duration || '10'}m)</span>
            </button>
          </div>
          
          <div className="pt-2 border-t border-zinc-700">
            <button 
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center space-x-2 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-xl transition-colors"
            >
              <Home size={18} />
              <span className="text-sm font-medium">Kembali ke Menu Utama</span>
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 pt-20 pb-40 scroll-smooth"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-yellow-400 font-bold mb-4">{sermon.title}</h1>
          <p className="text-indigo-400 font-medium mb-8 italic">{sermon.verse}</p>
          <div className="whitespace-pre-wrap text-zinc-100">
            {sermon.content}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center px-6">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
      </div>

      {/* Visual Guide Line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-indigo-500/20 pointer-events-none" />
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useSermons } from '../context/SermonContext';
import { Sparkles, Save, Download, MoreVertical, ChevronLeft, Clock, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { jsPDF } from "jspdf";

export const EditorPage: React.FC = () => {
  const { currentSermon, saveSermon } = useSermons();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState(currentSermon?.title || '');
  const [verse, setVerse] = useState(currentSermon?.verse || '');
  const [content, setContent] = useState(currentSermon?.content || '');
  const [duration, setDuration] = useState(currentSermon?.duration || '10');
  const [targetAudience, setTargetAudience] = useState('Umum');
  const [churchType, setChurchType] = useState('Umum');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFABMenu, setShowFABMenu] = useState(false);
  const [showAIPicker, setShowAIPicker] = useState(false);
  const [showThemeSuggestions, setShowThemeSuggestions] = useState(false);

  const holidayThemes = [
    {
      holiday: "Jumat Agung",
      themes: ["Kasih yang Berkorban", "Selesailah Sudah", "Salib Kristus: Kemenangan Sejati", "Penebusan yang Sempurna"]
    },
    {
      holiday: "Paskah",
      themes: ["Kebangkitan-Nya, Pengharapan Kita", "Maut Telah Dikalahkan", "Hidup Baru dalam Kristus", "Kubur Kosong: Bukti Kemenangan"]
    },
    {
      holiday: "Natal",
      themes: ["Immanuel: Allah Menyertai Kita", "Kelahiran Sang Raja Damai", "Kado Terindah dari Surga", "Cahaya di Tengah Kegelapan"]
    },
    {
      holiday: "Kenaikan Yesus",
      themes: ["Naik ke Surga, Menyediakan Tempat", "Amanat Agung: Pergilah ke Seluruh Dunia", "Menanti Janji Roh Kudus"]
    },
    {
      holiday: "Pentakosta",
      themes: ["Api Roh Kudus yang Membakar Semangat", "Dipenuhi Kuasa untuk Bersaksi", "Bahasa Kasih Roh Kudus"]
    }
  ];

  const sermonId = useRef(currentSermon?.id || Math.random().toString(36).substr(2, 9));

  // Auto-save logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content || verse) {
        setIsSaving(true);
        saveSermon({
          id: sermonId.current,
          title,
          verse,
          content,
          duration,
          updatedAt: Date.now()
        });
        setTimeout(() => setIsSaving(false), 1000);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [title, verse, content]);

  const handleGenerateAI = async () => {
    if (!title && !verse) {
      alert('Masukkan Tema atau Ayat terlebih dahulu.');
      return;
    }
    
    setIsGenerating(true);
    setShowAIPicker(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      let systemPrompt = "";
      if (churchType === "Umum") {
        systemPrompt = "Anda adalah seorang pembicara Kristen yang melayani audiens interdenominasi (berbagai latar belakang gereja). Buatlah draf khotbah yang bersifat universal, praktis, dan berpusat pada Kristus. Gunakan gaya bahasa yang hangat, mudah dipahami, dan relevan dengan kehidupan modern sehari-hari. Fokuskan pada prinsip-prinsip Alkitab dasar seperti kasih, pengharapan, pengampunan, dan iman. Hindari jargon teologi atau doktrin spesifik dari denominasi tertentu. Buat struktur yang sederhana: Pendahuluan yang menarik (hook), 2-3 poin aplikasi praktis, dan ditutup dengan doa berkat yang menguatkan jemaat.";
      } else if (churchType === "Karismatik/Pentakosta") {
        systemPrompt = "Anda adalah seorang Pendeta Pentakosta/Karismatik yang penuh urapan dan berapi-api. Buatlah sebuah draf Khotbah Topikal berdasarkan tema yang diberikan. Gunakan gaya bahasa yang energetik, motivasional, dan sangat relevan dengan pergumulan hidup jemaat sehari-hari. Tekankan pada karya Roh Kudus, mukjizat, kemenangan iman, dan terobosan. Sertakan instruksi interaksi dengan jemaat (misal: 'Katakan Amin!'). Wajib akhiri khotbah ini dengan kalimat 'Altar Call' yang kuat untuk mengundang jemaat maju ke depan mimbar agar didoakan.";
      } else if (churchType === "Protestan") {
        systemPrompt = "Anda adalah seorang Pendeta Protestan Calvinis/Reformed yang akademis dan teologis. Buatlah sebuah draf Khotbah Ekspositoriberdasarkan tema/ayat yang diberikan. Gunakan gaya bahasa yang edukatif, terstruktur rapi, dan berbobot. Bedah ayat secara mendalam (latar belakang sejarah/konteks). Strukturnya harus logis: Pendahuluan, 3 Poin Utama pembedahan firman, dan diakhiri dengan Kesimpulan Praktis yang menekankan kedaulatan Tuhan dan anugerah.";
      } else if (churchType === "Katolik") {
        systemPrompt = "Anda adalah seorang Pastor Katolik yang bijaksana dan kontemplatif. Buatlah sebuah draf Homili berdasarkan tema/bacaan Injil yang diberikan. Gunakan gaya bahasa yang syahdu, reflektif, dan damai. Fokuskan isi pesan pada refleksi moral harian, nilai-nilai tradisi gereja, dan arahkan penutupnya untuk mempersiapkan hati umat menerima sakramen Ekaristi (Komuni Kudus). Buat tanpa poin-poin yang kaku, melainkan mengalir seperti sebuah cerita naratif rohani.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Instruksi Utama: ${systemPrompt}
        
        Spesifikasi Tambahan:
        Tema: ${title}
        Ayat Alkitab: ${verse}
        Durasi Khotbah: Sekitar ${duration} menit
        Target Audiens: ${targetAudience}
        
        Ketentuan Konten (WAJIB ADA):
        1. Doa Pembukaan: Buat doa pembukaan yang sesuai dengan gaya ${churchType} dan relevan untuk ${targetAudience} serta tema ${title}.
        2. Isi Khotbah: Sertakan Ilustrasi/Cerita Contoh yang sangat relevan dengan kehidupan sehari-hari ${targetAudience} sesuai tema.
        3. Kesimpulan & Aplikasi Praktis: Berikan ajakan atau bukti penerapan nyata yang bisa dilakukan oleh ${targetAudience} dalam konteks mereka.
        4. Doa Penutup: Buat doa penutup/berkat yang menguatkan, sesuai dengan gaya ${churchType} dan memberkati ${targetAudience}.
        
        Gaya Bahasa: Sesuaikan dengan target audiens ${targetAudience}.
        
        PENTING: JANGAN gunakan karakter markdown seperti ### atau ** dalam teks. Gunakan teks biasa yang bersih. Berikan label yang jelas seperti "DOA PEMBUKAAN", "ISI KHOTBAH", "KESIMPULAN", dan "DOA PENUTUP".`,
      });

      let generatedText = response.text || '';
      
      // Clean up Markdown characters (###, **) as requested
      generatedText = generatedText.replace(/#{1,6}\s?/g, '').replace(/\*\*/g, '');
      
      // Replace content instead of appending to start fresh with new settings
      setContent(generatedText);
    } catch (error) {
      console.error('AI Generation Error:', error);
      alert('Gagal menghasilkan draf AI. Pastikan koneksi internet stabil.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportText = () => {
    const element = document.createElement("a");
    const file = new Blob([`JUDUL: ${title}\nAYAT: ${verse}\n\n${content}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${title || 'khotbah'}.txt`;
    document.body.appendChild(element);
    element.click();
    alert('Draf berhasil diekspor sebagai Teks.');
    setShowFABMenu(false);
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      let cursorY = 20;

      // Title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      const titleLines = doc.splitTextToSize(title || "Khotbah Tanpa Judul", contentWidth);
      doc.text(titleLines, margin, cursorY);
      cursorY += (titleLines.length * 8) + 5;

      // Verse
      doc.setFontSize(12);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      const verseLines = doc.splitTextToSize(verse || "Tanpa Ayat Referensi", contentWidth);
      doc.text(verseLines, margin, cursorY);
      cursorY += (verseLines.length * 6) + 10;

      // Content
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      const contentLines = doc.splitTextToSize(content, contentWidth);
      
      // Handle multi-page
      contentLines.forEach((line: string) => {
        if (cursorY > 280) {
          doc.addPage();
          cursorY = 20;
        }
        doc.text(line, margin, cursorY);
        cursorY += 6;
      });

      doc.save(`${title || 'khotbah'}.pdf`);
      alert('Draf berhasil diekspor sebagai PDF.');
      setShowFABMenu(false);
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Gagal mengekspor PDF.');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between z-10">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center space-x-2">
          <AnimatePresence>
            {isSaving && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-gray-400 font-medium uppercase tracking-widest"
              >
                Auto-saving...
              </motion.span>
            )}
          </AnimatePresence>
          <div className="relative">
            <button 
              onClick={() => setShowAIPicker(!showAIPicker)}
              disabled={isGenerating}
              className="flex items-center space-x-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-xs font-semibold active:scale-95 transition-transform disabled:opacity-50"
            >
              <Sparkles size={14} />
              <span>{isGenerating ? 'Generating...' : `AI Draft`}</span>
            </button>

            <AnimatePresence>
              {showAIPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-2xl p-4 z-20 min-w-[240px] space-y-4"
                >
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Latar Belakang Gereja</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Umum', 'Karismatik/Pentakosta', 'Protestan', 'Katolik'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setChurchType(c)}
                          className={`px-3 py-2 rounded-lg text-[10px] transition-colors border ${churchType === c ? 'bg-indigo-600 text-white border-indigo-600 font-bold' : 'text-gray-600 border-gray-100 hover:bg-gray-50'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Target Audiens</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Umum', 'Bapak-bapak', 'Ibu-ibu', 'Pemuda', 'Remaja', 'Anak-anak'].map((a) => (
                        <button
                          key={a}
                          onClick={() => setTargetAudience(a)}
                          className={`px-3 py-2 rounded-lg text-xs transition-colors border ${targetAudience === a ? 'bg-indigo-600 text-white border-indigo-600 font-bold' : 'text-gray-600 border-gray-100 hover:bg-gray-50'}`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Durasi</p>
                    <div className="flex flex-wrap gap-2">
                      {['5', '10', '15', '20', '30'].map((d) => (
                        <button
                          key={d}
                          onClick={() => setDuration(d)}
                          className={`flex-1 min-w-[40px] px-3 py-2 rounded-lg text-xs transition-colors border ${duration === d ? 'bg-indigo-600 text-white border-indigo-600 font-bold' : 'text-gray-600 border-gray-100 hover:bg-gray-50'}`}
                        >
                          {d}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateAI}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-transform"
                  >
                    Generate Sekarang
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Tema Khotbah..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold border-none focus:ring-0 placeholder:text-gray-300 p-0"
            />
            <button 
              onClick={() => setShowThemeSuggestions(!showThemeSuggestions)}
              className="p-2 text-indigo-400 hover:text-indigo-600 transition-colors"
              title="Saran Tema Hari Besar"
            >
              <Lightbulb size={20} />
            </button>
          </div>

          <AnimatePresence>
            {showThemeSuggestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-indigo-50/50 rounded-2xl p-4 space-y-4 border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Saran Tema Hari Besar</p>
                    <button onClick={() => setShowThemeSuggestions(false)} className="text-[10px] text-indigo-400 font-bold uppercase">Tutup</button>
                  </div>
                  <div className="space-y-4">
                    {holidayThemes.map((group) => (
                      <div key={group.holiday} className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{group.holiday}</p>
                        <div className="flex flex-wrap gap-2">
                          {group.themes.map((t) => (
                            <button
                              key={t}
                              onClick={() => {
                                setTitle(t);
                                setShowThemeSuggestions(false);
                              }}
                              className="px-3 py-1.5 bg-white border border-indigo-100 rounded-full text-xs text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input
          type="text"
          placeholder="Ayat Alkitab (Contoh: Yohanes 3:16)..."
          value={verse}
          onChange={(e) => setVerse(e.target.value)}
          className="w-full text-lg text-indigo-600 font-medium border-none focus:ring-0 placeholder:text-indigo-200 p-0"
        />
        <textarea
          placeholder="Mulai menulis khotbah Anda di sini..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[60vh] text-gray-700 leading-relaxed border-none focus:ring-0 placeholder:text-gray-300 p-0 resize-none"
        />
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 flex flex-col items-end space-y-3">
        <AnimatePresence>
          {showFABMenu && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col space-y-2 mb-2"
            >
              <button 
                onClick={handleExportPDF}
                className="flex items-center space-x-2 bg-white border border-gray-200 shadow-lg px-4 py-2 rounded-full text-sm text-gray-600"
              >
                <Download size={16} className="text-red-500" />
                <span>Export PDF</span>
              </button>
              <button 
                onClick={handleExportText}
                className="flex items-center space-x-2 bg-white border border-gray-200 shadow-lg px-4 py-2 rounded-full text-sm text-gray-600"
              >
                <Download size={16} className="text-blue-500" />
                <span>Export Teks</span>
              </button>
              <button 
                onClick={() => {
                  saveSermon({ id: sermonId.current, title, verse, content, duration, updatedAt: Date.now() });
                  navigate('/mimbar');
                }}
                className="flex items-center space-x-2 bg-white border border-gray-200 shadow-lg px-4 py-2 rounded-full text-sm text-gray-600"
              >
                <Save size={16} />
                <span>Buka di Mimbar</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setShowFABMenu(!showFABMenu)}
          className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-transform"
        >
          <MoreVertical size={24} />
        </button>
      </div>
    </div>
  );
};

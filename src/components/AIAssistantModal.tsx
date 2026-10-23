import React, { useState } from 'react';
import { Mic, Camera, Sparkles, CheckCircle2, AlertTriangle, X, Loader2, ArrowRight } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyMatches: (matches: { id: string; qty: number; note?: string }[]) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyMatches,
}) => {
  const [activeMode, setActiveMode] = useState<'voice' | 'ocr'>('voice');
  const [transcript, setTranscript] = useState('bakso ikan 45, boci keju 30, telur 3 rak, jamur enoki 2 dus, sambel seblak 4, cup 22 oz 80');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [matchedResults, setMatchedResults] = useState<any[]>([]);
  const [ambiguousResults, setAmbiguousResults] = useState<any[]>([]);
  const [unrecognizedResults, setUnrecognizedResults] = useState<string[]>([]);

  // OCR state
  const [ocrImagePreview, setOcrImagePreview] = useState<string | null>(null);

  if (!isOpen) return null;

  // Browser speech recognition test
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser tidak mendukung SpeechRecognition bawaan. Anda bisa mengetik atau memilih contoh kalimat cepat di bawah.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(prev => (prev ? prev + ', ' + text : text));
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleProcessVoice = async () => {
    if (!transcript.trim()) {
      setErrorMsg('Masukkan teks atau rekam suara terlebih dahulu.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    setMatchedResults([]);
    setAmbiguousResults([]);
    setUnrecognizedResults([]);

    try {
      const res = await fetch('/api/ai/voice-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memproses AI');

      setMatchedResults(data.matched || []);
      setAmbiguousResults(data.ambiguous || []);
      setUnrecognizedResults(data.unrecognized || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Koneksi ke Gemini AI terganggu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setOcrImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessOCR = async () => {
    if (!ocrImagePreview) {
      setErrorMsg('Pilih foto catatan terlebih dahulu.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    setMatchedResults([]);
    setAmbiguousResults([]);

    try {
      const res = await fetch('/api/ai/ocr-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: ocrImagePreview,
          mimeType: 'image/jpeg',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membaca foto');

      const matches = (data.extracted_items || [])
        .filter((item: any) => item.matched_id)
        .map((item: any) => ({
          id_barang: item.matched_id,
          nama_item: item.matched_name,
          jumlah_final_standar: item.stok_fisik,
          satuan_standar: 'Unit',
          catatan_konversi: item.catatan || item.raw_text,
        }));

      setMatchedResults(matches);
    } catch (err: any) {
      setErrorMsg(err.message || 'Koneksi AI Vision gagal');
    } finally {
      setIsLoading(false);
    }
  };

  const applyToForm = () => {
    const formatted = matchedResults.map(item => ({
      id: item.id_barang,
      qty: item.jumlah_final_standar,
      note: item.catatan_konversi ? `AI: ${item.catatan_konversi}` : undefined,
    }));
    onApplyMatches(formatted);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/60 border border-indigo-400/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Asisten Input AI (Suara & Kamera)</h3>
              <p className="text-[11px] text-indigo-200">Gemini 3.8 Flash • Cabang Samata</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-indigo-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 p-2 bg-gray-100 border-b border-gray-200 text-xs font-semibold">
          <button
            onClick={() => setActiveMode('voice')}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              activeMode === 'voice'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mic className="w-4 h-4" /> Input Suara Kasir
          </button>
          <button
            onClick={() => setActiveMode('ocr')}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              activeMode === 'ocr'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Camera className="w-4 h-4" /> Baca Foto Catatan
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeMode === 'voice' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">
                  Ucapkan atau ketik daftar hitungan fisik:
                </label>
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium transition-colors ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  {isRecording ? 'Merekam... Klik Berhenti' : 'Bicara Sekarang'}
                </button>
              </div>

              <textarea
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                rows={3}
                placeholder="Contoh: bakso ikan 45, boci keju 30, telur 3 rak, enoki 2 dus, teh 5 pack..."
                className="w-full text-xs p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              {/* Sample phrases */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] text-gray-400 self-center">Contoh cepat:</span>
                <button
                  onClick={() => setTranscript('bakso ikan 45, boci keju 30, telur 3 rak, enoki 2 dus')}
                  className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md"
                >
                  Topping + Telur 3 Rak
                </button>
                <button
                  onClick={() => setTranscript('bumbu tomyam 2, sambel seblak 3 pack, minyak goreng 4')}
                  className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md"
                >
                  Bumbu Dapur
                </button>
                <button
                  onClick={() => setTranscript('sedotan 2 pack, sendok plastik 3 pack, cup 22 oz 95')}
                  className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md"
                >
                  Bahan Operasional
                </button>
              </div>

              <button
                onClick={handleProcessVoice}
                disabled={isLoading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Menganalisis Suara dengan Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Proses Kalimat Suara
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-700 block">
                Unggah Foto Catatan Opname Manual (Kertas/Struk):
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {ocrImagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={ocrImagePreview}
                      alt="Preview"
                      className="max-h-40 mx-auto rounded-lg object-contain"
                    />
                    <p className="text-[11px] text-indigo-600 font-medium">Klik untuk mengganti foto</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-xs font-medium text-gray-700">Pilih foto dari galeri / kamera</p>
                    <p className="text-[10px] text-gray-400">Format JPG, PNG, atau WEBP</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleProcessOCR}
                disabled={isLoading || !ocrImagePreview}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Membaca Foto dengan Gemini Vision...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Ekstrak Angka dari Foto
                  </>
                )}
              </button>
            </div>
          )}

          {/* AI MATCH RESULT LIST */}
          {matchedResults.length > 0 && (
            <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-3 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {matchedResults.length} Item Berhasil Dikenali
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                  Siap Dimasukkan
                </span>
              </div>

              <div className="divide-y divide-emerald-100 text-xs max-h-48 overflow-y-auto pr-1">
                {matchedResults.map((m, idx) => (
                  <div key={idx} className="py-1.5 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{m.nama_item}</p>
                      <p className="text-[10px] text-gray-500">
                        SKU: {m.id_barang}{' '}
                        {m.catatan_konversi && `• Konversi: ${m.catatan_konversi}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded text-xs">
                        {m.jumlah_final_standar} {m.satuan_standar}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AMBIGUOUS ITEMS */}
          {ambiguousResults.length > 0 && (
            <div className="border border-amber-200 bg-amber-50 rounded-xl p-3 space-y-2">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Item Ambigu Butuh Konfirmasi
              </span>
              <div className="space-y-1 text-xs">
                {ambiguousResults.map((a, idx) => (
                  <div key={idx} className="bg-white p-2 rounded-lg border border-amber-200">
                    <p className="font-semibold text-gray-800">"{a.input_term}"</p>
                    <p className="text-[10px] text-amber-700">{a.alasan}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {a.suggested_ids?.map((id: string) => (
                        <span key={id} className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">
                          {id}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UNRECOGNIZED ITEMS */}
          {unrecognizedResults.length > 0 && (
            <div className="p-2.5 bg-gray-100 rounded-lg text-xs text-gray-600">
              <span className="font-semibold text-gray-700">Tidak ditemukan di master: </span>
              {unrecognizedResults.join(', ')}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800"
          >
            Batal
          </button>
          <button
            onClick={applyToForm}
            disabled={matchedResults.length === 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            Terapkan ke Form Opname ({matchedResults.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

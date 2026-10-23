import React, { useState } from 'react';
import {
  Calendar,
  Download,
  Copy,
  Check,
  X,
  FileText,
  Lock,
  ExternalLink,
  Trash2,
  Clock,
  User,
} from 'lucide-react';
import { OpnameItemData, formatOpnameTextLine } from '../data/rawAndCleanData';

export interface SavedOpnameRecord {
  tanggal: string; // YYYY-MM-DD
  cabang: string;
  kasirName: string;
  partnerName: string;
  items: OpnameItemData[];
  stockQuantities: Record<string, { pack: number; pcs: number }>;
  isLocked: boolean;
  savedAt: string;
}

interface HistoryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedRecords: Record<string, SavedOpnameRecord>;
  currentSelectedDate: string;
  onSelectDate: (date: string) => void;
  onDeleteRecord: (date: string) => void;
}

export const HistoryReportModal: React.FC<HistoryReportModalProps> = ({
  isOpen,
  onClose,
  savedRecords,
  currentSelectedDate,
  onSelectDate,
  onDeleteRecord,
}) => {
  const datesList = Object.keys(savedRecords).sort().reverse();
  const [activeDate, setActiveDate] = useState<string>(
    datesList.includes(currentSelectedDate) ? currentSelectedDate : (datesList[0] || currentSelectedDate)
  );
  const [copiedDate, setCopiedDate] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentRecord = savedRecords[activeDate];

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const isDatePastMidnight = (dStr: string) => dStr < getTodayStr();

  // Helper to generate the exact formatted report text for any record
  const getReportText = (record: SavedOpnameRecord) => {
    let output = `LAPORAN STOK OPNAME - CABANG ${record.cabang.toUpperCase()}\n`;
    output += `Tanggal : ${record.tanggal}\n`;
    output += `Kasir   : ${record.kasirName || '-'}\n`;
    output += `Partner : ${record.partnerName || '-'}\n`;
    output += `Disimpan: ${record.savedAt || '-'}\n`;
    output += `=========================================\n\n`;

    record.items.forEach((item, index) => {
      const stock = record.stockQuantities[item.id_barang] || { pack: 0, pcs: 0 };
      const line = formatOpnameTextLine(item.nama_item, stock.pack, item.isi_per_pack, stock.pcs);
      output += `${index + 1}. ${line}\n`;
    });

    const isPast = isDatePastMidnight(record.tanggal);
    const lockedStatus = record.isLocked || isPast;

    output += `\n=========================================\n`;
    output += `Total Item Diperiksa: ${record.items.length} Item\n`;
    output += `Status: ${lockedStatus ? (isPast ? 'TERKUNCI OTOMATIS (LEWAT JAM 12 MALAM)' : 'TERKUNCI / RESMI') : 'DRAFT AKTIF (HARI INI)'}\n`;
    output += `Di-generate secara otomatis via Sistem SCM Samata\n`;
    return output;
  };

  const handleDownload = (record: SavedOpnameRecord) => {
    const textContent = getReportText(record);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Opname_Samata_${record.tanggal.replace(/-/g, '')}_${(record.kasirName || 'Kasir').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (record: SavedOpnameRecord) => {
    const textContent = getReportText(record);
    navigator.clipboard.writeText(textContent);
    setCopiedDate(record.tanggal);
    setTimeout(() => setCopiedDate(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-auto shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-4 bg-indigo-900 text-white flex justify-between items-center flex-none">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-700/80 border border-indigo-500/40 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Riwayat Laporan Opname per Tanggal</h3>
              <p className="text-xs text-indigo-200">
                Pilih tanggal untuk melihat data & unduh file laporan resmi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-indigo-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {datesList.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <FileText className="w-12 h-12 text-gray-300 mx-auto" />
            <h4 className="text-sm font-bold text-gray-700">Belum Ada Data yang Disimpan</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Klik tombol <b>"Simpan Data (Kunci)"</b> pada form opname untuk mengarsipkan dan mengunci hasil perhitungan di tanggal tertentu.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar List of Dates */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 p-3 overflow-y-auto max-h-48 md:max-h-full space-y-1.5 flex-none">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-1 mb-1">
                Daftar Tanggal ({datesList.length})
              </span>
              {datesList.map(dateStr => {
                const rec = savedRecords[dateStr];
                const isSelected = activeDate === dateStr;
                return (
                  <button
                    key={dateStr}
                    onClick={() => setActiveDate(dateStr)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col gap-0.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center font-bold">
                      <span>{dateStr}</span>
                      {isDatePastMidnight(dateStr) || rec.isLocked ? (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold flex items-center gap-0.5 ${
                          isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-amber-100 text-amber-800'
                        }`}>
                          <Lock className="w-2.5 h-2.5" /> {isDatePastMidnight(dateStr) ? 'Lewat Jam 12' : 'Terkunci'}
                        </span>
                      ) : (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold flex items-center gap-0.5 ${
                          isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          Draft Aktif
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-gray-400'}`}>
                      Kasir: {rec.kasirName || '-'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detail View of Selected Date */}
            <div className="flex-1 flex flex-col p-4 sm:p-5 overflow-y-auto space-y-4">
              {currentRecord ? (
                <>
                  {/* Metadata Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">
                          Laporan Opname
                        </span>
                        <h4 className="text-sm font-bold text-gray-900">
                          Tanggal: {currentRecord.tanggal} (Cabang {currentRecord.cabang})
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 self-start sm:self-center">
                        <button
                          onClick={() => {
                            onSelectDate(currentRecord.tanggal);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-white border border-gray-300 hover:bg-gray-50 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Buka di Form
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus arsip laporan tanggal ${currentRecord.tanggal}?`)) {
                              onDeleteRecord(currentRecord.tanggal);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Hapus Arsip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-gray-600 pt-0.5">
                      <div>
                        <span className="text-gray-400 block">Kasir:</span>
                        <b className="text-gray-800">{currentRecord.kasirName || '-'}</b>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Partner:</span>
                        <b className="text-gray-800">{currentRecord.partnerName || '-'}</b>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Waktu Simpan:</span>
                        <b className="text-gray-800">{currentRecord.savedAt || '-'}</b>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Download & Copy for this date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCopy(currentRecord)}
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                    >
                      {copiedDate === currentRecord.tanggal ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-200" /> Tersalin ke Clipboard!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Salin Teks ({currentRecord.tanggal})
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDownload(currentRecord)}
                      className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" /> Unduh File .txt ({currentRecord.tanggal})
                    </button>
                  </div>

                  {/* Text Preview Box formatted as requested */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-700 flex items-center justify-between">
                      <span>Preview Isi File Laporan:</span>
                      <span className="text-[10px] text-gray-400 font-normal">
                        Format: Nama Item Pack (Isi) Pcs (Total)
                      </span>
                    </span>
                    <pre className="bg-slate-900 text-slate-100 p-3.5 rounded-xl text-[11px] font-mono leading-relaxed max-h-64 overflow-y-auto select-all border border-slate-800">
                      {getReportText(currentRecord)}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-400 text-xs">
                  Pilih salah satu tanggal di samping.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

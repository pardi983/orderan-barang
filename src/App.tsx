import React, { useState, useEffect, useMemo } from 'react';
import {
  ClipboardList,
  Plus,
  Minus,
  Download,
  Copy,
  Check,
  Search,
  RotateCcw,
  PlusCircle,
  Trash2,
  Mic,
  Calculator,
  Calendar,
  User,
  CheckCircle2,
  Lock,
  Unlock,
  Save,
  FolderOpen,
  X,
  AlertCircle,
} from 'lucide-react';
import {
  INITIAL_EXACT_OPNAME_ITEMS,
  OpnameItemData,
  formatOpnameTextLine,
  OPNAME_DATA_2026_10_23,
} from './data/rawAndCleanData';
import { KARYAWAN_SAMATA } from './data/initialData';
import { AIAssistantModal } from './components/AIAssistantModal';
import { HistoryReportModal, SavedOpnameRecord } from './components/HistoryReportModal';

interface ItemStockState {
  pack: number;
  pcs: number;
}

// Helper untuk format tanggal lokal YYYY-MM-DD
const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Cek apakah suatu tanggal sudah melewati jam 12 malam (artinya tanggal tersebut sebelum hari ini)
const isDatePastMidnight = (targetDate: string) => {
  const today = getLocalDateString();
  return targetDate < today;
};

export default function App() {
  // Sesi Opname Meta State (Diset ke 2026-10-23 dengan kasir pardianto & partner zulnia sesuai permintaan)
  const [opnameDate, setOpnameDate] = useState<string>('2026-10-23');
  const [cabang, setCabang] = useState<string>('Samata');
  const [kasirName, setKasirName] = useState<string>('pardianto');
  const [partnerName, setPartnerName] = useState<string>('zulnia');

  // History Records by Date: { [YYYY-MM-DD]: SavedOpnameRecord }
  const [savedRecords, setSavedRecords] = useState<Record<string, SavedOpnameRecord>>(() => {
    let records: Record<string, SavedOpnameRecord> = {};
    const saved = localStorage.getItem('opname_samata_history_records');
    if (saved) {
      try {
        records = JSON.parse(saved);
      } catch (e) {
        console.error('Error loading history records', e);
      }
    }

    // Pastikan arsip tanggal 2026-10-23 tersimpan secara presisi
    records['2026-10-23'] = {
      tanggal: OPNAME_DATA_2026_10_23.tanggal,
      cabang: OPNAME_DATA_2026_10_23.cabang,
      kasirName: OPNAME_DATA_2026_10_23.kasirName,
      partnerName: OPNAME_DATA_2026_10_23.partnerName,
      items: INITIAL_EXACT_OPNAME_ITEMS,
      stockQuantities: OPNAME_DATA_2026_10_23.stockQuantities,
      isLocked: false,
      savedAt: '2026-10-23 09:30',
    };

    return records;
  });

  // Current Date Lock status
  // Tanggal 2026-10-23 belum lewat jam 12 malam, sehingga berstatus Aktif
  const [isDateLocked, setIsDateLocked] = useState<boolean>(() => {
    return isDatePastMidnight('2026-10-23');
  });

  // Items list (memastikan Bakso Ikan besar otomatis terupdate menjadi isi 25 pcs/pack)
  const [itemsList, setItemsList] = useState<OpnameItemData[]>(() => {
    const saved = localStorage.getItem('opname_samata_items_v2');
    if (saved) {
      try {
        const parsed: OpnameItemData[] = JSON.parse(saved);
        return parsed.map(item => {
          if (item.id_barang === 'TOP-001' || item.nama_item.toLowerCase().includes('bakso ikan besar')) {
            return {
              ...item,
              isi_per_pack: 25,
              nama_tampil: 'Bakso Ikan besar (Isi 25 pcs/pack)',
            };
          }
          return item;
        });
      } catch (e) {
        console.error('Error loading items list', e);
      }
    }
    return INITIAL_EXACT_OPNAME_ITEMS;
  });

  // Stock quantities diinisialisasi langsung dengan data tanggal 23 Oktober 2026
  const [stockQuantities, setStockQuantities] = useState<Record<string, ItemStockState>>(() => {
    return OPNAME_DATA_2026_10_23.stockQuantities;
  });

  // Auto-save history records to localStorage
  useEffect(() => {
    localStorage.setItem('opname_samata_history_records', JSON.stringify(savedRecords));
  }, [savedRecords]);

  // Auto-save kasir and partner name
  useEffect(() => {
    localStorage.setItem('opname_kasir_name', kasirName);
  }, [kasirName]);

  useEffect(() => {
    localStorage.setItem('opname_partner_name', partnerName);
  }, [partnerName]);

  // Save current active items to localStorage
  useEffect(() => {
    localStorage.setItem('opname_samata_items_v2', JSON.stringify(itemsList));
  }, [itemsList]);

  // Save current active stock quantities
  useEffect(() => {
    if (!isDateLocked) {
      localStorage.setItem('opname_samata_stock_v2', JSON.stringify(stockQuantities));
    }
  }, [stockQuantities, isDateLocked]);

  // Handle Date Change:
  // "dia terkunci otomatis ketika sudah melewati jam 12 yaitu jam perubahan tanggal"
  const handleDateChange = (newDate: string) => {
    setOpnameDate(newDate);
    const isPast = isDatePastMidnight(newDate);

    if (savedRecords[newDate]) {
      // Date has been saved before! Load its snapshot
      const record = savedRecords[newDate];
      if (record.items && record.items.length > 0) {
        // Enforce Bakso Ikan besar 25
        const updated = record.items.map(item => {
          if (item.id_barang === 'TOP-001' || item.nama_item.toLowerCase().includes('bakso ikan besar')) {
            return {
              ...item,
              isi_per_pack: 25,
              nama_tampil: 'Bakso Ikan besar (Isi 25 pcs/pack)',
            };
          }
          return item;
        });
        setItemsList(updated);
      }
      if (record.stockQuantities) {
        setStockQuantities(record.stockQuantities);
      }
      if (record.kasirName) setKasirName(record.kasirName);
      if (record.partnerName) setPartnerName(record.partnerName);

      // Terkunci jika sudah lewat jam 12 malam pergantian hari, atau jika sengaja dikunci
      setIsDateLocked(isPast || (record.isLocked ?? false));
    } else {
      // Tanggal belum ada arsip tersimpan
      // Jika tanggal masa lalu yang dipilih, otomatis terkunci karena sudah lewat jam 12 malam
      setIsDateLocked(isPast);

      // Inisialisasi hitungan stok untuk tanggal baru
      const freshStock: Record<string, ItemStockState> = {};
      itemsList.forEach(item => {
        freshStock[item.id_barang] = { pack: 0, pcs: 0 };
      });
      setStockQuantities(freshStock);
    }
  };

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Feedback
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState<boolean>(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // New Item Form State
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemIsiPack, setNewItemIsiPack] = useState<number>(20);
  const [newItemPack, setNewItemPack] = useState<number>(0);
  const [newItemPcs, setNewItemPcs] = useState<number>(0);
  const [newItemError, setNewItemError] = useState<string | null>(null);

  // Suggestions list for quick selection
  const employeeSuggestions = useMemo(() => {
    return KARYAWAN_SAMATA.map(k => k.Nama);
  }, []);

  // Update pack quantity
  const updatePack = (id: string, value: number) => {
    if (isDateLocked) return;
    const cleanVal = Math.max(0, value);
    setStockQuantities(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        pack: cleanVal,
      },
    }));
  };

  // Update pcs quantity
  const updatePcs = (id: string, value: number) => {
    if (isDateLocked) return;
    const cleanVal = Math.max(0, value);
    setStockQuantities(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        pcs: cleanVal,
      },
    }));
  };

  // SIMPAN DATA (DRAFT / PROGRES)
  // Berfungsi menyimpan data yang sudah diedit agar tidak hilang saat curi-curi waktu bekerja.
  // Jika masih tanggal hari ini (belum lewat jam 12 malam), form TIDAK dikunci agar bisa terus dicicil.
  // Jika tanggal masa lalu (sudah lewat jam 12 malam), form terkunci otomatis.
  const handleSaveData = () => {
    const isPast = isDatePastMidnight(opnameDate);
    const nowTimeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const record: SavedOpnameRecord = {
      tanggal: opnameDate,
      cabang,
      kasirName: kasirName.trim() || 'Kasir',
      partnerName: partnerName.trim() || 'Partner',
      items: itemsList,
      stockQuantities,
      isLocked: isPast, // Hanya terkunci jika sudah lewat jam 12 malam pergantian hari
      savedAt: `${opnameDate} ${nowTimeStr}`,
    };

    setSavedRecords(prev => ({
      ...prev,
      [opnameDate]: record,
    }));

    if (isPast) {
      setIsDateLocked(true);
      setSaveSuccessMsg(`Data tanggal ${opnameDate} tersimpan (Terkunci otomatis karena sudah lewat jam 12 malam pergantian tanggal).`);
    } else {
      // Hari ini tetap tidak terkunci! Kasir bisa lanjut mencicil input stok kapan saja
      setIsDateLocked(false);
      setSaveSuccessMsg(`Data progres tanggal ${opnameDate} berhasil disimpan (${nowTimeStr})! Form tetap terbuka untuk Anda cicil kapan saja.`);
    }

    setTimeout(() => setSaveSuccessMsg(null), 5000);
  };

  // BUKA KUNCI UNTUK KOREKSI (Khusus tanggal yang sudah lewat jam 12 malam atau sengaja dikunci)
  const handleUnlockForCorrection = () => {
    const isPast = isDatePastMidnight(opnameDate);
    const pesan = isPast
      ? `Tanggal ${opnameDate} sudah melewati jam 12 malam pergantian hari. Apakah Anda yakin ingin membuka kunci untuk mengoreksi data?`
      : `Buka kunci untuk mengedit data opname tanggal ${opnameDate}?`;

    if (confirm(pesan)) {
      setIsDateLocked(false);
      setSavedRecords(prev => {
        if (!prev[opnameDate]) return prev;
        return {
          ...prev,
          [opnameDate]: {
            ...prev[opnameDate],
            isLocked: false,
          },
        };
      });
    }
  };

  // Delete a record from history
  const handleDeleteRecord = (dateToDelete: string) => {
    setSavedRecords(prev => {
      const next = { ...prev };
      delete next[dateToDelete];
      return next;
    });
    if (opnameDate === dateToDelete) {
      setIsDateLocked(false);
    }
  };

  // Handle adding new custom item
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDateLocked) return;
    if (!newItemName.trim()) {
      setNewItemError('Nama item wajib diisi');
      return;
    }
    const cleanIsi = Math.max(1, newItemIsiPack || 1);
    const newId = `CUSTOM-${Date.now().toString().slice(-6)}`;
    const newItem: OpnameItemData = {
      id_barang: newId,
      nama_item: newItemName.trim(),
      nama_tampil: `${newItemName.trim()} (Isi ${cleanIsi} pcs/pack)`,
      isi_per_pack: cleanIsi,
      initial_pack: newItemPack,
      initial_pcs: newItemPcs,
      is_custom: true,
    };

    setItemsList(prev => [...prev, newItem]);
    setStockQuantities(prev => ({
      ...prev,
      [newId]: {
        pack: newItemPack,
        pcs: newItemPcs,
      },
    }));

    // Reset and close
    setNewItemName('');
    setNewItemIsiPack(20);
    setNewItemPack(0);
    setNewItemPcs(0);
    setNewItemError(null);
    setIsAddItemModalOpen(false);
  };

  // Delete custom item
  const handleDeleteItem = (id: string, name: string) => {
    if (isDateLocked) return;
    if (confirm(`Hapus item "${name}" dari daftar opname?`)) {
      setItemsList(prev => prev.filter(i => i.id_barang !== id));
      setStockQuantities(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  // Reset all to initial values for current date
  const handleReset = () => {
    if (isDateLocked) return;
    if (confirm('Yakin ingin mereset seluruh hitungan opname kembali ke awal?')) {
      const initial: Record<string, ItemStockState> = {};
      itemsList.forEach(item => {
        initial[item.id_barang] = {
          pack: item.initial_pack ?? 0,
          pcs: item.initial_pcs ?? 0,
        };
      });
      setStockQuantities(initial);
    }
  };

  // Apply voice AI matches
  const handleApplyAIMatches = (matches: { id: string; qty: number }[]) => {
    if (isDateLocked) return;
    setStockQuantities(prev => {
      const next = { ...prev };
      matches.forEach(m => {
        const itemObj = itemsList.find(i => i.id_barang === m.id);
        if (itemObj && next[m.id]) {
          const isi = itemObj.isi_per_pack || 1;
          const pack = Math.floor(m.qty / isi);
          const pcs = m.qty % isi;
          next[m.id] = {
            pack,
            pcs,
          };
        }
      });
      return next;
    });
  };

  // Filtered list
  const filteredItems = useMemo(() => {
    return itemsList.filter(item =>
      item.nama_item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id_barang.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [itemsList, searchQuery]);

  // Generate output text formatted exactly as user requested:
  // "nama dulu, angka yang berisi jumlah packnya kemudian kurung yang berisi angka isi pcsnya lalu angka jumlah pcs terakhir tambahkan angka dalam kurung lagi namun berisi jumlah semuanya"
  const generateFormattedTextOutput = () => {
    let output = `LAPORAN STOK OPNAME - CABANG ${cabang.toUpperCase()}\n`;
    output += `Tanggal : ${opnameDate}\n`;
    output += `Kasir   : ${kasirName || '-'}\n`;
    output += `Partner : ${partnerName || '-'}\n`;
    output += `Status  : ${isDateLocked ? 'TERKUNCI / RESMI' : 'DRAFT'}\n`;
    output += `=========================================\n\n`;

    itemsList.forEach((item, index) => {
      const stock = stockQuantities[item.id_barang] || { pack: 0, pcs: 0 };
      const line = formatOpnameTextLine(item.nama_item, stock.pack, item.isi_per_pack, stock.pcs);
      output += `${index + 1}. ${line}\n`;
    });

    output += `\n=========================================\n`;
    output += `Total Item Diperiksa: ${itemsList.length} Item\n`;
    output += `Di-generate secara otomatis via Sistem SCM Samata\n`;
    return output;
  };

  // Download .txt file
  const handleDownloadTxt = () => {
    const textContent = generateFormattedTextOutput();
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Opname_Samata_${opnameDate.replace(/-/g, '')}_${(kasirName || 'Kasir').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy formatted text for WhatsApp
  const handleCopyText = () => {
    const textContent = generateFormattedTextOutput();
    navigator.clipboard.writeText(textContent);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const totalSavedDatesCount = Object.keys(savedRecords).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col antialiased">
      {/* HEADER / APP BAR */}
      <header className="bg-indigo-900 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-700/90 border border-indigo-500/40 flex items-center justify-center shadow-inner">
              <ClipboardList className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight leading-none">SCM Samata</h1>
                <span className="text-[10px] bg-indigo-700 text-indigo-100 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  Cabang Samata
                </span>
              </div>
              <p className="text-[11px] text-indigo-200 mt-0.5">Sistem Stok Opname Bahan Baku</p>
            </div>
          </div>

          {/* Quick Action: Riwayat Laporan per Tanggal */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="px-3 py-1.5 bg-indigo-800 hover:bg-indigo-700 text-indigo-100 rounded-xl border border-indigo-600/50 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Laporan per Tanggal</span>
              <span className="sm:hidden">Riwayat</span>
              {totalSavedDatesCount > 0 && (
                <span className="bg-amber-400 text-indigo-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {totalSavedDatesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5 pb-24 space-y-4">
        {/* SUCCESS NOTIFICATION TOAST */}
        {saveSuccessMsg && (
          <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-200 flex-shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button
              onClick={() => setSaveSuccessMsg(null)}
              className="p-1 hover:bg-white/20 rounded-lg text-emerald-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* LOCKED STATUS BANNER */}
        {isDateLocked && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold block text-sm">
                  {isDatePastMidnight(opnameDate)
                    ? `Data Opname Tanggal ${opnameDate} Terkunci Otomatis`
                    : `Data Opname Tanggal ${opnameDate} Terkunci`}
                </span>
                <span className="text-[11px] text-amber-700">
                  {isDatePastMidnight(opnameDate)
                    ? 'Tanggal ini sudah melewati jam 12 malam (pergantian tanggal). Laporan terkunci otomatis untuk menjaga keaslian arsip.'
                    : 'Data telah disimpan dan dikunci. Buka kunci jika Anda perlu melakukan koreksi data.'}
                </span>
              </div>
            </div>

            <button
              onClick={handleUnlockForCorrection}
              className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs self-start sm:self-center"
            >
              <Unlock className="w-3.5 h-3.5 text-amber-600" /> Buka Kunci untuk Koreksi
            </button>
          </div>
        )}

        {/* INFORMASI SESI OPNAME (Tanggal, Kasir, Partner) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-200 space-y-3">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                <User className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-sm text-gray-900">Informasi Sesi Opname</h2>
              {isDateLocked ? (
                <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  {isDatePastMidnight(opnameDate) ? 'Terkunci Otomatis (Lewat Jam 12 Malam)' : 'Terkunci'}
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Aktif (Bisa Dicicil Kapan Saja)
                </span>
              )}
              {savedRecords[opnameDate]?.savedAt && (
                <span className="text-[10px] text-gray-400">
                  (Terakhir disimpan: {savedRecords[opnameDate].savedAt})
                </span>
              )}
            </div>

            {!isDateLocked && (
              <button
                onClick={handleReset}
                className="text-[11px] text-gray-500 hover:text-red-600 font-medium flex items-center gap-1 hover:bg-gray-50 px-2 py-1 rounded"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Form
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Input Tanggal */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Tanggal Opname *
              </label>
              <input
                type="date"
                value={opnameDate}
                onChange={e => handleDateChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-bold text-indigo-900 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Input Kasir (Free Text) */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Nama Kasir Bertugas *
              </label>
              <input
                type="text"
                disabled={isDateLocked}
                list="kasir-suggestions"
                value={kasirName}
                onChange={e => setKasirName(e.target.value)}
                placeholder="Ketik nama kasir bertugas..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-bold text-indigo-900 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-60"
              />
              <datalist id="kasir-suggestions">
                {employeeSuggestions.map((name, i) => (
                  <option key={i} value={name} />
                ))}
              </datalist>
            </div>

            {/* Input Partner (Free Text) */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Nama Partner Shift (Saksi) *
              </label>
              <input
                type="text"
                disabled={isDateLocked}
                list="partner-suggestions"
                value={partnerName}
                onChange={e => setPartnerName(e.target.value)}
                placeholder="Ketik nama partner shift..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-bold text-indigo-900 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-60"
              />
              <datalist id="partner-suggestions">
                {employeeSuggestions.map((name, i) => (
                  <option key={i} value={name} />
                ))}
              </datalist>
            </div>
          </div>
        </div>

        {/* FORMULA BANNER & TOMBOL AKSI ATAS */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-indigo-950 block">Rumus Perhitungan Otomatis:</span>
              <span className="text-indigo-800 font-mono text-[11px]">
                <b>Total</b> = (<b>Jumlah Pack</b> × <b>Isi per Pack</b>) + <b>Jumlah Pcs</b>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!isDateLocked && (
              <>
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Mic className="w-4 h-4 text-indigo-950" />
                  Suara AI
                </button>
                <button
                  onClick={() => setIsAddItemModalOpen(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Tambah Item
                </button>
              </>
            )}

            {/* Quick Save button on top banner */}
            {!isDateLocked && (
              <button
                onClick={handleSaveData}
                title="Simpan data progres agar tidak hilang saat curi-curi waktu kerja"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                Simpan Progres
              </button>
            )}
          </div>
        </div>

        {/* SEARCH BAR & ITEM COUNT */}
        <div className="bg-white rounded-2xl p-3 shadow-xs border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-xl">
              Daftar Barang ({filteredItems.length} Item)
            </span>
            <span className="text-[11px] text-gray-500">
              Format: Nama &bull; Jumlah Pack &bull; (Isi Pack) &bull; Jumlah Pcs &bull; (Total)
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama barang..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* LIST BARANG (3 KOLOM INPUT: PACK, PCS, TOTAL) */}
        <div className="space-y-3">
          {filteredItems.map((item, index) => {
            const stock = stockQuantities[item.id_barang] || { pack: 0, pcs: 0 };
            const totalFisik = stock.pack * item.isi_per_pack + stock.pcs;

            return (
              <div
                key={item.id_barang}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-xs ${
                  isDateLocked
                    ? 'border-gray-200 bg-gray-50/50'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                {/* Item Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-400 w-6">
                      {index + 1}.
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        {item.nama_item}
                      </h4>
                      <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                        Isi per pack: {item.isi_per_pack} {item.isi_per_pack > 1 ? 'pcs' : 'satuan'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {!isDateLocked && item.is_custom && (
                      <button
                        onClick={() => handleDeleteItem(item.id_barang, item.nama_item)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Hapus Item Kustom"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {/* Live Line Preview */}
                    <div className="text-[11px] font-mono bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                      {formatOpnameTextLine(item.nama_item, stock.pack, item.isi_per_pack, stock.pcs)}
                    </div>
                  </div>
                </div>

                {/* 3 KOLOM INPUT: PACK, PCS, TOTAL */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
                  {/* KOLOM 1: JUMLAH PACK */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold text-slate-600 uppercase">
                        Kolom 1: Jumlah Pack
                      </span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                        isi {item.isi_per_pack}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isDateLocked}
                        onClick={() => updatePack(item.id_barang, stock.pack - 1)}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 active:scale-95 disabled:opacity-40 flex items-center justify-center text-slate-700 border border-slate-300 font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        disabled={isDateLocked}
                        value={stock.pack}
                        onChange={e => updatePack(item.id_barang, parseInt(e.target.value) || 0)}
                        onFocus={e => e.target.select()}
                        className="flex-1 text-center bg-white border border-slate-300 rounded-lg py-1.5 text-sm font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
                      />
                      <button
                        type="button"
                        disabled={isDateLocked}
                        onClick={() => updatePack(item.id_barang, stock.pack + 1)}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 active:scale-95 disabled:opacity-40 flex items-center justify-center text-slate-700 border border-slate-300 font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* KOLOM 2: JUMLAH PCS */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold text-slate-600 uppercase">
                        Kolom 2: Jumlah Pcs (Ecer)
                      </span>
                      <span className="text-[10px] text-slate-500">sisa butir</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isDateLocked}
                        onClick={() => updatePcs(item.id_barang, stock.pcs - 1)}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 active:scale-95 disabled:opacity-40 flex items-center justify-center text-slate-700 border border-slate-300 font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        disabled={isDateLocked}
                        value={stock.pcs}
                        onChange={e => updatePcs(item.id_barang, parseInt(e.target.value) || 0)}
                        onFocus={e => e.target.select()}
                        className="flex-1 text-center bg-white border border-slate-300 rounded-lg py-1.5 text-sm font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
                      />
                      <button
                        type="button"
                        disabled={isDateLocked}
                        onClick={() => updatePcs(item.id_barang, stock.pcs + 1)}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 active:scale-95 disabled:opacity-40 flex items-center justify-center text-slate-700 border border-slate-300 font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* KOLOM 3: HASIL RUMUS TOTAL FISIK */}
                  <div className="bg-indigo-50/90 border border-indigo-200 rounded-xl p-2.5 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold text-indigo-900 uppercase">
                        Kolom 3: Total Semuanya
                      </span>
                      <span className="text-[9px] text-indigo-600 font-mono">
                        ({stock.pack}×{item.isi_per_pack})+{stock.pcs}
                      </span>
                    </div>
                    <div className="bg-white border border-indigo-300 rounded-lg py-1.5 px-3 text-center shadow-2xs">
                      <span className="text-base font-black text-indigo-950">
                        {totalFisik} <span className="text-xs font-medium text-gray-500">Pcs</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM ACTION BAR: TOMBOL SAVE, DOWNLOAD, SALIN, & RIWAYAT */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-md space-y-3.5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-gray-900">
                Penyimpanan & Output Laporan Opname
              </h3>
              <p className="text-xs text-gray-500">
                Format: <code>Nama_Item Jumlah_Pack (Isi_Pack) Jumlah_Pcs (Total_Semuanya)</code>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                isDateLocked
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {isDateLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                {isDateLocked
                  ? (isDatePastMidnight(opnameDate) ? 'Status: Terkunci (Lewat Jam 12 Malam)' : 'Status: Terkunci')
                  : 'Status: Terbuka (Bisa Dicicil)'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Tombol Simpan Progres (tidak mengunci hari ini) */}
            {!isDateLocked ? (
              <button
                onClick={handleSaveData}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                Simpan Data (Bisa Dicicil Kapan Saja)
              </button>
            ) : (
              <button
                onClick={handleUnlockForCorrection}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Unlock className="w-4 h-4" />
                Buka Kunci untuk Koreksi (Lewat Jam 12)
              </button>
            )}

            {/* Tombol Salin Teks */}
            <button
              onClick={handleCopyText}
              className="w-full py-3 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              {copiedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedSuccess ? 'Tersalin ke Clipboard!' : 'Salin Format Teks (WhatsApp)'}
            </button>

            {/* Tombol Download .txt */}
            <button
              onClick={handleDownloadTxt}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              Unduh Laporan Opname (.txt)
            </button>
          </div>

          {/* Quick Bar untuk Buka Riwayat per Tanggal */}
          <div className="pt-1 flex justify-between items-center text-xs text-gray-500">
            <span>
              Tersimpan <b>{totalSavedDatesCount} laporan harian</b> di sistem.
            </span>
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:underline"
            >
              <FolderOpen className="w-3.5 h-3.5" /> Buka Laporan Tanggal Lain &rarr;
            </button>
          </div>
        </div>
      </main>

      {/* MODAL RIWAYAT LAPORAN PER TANGGAL */}
      <HistoryReportModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        savedRecords={savedRecords}
        currentSelectedDate={opnameDate}
        onSelectDate={date => handleDateChange(date)}
        onDeleteRecord={handleDeleteRecord}
      />

      {/* MODAL TAMBAH ITEM BARU */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-indigo-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-300" />
                <h3 className="font-bold text-sm">Tambah Item Opname Baru</h3>
              </div>
              <button
                onClick={() => setIsAddItemModalOpen(false)}
                className="p-1 rounded-full text-indigo-200 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="p-4 sm:p-5 space-y-4 text-xs">
              {newItemError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {newItemError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Nama Item Baru *
                </label>
                <input
                  type="text"
                  placeholder="Mis. Baso Aci Pedas, Jamur Kuping..."
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none text-xs font-semibold"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Isi per 1 Pack (Pcs) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={newItemIsiPack}
                  onChange={e => setNewItemIsiPack(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none text-xs font-bold"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Nilai ini yang akan menjadi angka di dalam kurung: <code>(isi)</code>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Jumlah Pack Awal
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newItemPack}
                    onChange={e => setNewItemPack(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Jumlah Pcs Awal
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newItemPcs}
                    onChange={e => setNewItemPcs(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-center font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Simpan Item Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI ASSISTANT MODAL (Voice input) */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApplyMatches={handleApplyAIMatches}
      />
    </div>
  );
}

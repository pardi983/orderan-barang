import React, { useState } from 'react';
import {
  FileText,
  Table,
  Cpu,
  Mail,
  Smartphone,
  CheckSquare,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  ExternalLink,
  Code,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { STANDARDIZED_MASTER_DATA, generateMasterCSV, CleanedItem } from '../data/rawAndCleanData';
import { AUDIT_ISSUES, APPSHEET_TABLE_SCHEMAS, APPSHEET_EXPRESSIONS, GOOGLE_APPS_SCRIPT_CODE } from '../data/initialData';

export const ConsultantRoadmapView: React.FC = () => {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const downloadCSV = () => {
    const csvContent = generateMasterCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Master_Barang_SCM_Samata_Cleaned.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMasterItems = STANDARDIZED_MASTER_DATA.filter(item => {
    const matchCat = categoryFilter === 'ALL' || item.kategori_baru === categoryFilter;
    const matchSearch =
      item.nama_resmi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.catatan_perbaikan?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Consultant Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              SCM Inventory Blueprint • Resto Seblak Samata
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Pusat Panduan & Konfigurasi Google AppSheet
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Dokumen arsitektur lengkap 6 tahap implementasi sistem stok opname bahan baku F&B Cabang Samata, dari pembersihan data mentah hingga integrasi AI dan otomatisasi PDF.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={downloadCSV}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" /> Unduh Master_Barang.csv
            </button>
            <button
              onClick={() => copyToClipboard(generateMasterCSV(), 'full_csv')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {copiedKey === 'full_csv' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedKey === 'full_csv' ? 'Tersalin!' : 'Salin CSV'}
            </button>
          </div>
        </div>

        {/* Stage Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-5 pt-4 border-t border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveStage(1)}
            className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
              activeStage === 1
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-[10px] opacity-75 font-mono">Tahap 1</span>
            <span className="font-bold text-xs mt-0.5">Pembersihan Data</span>
          </button>
          <button
            onClick={() => setActiveStage(2)}
            className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
              activeStage === 2
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-[10px] opacity-75 font-mono">Tahap 2</span>
            <span className="font-bold text-xs mt-0.5">Skema & Expression</span>
          </button>
          <button
            onClick={() => setActiveStage(3)}
            className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
              activeStage === 3
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-[10px] opacity-75 font-mono">Tahap 3</span>
            <span className="font-bold text-xs mt-0.5">Desain View UX</span>
          </button>
          <button
            onClick={() => setActiveStage(4)}
            className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
              activeStage === 4
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-[10px] opacity-75 font-mono">Tahap 4</span>
            <span className="font-bold text-xs mt-0.5">Automation PDF</span>
          </button>
          <button
            onClick={() => setActiveStage(5)}
            className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
              activeStage === 5
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-[10px] opacity-75 font-mono">Tahap 5</span>
            <span className="font-bold text-xs mt-0.5">Integrasi AI</span>
          </button>
          <button
            onClick={() => setActiveStage(6)}
            className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
              activeStage === 6
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-[10px] opacity-75 font-mono">Tahap 6</span>
            <span className="font-bold text-xs mt-0.5">Checklist Kasir</span>
          </button>
        </div>
      </div>

      {/* ================= TAHAP 1: PEMBERSIHAN DATA ================= */}
      {activeStage === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500 block">Total Data Awal Asli</span>
              <span className="text-2xl font-black text-gray-900 mt-1 block">77 Baris</span>
              <p className="text-[11px] text-gray-500 mt-1">Banyak duplikasi lintas sheet & satuan ambigu.</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl shadow-xs">
              <span className="text-xs font-semibold text-indigo-700 block">Total Master Bersih Terkonsolidasi</span>
              <span className="text-2xl font-black text-indigo-900 mt-1 block">{STANDARDIZED_MASTER_DATA.length} SKU Unik</span>
              <p className="text-[11px] text-indigo-700 mt-1">Kode terstandar TOP, BMB, MNM, OPS.</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl shadow-xs">
              <span className="text-xs font-semibold text-emerald-700 block">Efisiensi & Integritas Data</span>
              <span className="text-2xl font-black text-emerald-900 mt-1 block">100% Siap Impor</span>
              <p className="text-[11px] text-emerald-700 mt-1">Semua harga numerik murni & konversi baku.</p>
            </div>
          </div>

          {/* Audit Findings Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  Laporan Hasil Audit Masalah Data (File Asli SCM Samata)
                </h3>
                <p className="text-xs text-gray-500">
                  Temuan ketidaksesuaian kritis pada file awal sebelum pembuatan tabel database
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Kategori Masalah</th>
                    <th className="p-3">Item Terdampak</th>
                    <th className="p-3">Kondisi Sebelum</th>
                    <th className="p-3">Resiko Kesalahan di AppSheet</th>
                    <th className="p-3">Solusi Perbaikan & Standarisasi</th>
                    <th className="p-3">Aturan Konversi Satuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {AUDIT_ISSUES.map((issue, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/70">
                      <td className="p-3 font-semibold text-indigo-950">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-[10px]">
                          {issue.kategori_masalah}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-gray-900">{issue.item_terdampak}</td>
                      <td className="p-3 text-red-600 text-[11px]">{issue.kondisi_sebelum}</td>
                      <td className="p-3 text-amber-700 text-[11px]">{issue.dampak_resiko}</td>
                      <td className="p-3 text-emerald-800 font-medium text-[11px]">{issue.solusi_perbaikan}</td>
                      <td className="p-3 font-mono text-[11px] bg-slate-50">{issue.aturan_konversi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Cleaned Master Table with Filters */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  Tabel Data Master Barang Bersih (Siap Impor ke Google Sheets)
                </h3>
                <p className="text-xs text-gray-500">
                  Menampilkan {filteredMasterItems.length} dari {STANDARDIZED_MASTER_DATA.length} item aktif
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari item / SKU..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none w-44"
                  />
                </div>
                <div className="py-1 px-3 text-xs bg-indigo-50 border border-indigo-200 rounded-lg font-bold text-indigo-900">
                  Kategori: Topping ({STANDARDIZED_MASTER_DATA.length} Item)
                </div>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50 sticky top-0 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[10px] z-10">
                  <tr>
                    <th className="p-3">ID_Barang (Key)</th>
                    <th className="p-3">Nama_Item (Resmi)</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-center">Satuan</th>
                    <th className="p-3 text-right">Harga_Satuan (Rp)</th>
                    <th className="p-3 text-center">Stok_Min</th>
                    <th className="p-3">Konversi Satuan & Catatan Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredMasterItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50/30">
                      <td className="p-3 font-mono font-bold text-indigo-700">{item.id_barang}</td>
                      <td className="p-3 font-semibold text-gray-900">{item.nama_resmi}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                          {item.kategori_baru}
                        </span>
                      </td>
                      <td className="p-3 text-center font-medium text-gray-600">{item.satuan_standar}</td>
                      <td className="p-3 text-right font-mono font-semibold text-gray-900">
                        Rp {item.harga_satuan.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 text-center font-bold text-amber-700">{item.stok_min}</td>
                      <td className="p-3 text-gray-600 text-[11px]">
                        <span className="font-semibold text-indigo-900">{item.konversi_satuan}</span>
                        {item.catatan_perbaikan && (
                          <span className="block text-[10px] text-gray-400 mt-0.5">{item.catatan_perbaikan}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAHAP 2: SKEMA TABEL & EXPRESSIONS ================= */}
      {activeStage === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-900">
            <h4 className="font-bold text-sm text-indigo-950 mb-1 flex items-center gap-1.5">
              <Table className="w-4 h-4 text-indigo-600" />
              Struktur Relasi 4 Tabel Database (Google Sheets & AppSheet)
            </h4>
            <p>
              Gunakan Google Sheets dengan 4 worksheet terpisah: <b>Master_Barang</b>, <b>Karyawan</b>, <b>Opname_Header</b>, dan <b>Opname_Detail</b>.
              Relasi antar tabel menggunakan tipe <b>Ref</b> dengan opsi <code>IsPartOf = TRUE</code> di tabel Opname_Detail.
            </p>
          </div>

          {/* Table Schemas Accordion/Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(APPSHEET_TABLE_SCHEMAS).map(([tableName, columns]) => (
              <div key={tableName} className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="font-bold text-xs text-gray-800 font-mono">Tabel: {tableName}</h4>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-semibold">
                    {columns.length} Kolom
                  </span>
                </div>
                <div className="p-2 overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="text-[9px] uppercase font-bold text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="p-1.5">Kolom</th>
                        <th className="p-1.5">Type</th>
                        <th className="p-1.5 text-center">Key</th>
                        <th className="p-1.5 text-center">Label</th>
                        <th className="p-1.5">Keterangan / Initial</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {columns.map((c, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="p-1.5 font-bold font-mono text-gray-900">{c.kolom}</td>
                          <td className="p-1.5 text-indigo-600 font-semibold">{c.type}</td>
                          <td className="p-1.5 text-center">{c.key ? '🔑' : '-'}</td>
                          <td className="p-1.5 text-center">{c.label ? '🏷️' : '-'}</td>
                          <td className="p-1.5 text-gray-500 text-[10px]">{c.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Complete AppSheet Expressions Ready to Copy */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-600" />
              Kumpulan Rumus & Expression Resmi AppSheet (Siap Disalin)
            </h3>

            <div className="space-y-3">
              {APPSHEET_EXPRESSIONS.map((expr, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-800">{expr.tujuan}</span>
                    <div className="font-mono text-xs bg-gray-900 text-emerald-400 px-3 py-1.5 rounded-lg select-all">
                      {expr.rumus}
                    </div>
                    <p className="text-[11px] text-gray-500">{expr.penjelasan}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(expr.rumus, `expr_${idx}`)}
                    className="self-end sm:self-center px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
                  >
                    {copiedKey === `expr_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === `expr_${idx}` ? 'Tersalin' : 'Salin Rumus'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAHAP 3: DESAIN TAMPILAN (VIEWS) ================= */}
      {activeStage === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              Langkah Klik-demi-Klik Setup Views di AppSheet Editor
            </h3>

            <div className="space-y-4 text-xs text-gray-700">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <h4 className="font-bold text-indigo-900 text-sm">1. View Form Opname (Input Cepat Kasir)</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Buka menu <b>UX &gt; Views &gt; New View</b>.</li>
                  <li>Beri nama: <code>Form_Opname</code>, pilih For this data: <code>Opname_Header</code>, View type: <code>form</code>.</li>
                  <li>Atur <b>Form style</b> ke <code>Wizard</code> (agar bertahap: Identitas Shift &gt; Input Per Kategori &gt; Review & TTD).</li>
                  <li>Pada <b>Column order</b>, susun berurutan: <code>Tanggal</code>, <code>Cabang</code>, <code>Nama_Kasir</code>, <code>Nama_Partner_Shift</code>, <code>Jam_Mulai</code>, <code>Related Opname_Details</code>, <code>Ringkasan_AI</code>, <code>Tanda_Tangan_Kasir</code>, <code>Tanda_Tangan_Partner</code>, <code>Status</code>.</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <h4 className="font-bold text-indigo-900 text-sm">2. Inline View Detail Stok per Kategori</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Buat view type: <code>table</code> untuk tabel <code>Opname_Detail</code>.</li>
                  <li>Group by: <code>ID_Barang.Kategori</code> (akan membagi otomatis menjadi Topping, Bumbu, Minuman, Operasional).</li>
                  <li>Sort by: <code>ID_Barang.Nama_Item</code> (Ascending) agar kasir mudah mencari urut abjad.</li>
                  <li>Aktifkan <b>QuickEdit columns</b> untuk kolom: <code>Stok_Fisik</code> dan <code>Catatan</code> agar kasir bisa langsung ketik angka tanpa membuka pop-up satu per satu!</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <h4 className="font-bold text-indigo-900 text-sm">3. View Riwayat Opname (Filter & Arsip)</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>View type: <code>deck</code> atau <code>card</code> untuk <code>Opname_Header</code>.</li>
                  <li>Primary header: <code>CONCATENATE(TEXT([Tanggal], "DD/MM/YYYY"), " - ", [Cabang])</code>.</li>
                  <li>Secondary header: <code>CONCATENATE("Kasir: ", [Nama_Kasir], " & ", [Nama_Partner_Shift])</code>.</li>
                  <li>Summary column: <code>Total_Selisih_Rp</code> (beri format rule warna merah jika negatif).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAHAP 4: AUTOMATION PDF ================= */}
      {activeStage === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" />
              Setup Automation Bot & Template Google Docs PDF di AppSheet
            </h3>

            <div className="space-y-3 text-xs text-gray-700">
              <p>
                Ketika kasir dan partner shift menyelesaikan opname dan memilih <b>Status = "Selesai"</b>, Bot AppSheet akan otomatis memicu pembuatan file PDF dan mengirim email ke pemilik / manager.
              </p>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <span className="font-bold text-gray-900">Langkah Setting Bot di AppSheet:</span>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Buka menu <b>Automation &gt; Bots &gt; Create a new bot</b>.</li>
                  <li>Trigger Event: <code>Data Change (Updates only)</code> pada tabel <code>Opname_Header</code>.</li>
                  <li>Kondisi (Condition): <code>AND([_THISROW_BEFORE].[Status] &lt;&gt; "Selesai", [_THISROW_AFTER].[Status] = "Selesai")</code>.</li>
                  <li>Tambahkan Task: <b>Create a new file</b> (File type: PDF).</li>
                  <li>Gunakan template Google Docs dengan variabel syntax AppSheet.</li>
                </ol>
              </div>

              {/* Google Apps Script Integration Webhook */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-xs">
                    Kode Google Apps Script (Webhook Email & WhatsApp Gateway)
                  </span>
                  <button
                    onClick={() => copyToClipboard(GOOGLE_APPS_SCRIPT_CODE, 'gas_code')}
                    className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-xs font-semibold flex items-center gap-1"
                  >
                    {copiedKey === 'gas_code' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'gas_code' ? 'Tersalin' : 'Salin Kode GAS'}
                  </button>
                </div>
                <pre className="p-3 bg-gray-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto max-h-64">
                  {GOOGLE_APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAHAP 5: INTEGRASI FITUR AI ================= */}
      {activeStage === 5 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              Arsitektur 5 Fitur AI (Gemini API 3.8 Flash)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <span className="font-bold text-indigo-900 text-xs block">1. Input Suara Kasir (Voice-to-Opname)</span>
                <p className="text-gray-600">
                  Kasir menyebutkan hitungan fisik tanpa mengetik (contoh: "bakso ikan 45, boci keju 30, telur 3 rak"). Gemini mencocokkan kemiripan fonetik dan menerapkan konversi rak & dus secara otomatis.
                </p>
                <div className="bg-white p-2 rounded border border-gray-200 font-mono text-[10px] text-gray-700">
                  Model: gemini-3.8-flash • latency: &lt; 900ms
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <span className="font-bold text-indigo-900 text-xs block">2. Baca Foto Catatan (Vision OCR)</span>
                <p className="text-gray-600">
                  Jika staf menulis di kertas buram atau papan klip, mereka cukup memotret dengan kamera HP. Gemini Vision mengekstrak baris tulisan tangan dan memetakan angka ke SKU barang.
                </p>
                <div className="bg-white p-2 rounded border border-gray-200 font-mono text-[10px] text-gray-700">
                  MIME: image/jpeg • Multimodal Content Part
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <span className="font-bold text-indigo-900 text-xs block">3. Deteksi Anomali & Kesalahan Input</span>
                <p className="text-gray-600">
                  Memeriksa jika stok fisik menyimpang lebih dari 300% sistem (misalnya salah ketik 450 alih-alih 45), atau minus bernilai jutaan rupiah, lalu memberi prompt konfirmasi sebelum simpan.
                </p>
                <div className="bg-white p-2 rounded border border-gray-200 font-mono text-[10px] text-gray-700">
                  Z-Score / Rule-based + AI Reasoning
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <span className="font-bold text-indigo-900 text-xs block">4. Rekomendasi Restock & Ringkasan Laporan</span>
                <p className="text-gray-600">
                  Menyusun narasi eksekutif untuk atasan dan menghitung daftar barang yang harus segera dibeli ke supplier Samata lengkap dengan estimasi rupiah belanja.
                </p>
                <div className="bg-white p-2 rounded border border-gray-200 font-mono text-[10px] text-gray-700">
                  Auto Order Logic: 2x Stok_Min - Stok_Fisik
                </div>
              </div>
            </div>

            {/* Strategi Menekan Biaya */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1.5 text-emerald-950">
              <span className="font-bold block text-emerald-900">Strategi Menekan Biaya API:</span>
              <ul className="list-disc list-inside space-y-0.5 text-emerald-800">
                <li>Gunakan <b>gemini-3.8-flash</b> yang memiliki rasio harga per 1M token sangat murah dan latency super cepat.</li>
                <li>Hanya kirimkan lookup ID & Nama Barang penting, bukan seluruh tabel master berulang-ulang.</li>
                <li>Lakukan validasi lokal sisi klien terlebih dahulu (misal konversi 1 rak = 30 butir) sebelum memanggil AI.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAHAP 6: CHECKLIST PENGUJIAN & SOP ================= */}
      {activeStage === 6 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              Checklist Uji Coba Lapangan & SOP Kasir Cabang Samata
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3">
                <input type="checkbox" defaultChecked className="mt-1 rounded text-indigo-600" />
                <div>
                  <span className="font-bold text-gray-900">1. Uji Validasi Partner Shift Berbeda</span>
                  <p className="text-gray-600">Pastikan kasir tidak dapat memilih namanya sendiri sebagai partner shift.</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3">
                <input type="checkbox" defaultChecked className="mt-1 rounded text-indigo-600" />
                <div>
                  <span className="font-bold text-gray-900">2. Uji Mode Offline (Sinyal Lemah di Samata)</span>
                  <p className="text-gray-600">
                    Matikan koneksi WiFi/Data di HP Android, lakukan pengisian draft opname, nyalakan kembali koneksi dan pastikan ikon sinkronisasi berhasil mengirim data.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3">
                <input type="checkbox" defaultChecked className="mt-1 rounded text-indigo-600" />
                <div>
                  <span className="font-bold text-gray-900">3. Uji Kolom Catatan Wajib Saat Selisih Tinggi</span>
                  <p className="text-gray-600">Coba isi selisih lebih dari 5 unit tanpa catatan; sistem harus menolak tombol simpan.</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3">
                <input type="checkbox" defaultChecked className="mt-1 rounded text-indigo-600" />
                <div>
                  <span className="font-bold text-gray-900">4. Uji Penguncian Status Selesai</span>
                  <p className="text-gray-600">Setelah tanda tangan dan berstatus Selesai, pastikan kasir tidak dapat mengubah angka lagi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

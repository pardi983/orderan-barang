import React from 'react';
import { Printer, Download, Share2, CheckCircle, X, AlertCircle } from 'lucide-react';
import { CleanedItem } from '../data/rawAndCleanData';

interface OfficialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: {
    idOpname: string;
    tanggal: string;
    jamMulai: string;
    jamSelesai: string;
    cabang: string;
    kasir: string;
    partner: string;
    items: {
      item: CleanedItem;
      jumlahPack?: number;
      jumlahPcs?: number;
      stokSistem: number;
      stokFisik: number;
      selisih: number;
      nilaiSelisihRp: number;
      catatan: string;
    }[];
    totalSelisihRp: number;
    ringkasanAI: string;
    signatureKasir: string;
    signaturePartner: string;
    status: string;
  };
}

export const OfficialReportModal: React.FC<OfficialReportModalProps> = ({
  isOpen,
  onClose,
  reportData,
}) => {
  if (!isOpen) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const lowStockItems = reportData.items.filter(i => i.stokFisik < i.item.stok_min);
  const categories = ['Topping'] as const;

  const shareWA = () => {
    let msg = `*LAPORAN RESMI STOK OPNAME CABANG ${reportData.cabang.toUpperCase()}*\n`;
    msg += `No. Dokumen: ${reportData.idOpname}\n`;
    msg += `Tanggal: ${reportData.tanggal} (${reportData.jamMulai} - ${reportData.jamSelesai})\n`;
    msg += `Kasir: ${reportData.kasir}\n`;
    msg += `Partner Shift: ${reportData.partner}\n`;
    msg += `Status: ${reportData.status}\n`;
    msg += `Total Selisih Rp: ${formatRupiah(reportData.totalSelisihRp)}\n`;
    msg += `Item Kritis Restock: ${lowStockItems.length} item\n`;
    if (reportData.ringkasanAI) {
      msg += `\n*Ringkasan AI:*\n${reportData.ringkasanAI}\n`;
    }
    msg += `\nLaporan resmi telah ditandatangani digital oleh kedua petugas shift.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-auto shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 bg-gray-900 text-white flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">Dokumen Laporan Resmi Stok Opname</h3>
              <p className="text-xs text-gray-400">Siap Cetak / Unduh PDF • SCM Samata</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={shareWA}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Share WA
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="p-6 sm:p-10 overflow-y-auto font-sans text-gray-900 bg-white" id="printable-report">
          {/* Header Surat Resmi */}
          <div className="border-b-2 border-gray-900 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-indigo-100 text-indigo-900 px-2.5 py-1 rounded">
                  BERITA ACARA RESMI INVENTORI
                </span>
                <h1 className="text-2xl font-black text-gray-900 mt-2 tracking-tight">
                  LAPORAN STOK OPNAME BAHAN BAKU
                </h1>
                <p className="text-xs text-gray-600 font-medium">
                  Sistem Rantai Pasok F&B (SCM) • Resto Seblak & Baso Aci Cabang Samata
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-gray-800 block">
                  {reportData.idOpname}
                </span>
                <span className={`inline-block mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  reportData.status === 'Selesai'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-amber-50 text-amber-700 border-amber-300'
                }`}>
                  Status: {reportData.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Metadata Box: 4 Mandatory Items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase block">1. Tanggal Opname</span>
                <span className="font-bold text-gray-900">{reportData.tanggal}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase block">2. Kasir Bertugas</span>
                <span className="font-bold text-indigo-800">{reportData.kasir}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase block">3. Partner Shift</span>
                <span className="font-bold text-indigo-800">{reportData.partner}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase block">Cabang & Jam</span>
                <span className="font-bold text-gray-900">{reportData.cabang} ({reportData.jamMulai} - {reportData.jamSelesai})</span>
              </div>
            </div>
          </div>

          {/* AI Executive Summary Box */}
          {reportData.ringkasanAI && (
            <div className="mb-6 p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                Ringkasan Eksekutif & Temuan AI:
              </div>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {reportData.ringkasanAI}
              </p>
            </div>
          )}

          {/* Tables per category */}
          <div className="space-y-6">
            {categories.map(cat => {
              const catItems = reportData.items.filter(i => i.item.kategori_baru === cat);
              if (catItems.length === 0) return null;

              const subtotalRp = catItems.reduce((acc, curr) => acc + curr.nilaiSelisihRp, 0);

              return (
                <div key={cat} className="space-y-2">
                  <div className="flex justify-between items-center bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-800">
                      Kategori: {cat} ({catItems.length} Item)
                    </h4>
                    <span className="text-xs font-semibold text-gray-700">
                      Subtotal Selisih: <span className={subtotalRp < 0 ? 'text-red-600' : 'text-emerald-700'}>{formatRupiah(subtotalRp)}</span>
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-[11px] text-left border-collapse">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-[9px] font-bold">
                        <tr>
                          <th className="p-2">Kode</th>
                          <th className="p-2">Nama Bahan / Item</th>
                          <th className="p-2 text-right">Harga (Rp)</th>
                          <th className="p-2 text-center bg-slate-100">Jml Pack</th>
                          <th className="p-2 text-center bg-slate-100">+ Pcs</th>
                          <th className="p-2 text-center font-bold bg-indigo-50 text-indigo-900">= Total Fisik</th>
                          <th className="p-2 text-center">Stok Sistem</th>
                          <th className="p-2 text-center">Selisih</th>
                          <th className="p-2 text-right">Nilai Selisih Rp</th>
                          <th className="p-2">Catatan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {catItems.map((entry, idx) => (
                          <tr key={idx} className={entry.selisih !== 0 ? 'bg-amber-50/30' : ''}>
                            <td className="p-2 font-mono text-gray-500 text-[10px]">{entry.item.id_barang}</td>
                            <td className="p-2 font-semibold text-gray-800">
                              {entry.item.nama_resmi}
                              {entry.stokFisik < entry.item.stok_min && (
                                <span className="ml-1.5 text-[9px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-normal">
                                  Min: {entry.item.stok_min}
                                </span>
                              )}
                            </td>
                            <td className="p-2 text-right text-gray-600 font-mono">{formatRupiah(entry.item.harga_satuan)}</td>
                            <td className="p-2 text-center font-bold text-slate-800 bg-slate-50">{entry.jumlahPack ?? 0} pack</td>
                            <td className="p-2 text-center font-semibold text-slate-700 bg-slate-50">{entry.jumlahPcs ?? 0} pcs</td>
                            <td className="p-2 text-center font-black text-indigo-950 bg-indigo-50/60">{entry.stokFisik} pcs</td>
                            <td className="p-2 text-center text-gray-600">{entry.stokSistem} pcs</td>
                            <td className="p-2 text-center font-bold">
                              <span className={entry.selisih < 0 ? 'text-red-600' : entry.selisih > 0 ? 'text-blue-600' : 'text-gray-400'}>
                                {entry.selisih > 0 ? `+${entry.selisih}` : entry.selisih}
                              </span>
                            </td>
                            <td className="p-2 text-right font-mono font-semibold">
                              <span className={entry.nilaiSelisihRp < 0 ? 'text-red-600' : entry.nilaiSelisihRp > 0 ? 'text-blue-600' : 'text-gray-400'}>
                                {formatRupiah(entry.nilaiSelisihRp)}
                              </span>
                            </td>
                            <td className="p-2 text-gray-500 italic text-[10px]">
                              {entry.catatan || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ringkasan Finansial Selisih */}
          <div className="mt-6 border-t-2 border-gray-900 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-xl">
            <div>
              <p className="text-xs text-gray-600">
                Total item diperiksa: <span className="font-bold text-gray-900">{reportData.items.length} item</span>
              </p>
              <p className="text-xs text-gray-600">
                Item mengalami selisih: <span className="font-bold text-amber-700">{reportData.items.filter(i => i.selisih !== 0).length} item</span>
              </p>
              <p className="text-xs text-red-600 font-semibold">
                Item kritis di bawah stok minimum: {lowStockItems.length} item
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 font-medium block">TOTAL NILAI SELISIH (VARIANCE)</span>
              <span className={`text-2xl font-black ${reportData.totalSelisihRp < 0 ? 'text-red-600' : reportData.totalSelisihRp > 0 ? 'text-blue-700' : 'text-emerald-700'}`}>
                {formatRupiah(reportData.totalSelisihRp)}
              </span>
            </div>
          </div>

          {/* Section Rekomendasi Restock */}
          {lowStockItems.length > 0 && (
            <div className="mt-6 border border-amber-300 bg-amber-50/70 p-4 rounded-xl text-xs">
              <h5 className="font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Daftar Bahan Yang Harus Segera Direstock (Auto Order):
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {lowStockItems.map((item, idx) => (
                  <div key={idx} className="bg-white p-2 rounded-lg border border-amber-200 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-800">{item.item.nama_resmi}</span>
                      <span className="text-[10px] text-gray-500 block">
                        Stok Fisik: <b className="text-red-600">{item.stokFisik}</b> {item.item.satuan_standar} (Batas Min: {item.item.stok_min})
                      </span>
                    </div>
                    <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      Saran Order: +{item.item.stok_min * 2 - item.stokFisik} {item.item.satuan_standar}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tanda Tangan Digital Kasir & Partner Shift */}
          <div className="mt-8 pt-6 border-t border-gray-300">
            <p className="text-[11px] text-gray-500 text-center mb-4 italic">
              Dengan menandatangani laporan ini, Kasir dan Partner Shift menyatakan bahwa perhitungan fisik dilakukan secara faktual dan bertanggung jawab atas integritas data.
            </p>
            <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
              {/* Kolom Kasir */}
              <div className="border border-gray-300 rounded-xl p-3 text-center bg-gray-50 flex flex-col justify-between h-40">
                <span className="text-xs font-semibold text-gray-700">Petugas Kasir</span>
                <div className="h-20 flex items-center justify-center my-1 bg-white rounded border border-dashed border-gray-200 overflow-hidden">
                  {reportData.signatureKasir ? (
                    <img src={reportData.signatureKasir} alt="TTD Kasir" className="max-h-16 max-w-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-gray-400 italic">(Belum ada tanda tangan)</span>
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-900 block underline">{reportData.kasir}</span>
                  <span className="text-[10px] text-gray-500">Kasir Shift Cabang Samata</span>
                </div>
              </div>

              {/* Kolom Partner */}
              <div className="border border-gray-300 rounded-xl p-3 text-center bg-gray-50 flex flex-col justify-between h-40">
                <span className="text-xs font-semibold text-gray-700">Partner Shift</span>
                <div className="h-20 flex items-center justify-center my-1 bg-white rounded border border-dashed border-gray-200 overflow-hidden">
                  {reportData.signaturePartner ? (
                    <img src={reportData.signaturePartner} alt="TTD Partner" className="max-h-16 max-w-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-gray-400 italic">(Belum ada tanda tangan)</span>
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-900 block underline">{reportData.partner}</span>
                  <span className="text-[10px] text-gray-500">Partner Shift Saksi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 text-center text-[10px] text-gray-400 border-t border-gray-100 pt-3">
            Dokumen ini di-generate secara otomatis oleh Sistem SCM Cabang Samata • ID Dokumen: {reportData.idOpname} • Dicetak: {new Date().toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  );
};

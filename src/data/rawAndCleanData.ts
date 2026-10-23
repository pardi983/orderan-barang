export interface OpnameItemData {
  id_barang: string;
  nama_item: string;
  nama_tampil: string; // e.g. Bakso Ikan besar (Isi 30 pcs/pack)
  isi_per_pack: number;
  initial_pack: number;
  initial_pcs: number;
  is_custom?: boolean;
}

export const INITIAL_EXACT_OPNAME_ITEMS: OpnameItemData[] = [
  // TOPPING
  { id_barang: 'TOP-001', nama_item: 'Bakso Ikan besar', nama_tampil: 'Bakso Ikan besar (Isi 25 pcs/pack)', isi_per_pack: 25, initial_pack: 1, initial_pcs: 37 },
  { id_barang: 'TOP-002', nama_item: 'bakso ikan kecil', nama_tampil: 'bakso ikan kecil (Isi 100 pcs/pack)', isi_per_pack: 100, initial_pack: 10, initial_pcs: 130 },
  { id_barang: 'TOP-003', nama_item: 'Urat gejrot', nama_tampil: 'Urat gejrot (Isi 20 pcs/pack)', isi_per_pack: 20, initial_pack: 0, initial_pcs: 0 },
  { id_barang: 'TOP-004', nama_item: 'Halus kejrot', nama_tampil: 'Halus kejrot (Isi 30 pcs/pack)', isi_per_pack: 30, initial_pack: 0, initial_pcs: 0 },
  { id_barang: 'TOP-005', nama_item: 'Bakso Krikil', nama_tampil: 'Bakso Krikil (Isi 100 pcs/pack)', isi_per_pack: 100, initial_pack: 0, initial_pcs: 93 },
  { id_barang: 'TOP-006', nama_item: 'Bakso Salmon', nama_tampil: 'Bakso Salmon (Isi 31 pcs/pack)', isi_per_pack: 31, initial_pack: 20, initial_pcs: 44 },
  { id_barang: 'TOP-007', nama_item: 'Bakso Tahu', nama_tampil: 'Bakso Tahu (Isi 20 pcs/pack)', isi_per_pack: 20, initial_pack: 1, initial_pcs: 8 },
  { id_barang: 'TOP-008', nama_item: 'Bakso Urat keju', nama_tampil: 'Bakso Urat keju (Isi 20 pcs/pack)', isi_per_pack: 20, initial_pack: 0, initial_pcs: 5 },
  { id_barang: 'TOP-009', nama_item: 'Bakso Urat Keju Besar', nama_tampil: 'Bakso Urat Keju Besar (Isi 10 pcs/pack)', isi_per_pack: 10, initial_pack: 0, initial_pcs: 0 },
  { id_barang: 'TOP-010', nama_item: 'Bakso Urat Mercon', nama_tampil: 'Bakso Urat Mercon (Isi 20 pcs/pack)', isi_per_pack: 20, initial_pack: 0, initial_pcs: 0 },
  { id_barang: 'TOP-011', nama_item: 'Bakso Urat Ori', nama_tampil: 'Bakso Urat Ori (Isi 20 pcs/pack)', isi_per_pack: 20, initial_pack: 1, initial_pcs: 23 },
  { id_barang: 'TOP-012', nama_item: 'Boci Keju', nama_tampil: 'Boci Keju (Isi 20 pcs/pack)', isi_per_pack: 20, initial_pack: 0, initial_pcs: 23 },
  { id_barang: 'TOP-013', nama_item: 'Boci mercon', nama_tampil: 'Boci mercon (Isi 20 pcs/pack)', isi_per_pack: 20, initial_pack: 0, initial_pcs: 29 },
  { id_barang: 'TOP-014', nama_item: 'Boci Ori', nama_tampil: 'Boci Ori (Isi 40 pcs/pack)', isi_per_pack: 40, initial_pack: 0, initial_pcs: 43 },
  { id_barang: 'TOP-015', nama_item: 'Boci Tahu', nama_tampil: 'Boci Tahu (Isi 20 pcs/pack)', isi_per_pack: 20, initial_pack: 1, initial_pcs: 12 },
  { id_barang: 'TOP-016', nama_item: 'CEKER-1KG', nama_tampil: 'CEKER-1KG (Isi 15 pcs/pack)', isi_per_pack: 15, initial_pack: 0, initial_pcs: 6 },
  { id_barang: 'TOP-017', nama_item: 'CHIKUWA', nama_tampil: 'CHIKUWA (Isi 83 pcs/pack)', isi_per_pack: 83, initial_pack: 0, initial_pcs: 0 },
  { id_barang: 'TOP-018', nama_item: 'Cimol Keju', nama_tampil: 'Cimol Keju (Isi 30 pcs/pack)', isi_per_pack: 30, initial_pack: 0, initial_pcs: 0 },
  { id_barang: 'TOP-019', nama_item: 'Cimol ori', nama_tampil: 'Cimol ori (Isi 50 pcs/pack)', isi_per_pack: 50, initial_pack: 0, initial_pcs: 0 },
  { id_barang: 'TOP-020', nama_item: 'CrabStik', nama_tampil: 'CrabStik (Isi 61 pcs/pack)', isi_per_pack: 61, initial_pack: 10, initial_pcs: 62 },
  { id_barang: 'TOP-021', nama_item: 'Daging Slice', nama_tampil: 'Daging Slice (Isi 5 pcs/pack)', isi_per_pack: 5, initial_pack: 0, initial_pcs: 5 },
  { id_barang: 'TOP-022', nama_item: 'Dumpling ayam', nama_tampil: 'Dumpling ayam (Isi 25 pcs/pack)', isi_per_pack: 25, initial_pack: 24, initial_pcs: 40 },
  { id_barang: 'TOP-023', nama_item: 'Dumpling keju', nama_tampil: 'Dumpling keju (Isi 25 pcs/pack)', isi_per_pack: 25, initial_pack: 13, initial_pcs: 10 },
  { id_barang: 'TOP-024', nama_item: 'Dumpling SPC', nama_tampil: 'Dumpling SPC (Isi 25 pcs/pack)', isi_per_pack: 25, initial_pack: 8, initial_pcs: 39 },
  { id_barang: 'TOP-025', nama_item: 'Enoki', nama_tampil: 'Enoki (Isi 3 pcs/pack)', isi_per_pack: 3, initial_pack: 0, initial_pcs: 0 },
  { id_barang: 'TOP-026', nama_item: 'Mozarella-23gr', nama_tampil: 'Mozarella-23gr (Isi 1 pcs/pack)', isi_per_pack: 1, initial_pack: 0, initial_pcs: 0 },
  { id_barang: 'TOP-027', nama_item: 'Odeng', nama_tampil: 'Odeng (Isi 48 pcs/pack)', isi_per_pack: 48, initial_pack: 13, initial_pcs: 2 },
  { id_barang: 'TOP-028', nama_item: 'Sayap', nama_tampil: 'Sayap (Isi 10 pcs/pack)', isi_per_pack: 10, initial_pack: 0, initial_pcs: 12 },
  { id_barang: 'TOP-029', nama_item: 'Sosis bratwust', nama_tampil: 'Sosis bratwust (Isi 25 pcs/pack)', isi_per_pack: 25, initial_pack: 13, initial_pcs: 15 },
  { id_barang: 'TOP-030', nama_item: 'Telur', nama_tampil: 'Telur (Isi 30 pcs/pack)', isi_per_pack: 30, initial_pack: 4, initial_pcs: 6 },
  { id_barang: 'TOP-031', nama_item: 'Twister', nama_tampil: 'Twister (Isi 20 pcs/pack)', isi_per_pack: 20, initial_pack: 0, initial_pcs: 0 },

  // BUMBU
  { id_barang: 'BMB-001', nama_item: 'BUMBU-ORI-3L', nama_tampil: 'BUMBU-ORI-3L (Isi 1 pack)', isi_per_pack: 1, initial_pack: 1, initial_pcs: 0 },
  { id_barang: 'BMB-002', nama_item: 'BUMBU-SOPUB 5 L', nama_tampil: 'BUMBU-SOPUB 5 L (Isi 1 pack)', isi_per_pack: 1, initial_pack: 1, initial_pcs: 0 },
  { id_barang: 'BMB-003', nama_item: 'BUMBU-TOMYAM-5 L', nama_tampil: 'BUMBU-TOMYAM-5 L (Isi 1 pack)', isi_per_pack: 1, initial_pack: 2, initial_pcs: 0 },
  { id_barang: 'BMB-004', nama_item: 'KALDU-250', nama_tampil: 'KALDU-250 (Isi 1 pack)', isi_per_pack: 1, initial_pack: 1, initial_pcs: 0 },
  { id_barang: 'BMB-005', nama_item: 'SAMBEL-SEBLAK500', nama_tampil: 'SAMBEL-SEBLAK500 (Isi 1 pack)', isi_per_pack: 1, initial_pack: 1, initial_pcs: 0 },
  { id_barang: 'BMB-006', nama_item: 'TETELAN-250', nama_tampil: 'TETELAN-250 (Isi 1 pack)', isi_per_pack: 1, initial_pack: 0, initial_pcs: 0 },

  // MINUMAN & PACKAGING
  { id_barang: 'OPS-001', nama_item: 'CupMinuman-22oz', nama_tampil: 'CupMinuman-22oz (Isi 50 pcs/pack)', isi_per_pack: 50, initial_pack: 1, initial_pcs: 20 },
  { id_barang: 'OPS-002', nama_item: 'CupMinuman-12oz', nama_tampil: 'CupMinuman-12oz (Isi 50 pcs/pack)', isi_per_pack: 50, initial_pack: 2, initial_pcs: 13 },
  { id_barang: 'MNM-001', nama_item: 'AIR-MINERAL BOTOL', nama_tampil: 'AIR-MINERAL BOTOL (Isi 24 pcs/pack)', isi_per_pack: 24, initial_pack: 0, initial_pcs: 7 },
];

// Helper to format an item line according to the user specification:
// "<Nama> <Jumlah Pack> (<Isi Pack>) <Jumlah Pcs> (<Total Semuanya>)"
export function formatOpnameTextLine(
  namaItem: string,
  pack: number,
  isiPack: number,
  pcs: number
): string {
  const total = pack * isiPack + pcs;
  if (isiPack <= 1) {
    return `${namaItem} ${pack} (${total})`;
  }
  return `${namaItem} ${pack} (${isiPack}) ${pcs} (${total})`;
}

// Compatibility types and alias
export interface CleanedItem {
  id_barang: string;
  nama_resmi: string;
  kategori_baru: string;
  satuan_standar: string;
  harga_satuan: number;
  stok_min: number;
  isi_per_pack: number;
  konversi_satuan?: string;
  catatan_perbaikan?: string;
}

export const STANDARDIZED_MASTER_DATA: CleanedItem[] = INITIAL_EXACT_OPNAME_ITEMS.map(i => ({
  id_barang: i.id_barang,
  nama_resmi: i.nama_tampil,
  kategori_baru: 'Topping',
  satuan_standar: 'Pcs',
  harga_satuan: 1000,
  stok_min: 10,
  isi_per_pack: i.isi_per_pack,
  konversi_satuan: `1 Pack = ${i.isi_per_pack} Pcs`,
}));

export function generateMasterCSV(): string {
  const headers = ['ID_Barang', 'Nama_Item', 'Isi_Per_Pack'];
  const rows = INITIAL_EXACT_OPNAME_ITEMS.map(item => [
    item.id_barang,
    `"${item.nama_item.replace(/"/g, '""')}"`,
    item.isi_per_pack,
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export const OPNAME_DATA_2026_10_23 = {
  tanggal: '2026-10-23',
  cabang: 'Samata',
  kasirName: 'pardianto',
  partnerName: 'zulnia',
  stockQuantities: {
    'TOP-001': { pack: 2, pcs: 23 },   // Bakso Ikan besar 2 (25) 23 (73)
    'TOP-002': { pack: 14, pcs: 108 }, // bakso ikan kecil 14 (100) 108 (1508)
    'TOP-003': { pack: 0, pcs: 0 },    // Urat gejrot 0 (20) 0 (0)
    'TOP-004': { pack: 0, pcs: 0 },    // Halus kejrot 0 (30) 0 (0)
    'TOP-005': { pack: 0, pcs: 58 },   // Bakso Krikil 0 (100) 58 (58)
    'TOP-006': { pack: 20, pcs: 26 },  // Bakso Salmon 20 (31) 26 (646)
    'TOP-007': { pack: 2, pcs: 10 },   // Bakso Tahu 2 (20) 10 (50)
    'TOP-008': { pack: 1, pcs: 14 },   // Bakso Urat keju 1 (20) 14 (34)
    'TOP-009': { pack: 0, pcs: 0 },    // Bakso Urat Keju Besar 0 (10) 0 (0)
    'TOP-010': { pack: 0, pcs: 0 },    // Bakso Urat Mercon 0 (20) 0 (0)
    'TOP-011': { pack: 1, pcs: 19 },   // Bakso Urat Ori 1 (20) 19 (39)
    'TOP-012': { pack: 0, pcs: 14 },   // Boci Keju 0 (20) 14 (14)
    'TOP-013': { pack: 0, pcs: 20 },   // Boci mercon 0 (20) 20 (20)
    'TOP-014': { pack: 0, pcs: 23 },   // Boci Ori 0 (40) 23 (23)
    'TOP-015': { pack: 0, pcs: 16 },   // Boci Tahu 0 (20) 16 (16)
    'TOP-016': { pack: 0, pcs: 14 },   // CEKER-1KG 0 (15) 14 (14)
    'TOP-017': { pack: 0, pcs: 0 },    // CHIKUWA 0 (83) 0 (0)
    'TOP-018': { pack: 0, pcs: 0 },    // Cimol Keju 0 (30) 0 (0)
    'TOP-019': { pack: 0, pcs: 0 },    // Cimol ori 0 (50) 0 (0)
    'TOP-020': { pack: 10, pcs: 39 },  // CrabStik 10 (61) 39 (649)
    'TOP-021': { pack: 0, pcs: 3 },    // Daging Slice 0 (5) 3 (3)
    'TOP-022': { pack: 45, pcs: 17 },  // Dumpling ayam 45 (25) 17 (1142)
    'TOP-023': { pack: 11, pcs: 6 },   // Dumpling keju 11 (25) 6 (281)
    'TOP-024': { pack: 8, pcs: 27 },   // Dumpling SPC 8 (25) 27 (227)
    'TOP-025': { pack: 0, pcs: 0 },    // Enoki 0 (3) 0 (0)
    'TOP-026': { pack: 0, pcs: 10 },   // Mozarella-23gr 0 (10)
    'TOP-027': { pack: 12, pcs: 13 },  // Odeng 12 (48) 13 (589)
    'TOP-028': { pack: 0, pcs: 12 },   // Sayap 0 (10) 12 (12)
    'TOP-029': { pack: 11, pcs: 18 },  // Sosis bratwust 11 (25) 18 (293)
    'TOP-030': { pack: 7, pcs: 2 },    // Telur 7 (30) 2 (212)
    'TOP-031': { pack: 0, pcs: 0 },    // Twister 0 (20) 0 (0)
    'BMB-001': { pack: 1, pcs: 0 },    // BUMBU-ORI-3L 1 (1)
    'BMB-002': { pack: 0, pcs: 0 },    // BUMBU-SOPUB 5 L 0 (0)
    'BMB-003': { pack: 2, pcs: 0 },    // BUMBU-TOMYAM-5 L 2 (2)
    'BMB-004': { pack: 0, pcs: 0 },    // KALDU-250 0 (0)
    'BMB-005': { pack: 2, pcs: 0 },    // SAMBEL-SEBLAK500 2 (2)
    'BMB-006': { pack: 0, pcs: 0 },    // TETELAN-250 0 (0)
    'OPS-001': { pack: 0, pcs: 41 },   // CupMinuman-22oz 0 (50) 41 (41)
    'OPS-002': { pack: 2, pcs: 4 },    // CupMinuman-12oz 2 (50) 4 (104)
    'MNM-001': { pack: 0, pcs: 53 },   // AIR-MINERAL BOTOL 0 (24) 53 (53)
  } as Record<string, { pack: number; pcs: number }>,
};



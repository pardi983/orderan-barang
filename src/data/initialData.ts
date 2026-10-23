export interface MasterItem {
  ID_Barang: string;
  Nama_Item: string;
  Kategori: 'Topping' | 'Bumbu' | 'Minuman' | 'Bahan Operasional';
  Satuan: string;
  Harga_Satuan: number;
  Stok_Min: number;
  Aktif: 'Y' | 'N';
  Konversi_Satuan?: string;
  Catatan_Audit?: string;
  Stok_Sistem_Sample: number;
}

export interface KaryawanItem {
  ID: string;
  Nama: string;
  Role: 'Kasir' | 'Partner' | 'Supervisor';
  Cabang: string;
  Email: string;
}

export interface AuditIssue {
  kategori_masalah: string;
  item_terdampak: string;
  kondisi_sebelum: string;
  dampak_resiko: string;
  solusi_perbaikan: string;
  aturan_konversi: string;
}

export const AUDIT_ISSUES: AuditIssue[] = [
  {
    kategori_masalah: 'Duplikasi & Ambiguitas Nama',
    item_terdampak: 'Jamur Enoki',
    kondisi_sebelum: 'Tercatat sebagai "Enoki", "Enoki Pack", dan "Jamur Enoki" di baris berbeda.',
    dampak_resiko: 'Kasir salah input baris; stok terpecah di sistem sehingga laporan selisih tidak akurat.',
    solusi_perbaikan: 'Dilebur menjadi satu item resmi: "Jamur Enoki 100gr" (ID: TOP-005).',
    aturan_konversi: '1 Pack = 1 Porsi (100 gram)'
  },
  {
    kategori_masalah: 'Multi-Satuan Tidak Terstandar',
    item_terdampak: 'Telur Ayam',
    kondisi_sebelum: 'Di gudang tercatat "Rak", di resep tercatat "Butir", di nota beli tercatat "Kg".',
    dampak_resiko: 'Jika kasir input angka 3 (maksudnya 3 rak), sistem membaca 3 butir. Selisih Rp 150.000+ per opname.',
    solusi_perbaikan: 'Standarisasi satuan terkecil transaksi: "Butir" (ID: TOP-004). Tombol konversi cepat di UI (1 Rak = 30 Butir).',
    aturan_konversi: '1 Rak = 30 Butir (~1.8 Kg), 1 Kg ≈ 16-17 Butir'
  },
  {
    kategori_masalah: 'Tercampur Antara Topping & Bumbu',
    item_terdampak: 'Cikur',
    kondisi_sebelum: 'Hanya tertulis "Cikur" tanpa keterangan apakah bumbu kencur giling atau topping pilus.',
    dampak_resiko: 'Topping seblak dihitung sebagai bumbu dapur, harga pokok penjualan (HPP) berantakan.',
    solusi_perbaikan: 'Dipisah tegas: "Pilus Cikur Renyah" (TOP-008, Pack 250gr) dan "Kencur Segar / Cikur Halus" (BMB-003, Kg).',
    aturan_konversi: 'Topping per Pack 250g; Bumbu dapur per Kilogram (Kg)'
  },
  {
    kategori_masalah: 'Variasi Penyebutan Bahan Baku',
    item_terdampak: 'Tetelan Sapi',
    kondisi_sebelum: 'Tercatat "Tetelan", "Tetelan Rebus", "Daging Tetelan Sapi".',
    dampak_resiko: 'Stok fisik tersisa tidak dihitung lengkap karena kasir bingung memilih baris.',
    solusi_perbaikan: 'Standarisasi ke "Tetelan Sapi Siap Saji" (TOP-002, Porsi 50gr) dengan harga acuan baku.',
    aturan_konversi: '1 Kg Daging Matang = 20 Porsi (@ 50gr)'
  },
  {
    kategori_masalah: 'Ambiguitas Bentuk Olahan',
    item_terdampak: 'Sambel Seblak',
    kondisi_sebelum: 'Tercatat "Sambel", "Sambel Seblak", "Cabai Giling Seblak".',
    dampak_resiko: 'Bumbu matang tercampur bahan mentah; takaran porsi saji meleset.',
    solusi_perbaikan: 'Standarisasi ke "Sambel Seblak Matang Base" (BMB-001, Liter/Botol).',
    aturan_konversi: '1 Botol = 1.000 ml (Kapasitas ± 40 Porsi Seblak)'
  },
  {
    kategori_masalah: 'Satuan Grosir vs Satuan Ecer Kasir',
    item_terdampak: 'Sedotan Plastik',
    kondisi_sebelum: 'Tercatat "Sedotan Dus" dan "Sedotan Ecer" tanpa keterangan isi pcs.',
    dampak_resiko: 'Salah hitung logistik operasional; kasir mengisi sisa sedotan dalam batang padahal sistem menghitung dus.',
    solusi_perbaikan: 'Standarisasi ke "Sedotan Steril Ulir" (OPS-001, Pack).',
    aturan_konversi: '1 Dus = 20 Pack (@ 100 batang = 2.000 batang)'
  },
  {
    kategori_masalah: 'Satuan Grosir vs Satuan Ecer Kasir',
    item_terdampak: 'Sendok Plastik',
    kondisi_sebelum: 'Tercatat ganda: "Sendok Plastik Bening" dan "Sendok Putih Dus".',
    dampak_resiko: 'Terjadi duplicate SKU, inventori operasional tampak menumpuk.',
    solusi_perbaikan: 'Standarisasi ke "Sendok Plastik Bening Tebal" (OPS-002, Pack).',
    aturan_konversi: '1 Dus = 25 Pack (@ 50 pcs = 1.250 pcs)'
  },
  {
    kategori_masalah: 'Format Harga Campur Teks & Koma',
    item_terdampak: 'Semua Kategori',
    kondisi_sebelum: 'Format heterogen: "Rp 15.000,-", "12,500", "8.000 IDR", "FREE".',
    dampak_resiko: 'Formula AppSheet [Selisih] * [Harga_Satuan] error atau menghasilkan NaN / Rp 0.',
    solusi_perbaikan: 'Konversi total ke Angka Murni (Integer/Decimal murni tanpa Rp atau titik ribuan).',
    aturan_konversi: 'Contoh: Rp 15.000,- diubah menjadi 15000'
  },
  {
    kategori_masalah: 'Nomor Urut Ganda / No Key',
    item_terdampak: 'Sheet Excel Asli',
    kondisi_sebelum: 'Setiap kategori mulai dari nomor 1 lagi; tidak ada ID unik (Primary Key).',
    dampak_resiko: 'AppSheet gagal membangun relasi [ID_Barang] di tabel Opname_Detail.',
    solusi_perbaikan: 'Sistem pengkodean Prefix SKU unik 3 Huruf + 3 Angka: TOP-xxx, BMB-xxx, MNM-xxx, OPS-xxx.',
    aturan_konversi: 'Key konsisten dan tidak pernah berubah (immutable)'
  }
];

export const MASTER_BARANG_CLEAN: MasterItem[] = [
  // --- KATEGORI 1: TOPPING ---
  {
    ID_Barang: 'TOP-001',
    Nama_Item: 'Bakso Ikan',
    Kategori: 'Topping',
    Satuan: 'Butir',
    Harga_Satuan: 1200,
    Stok_Min: 50,
    Aktif: 'Y',
    Konversi_Satuan: '1 Pack = 50 Butir',
    Catatan_Audit: 'Sebelumnya tidak ada satuan; kini ditetapkan per butir.',
    Stok_Sistem_Sample: 65
  },
  {
    ID_Barang: 'TOP-002',
    Nama_Item: 'Boci Keju Lumer',
    Kategori: 'Topping',
    Satuan: 'Butir',
    Harga_Satuan: 1500,
    Stok_Min: 40,
    Aktif: 'Y',
    Konversi_Satuan: '1 Pack = 40 Butir',
    Catatan_Audit: 'Nama disatukan dari Boci Keju & Baso Aci Isi Keju.',
    Stok_Sistem_Sample: 38
  },
  {
    ID_Barang: 'TOP-003',
    Nama_Item: 'Tetelan Sapi Siap Saji',
    Kategori: 'Topping',
    Satuan: 'Porsi',
    Harga_Satuan: 5000,
    Stok_Min: 20,
    Aktif: 'Y',
    Konversi_Satuan: '1 Porsi = 50 Gram matang',
    Catatan_Audit: 'Dilebur dari 3 baris tetelan (rebus/matang).',
    Stok_Sistem_Sample: 22
  },
  {
    ID_Barang: 'TOP-004',
    Nama_Item: 'Telur Ayam Segar',
    Kategori: 'Topping',
    Satuan: 'Butir',
    Harga_Satuan: 2000,
    Stok_Min: 60,
    Aktif: 'Y',
    Konversi_Satuan: '1 Rak = 30 Butir (±1.8 Kg)',
    Catatan_Audit: 'Standarisasi ke satuan butir dengan helper konversi rak.',
    Stok_Sistem_Sample: 90
  },
  {
    ID_Barang: 'TOP-005',
    Nama_Item: 'Jamur Enoki Segar',
    Kategori: 'Topping',
    Satuan: 'Pack',
    Harga_Satuan: 4500,
    Stok_Min: 15,
    Aktif: 'Y',
    Konversi_Satuan: '1 Pack = 100 Gram',
    Catatan_Audit: 'Dilebur dari Enoki, Enoki Pack, dan Jamur Enoki.',
    Stok_Sistem_Sample: 18
  },
  {
    ID_Barang: 'TOP-006',
    Nama_Item: 'Sosis Sapi Cocktail',
    Kategori: 'Topping',
    Satuan: 'Pcs',
    Harga_Satuan: 1500,
    Stok_Min: 30,
    Aktif: 'Y',
    Konversi_Satuan: '1 Pack = 30 Pcs',
    Catatan_Audit: 'Harga dinormalkan dari Rp 1.500,- menjadi 1500.',
    Stok_Sistem_Sample: 42
  },
  {
    ID_Barang: 'TOP-007',
    Nama_Item: 'Dumpling Keju',
    Kategori: 'Topping',
    Satuan: 'Pcs',
    Harga_Satuan: 2500,
    Stok_Min: 25,
    Aktif: 'Y',
    Konversi_Satuan: '1 Pack = 25 Pcs',
    Catatan_Audit: 'Satuan baku per pcs saji.',
    Stok_Sistem_Sample: 28
  },
  {
    ID_Barang: 'TOP-008',
    Nama_Item: 'Pilus Cikur Renyah',
    Kategori: 'Topping',
    Satuan: 'Pack',
    Harga_Satuan: 8000,
    Stok_Min: 10,
    Aktif: 'Y',
    Konversi_Satuan: '1 Pack = 250 Gram',
    Catatan_Audit: 'Dipisahkan secara tegas dari bumbu kencur dapur.',
    Stok_Sistem_Sample: 12
  },
  {
    ID_Barang: 'TOP-009',
    Nama_Item: 'Cuanki Lidah',
    Kategori: 'Topping',
    Satuan: 'Pcs',
    Harga_Satuan: 1000,
    Stok_Min: 50,
    Aktif: 'Y',
    Konversi_Satuan: '1 Bungkus Besar = 50 Pcs',
    Catatan_Audit: 'Satuan fisik dihitung per pcs.',
    Stok_Sistem_Sample: 55
  },
  {
    ID_Barang: 'TOP-010',
    Nama_Item: 'Cuanki Tahu Kering',
    Kategori: 'Topping',
    Satuan: 'Pcs',
    Harga_Satuan: 800,
    Stok_Min: 50,
    Aktif: 'Y',
    Konversi_Satuan: '1 Bungkus Besar = 50 Pcs',
    Catatan_Audit: 'Pemisahan jelas dari cuanki lidah.',
    Stok_Sistem_Sample: 60
  },
  {
    ID_Barang: 'TOP-011',
    Nama_Item: 'Kerupuk Mawar Putih',
    Kategori: 'Topping',
    Satuan: 'Kg',
    Harga_Satuan: 18000,
    Stok_Min: 5,
    Aktif: 'Y',
    Konversi_Satuan: '1 Bal = 5 Kg',
    Catatan_Audit: 'Ditetapkan dalam Kilogram.',
    Stok_Sistem_Sample: 8
  },
  {
    ID_Barang: 'TOP-012',
    Nama_Item: 'Kerupuk Kentang Kuning',
    Kategori: 'Topping',
    Satuan: 'Kg',
    Harga_Satuan: 20000,
    Stok_Min: 5,
    Aktif: 'Y',
    Konversi_Satuan: '1 Bal = 5 Kg',
    Catatan_Audit: 'Nomor urut distandarkan TOP-012.',
    Stok_Sistem_Sample: 6
  },
  {
    ID_Barang: 'TOP-013',
    Nama_Item: 'Chikuwa Seafood',
    Kategori: 'Topping',
    Satuan: 'Pcs',
    Harga_Satuan: 1500,
    Stok_Min: 30,
    Aktif: 'Y',
    Konversi_Satuan: '1 Pack = 30 Pcs',
    Catatan_Audit: 'Satuan per pcs.',
    Stok_Sistem_Sample: 35
  },
  {
    ID_Barang: 'TOP-014',
    Nama_Item: 'Crabstick Olahan',
    Kategori: 'Topping',
    Satuan: 'Pcs',
    Harga_Satuan: 1200,
    Stok_Min: 30,
    Aktif: 'Y',
    Konversi_Satuan: '1 Pack = 30 Pcs',
    Catatan_Audit: 'Format harga dinormalkan.',
    Stok_Sistem_Sample: 32
  },

  // --- KATEGORI 2: BUMBU ---
  {
    ID_Barang: 'BMB-001',
    Nama_Item: 'Sambel Seblak Matang Base',
    Kategori: 'Bumbu',
    Satuan: 'Liter',
    Harga_Satuan: 35000,
    Stok_Min: 3,
    Aktif: 'Y',
    Konversi_Satuan: '1 Jerigen Kecil = 5 Liter',
    Catatan_Audit: 'Dilebur dari Sambel Cabe, Sambel Seblak, & Bumbu Pedas.',
    Stok_Sistem_Sample: 4.5
  },
  {
    ID_Barang: 'BMB-002',
    Nama_Item: 'Bawang Putih Giling Halus',
    Kategori: 'Bumbu',
    Satuan: 'Kg',
    Harga_Satuan: 32000,
    Stok_Min: 3,
    Aktif: 'Y',
    Konversi_Satuan: '1 Wadah = 1 Kg',
    Catatan_Audit: 'Satuan dinormalkan ke Kg murni.',
    Stok_Sistem_Sample: 4
  },
  {
    ID_Barang: 'BMB-003',
    Nama_Item: 'Kencur Dapur Halus (Cikur Masak)',
    Kategori: 'Bumbu',
    Satuan: 'Kg',
    Harga_Satuan: 28000,
    Stok_Min: 2,
    Aktif: 'Y',
    Konversi_Satuan: '1 Wadah = 1 Kg',
    Catatan_Audit: 'Dipisah tegas dari Pilus Cikur Topping.',
    Stok_Sistem_Sample: 2.5
  },
  {
    ID_Barang: 'BMB-004',
    Nama_Item: 'Bubuk Cabai Ekstra Pedas',
    Kategori: 'Bumbu',
    Satuan: 'Kg',
    Harga_Satuan: 45000,
    Stok_Min: 2,
    Aktif: 'Y',
    Konversi_Satuan: '1 Pack = 1 Kg',
    Catatan_Audit: 'Harga dijadikan angka murni 45000.',
    Stok_Sistem_Sample: 3
  },
  {
    ID_Barang: 'BMB-005',
    Nama_Item: 'Penyedap Rasa Gurih Rasa Ayam',
    Kategori: 'Bumbu',
    Satuan: 'Pack',
    Harga_Satuan: 14000,
    Stok_Min: 4,
    Aktif: 'Y',
    Konversi_Satuan: '1 Pack = 500 Gram',
    Catatan_Audit: 'Ditetapkan satuan pack 500g.',
    Stok_Sistem_Sample: 5
  },
  {
    ID_Barang: 'BMB-006',
    Nama_Item: 'Garam Dapur Halus',
    Kategori: 'Bumbu',
    Satuan: 'Pack',
    Harga_Satuan: 5000,
    Stok_Min: 5,
    Aktif: 'Y',
    Konversi_Satuan: '1 Pack = 500 Gram',
    Catatan_Audit: 'Standar kemasan ritel 500g.',
    Stok_Sistem_Sample: 7
  },
  {
    ID_Barang: 'BMB-007',
    Nama_Item: 'Minyak Goreng Sawit',
    Kategori: 'Bumbu',
    Satuan: 'Liter',
    Harga_Satuan: 17500,
    Stok_Min: 6,
    Aktif: 'Y',
    Konversi_Satuan: '1 Dus = 6 Pouch (@ 2 Liter = 12 Liter)',
    Catatan_Audit: 'Satuan inventori operasional = Liter.',
    Stok_Sistem_Sample: 8
  },
  {
    ID_Barang: 'BMB-008',
    Nama_Item: 'Minyak Bawang Aromatik',
    Kategori: 'Bumbu',
    Satuan: 'Liter',
    Harga_Satuan: 26000,
    Stok_Min: 2,
    Aktif: 'Y',
    Konversi_Satuan: '1 Botol = 1 Liter',
    Catatan_Audit: 'Item bumbu khusus racikan dapur Samata.',
    Stok_Sistem_Sample: 3
  },

  // --- KATEGORI 3: MINUMAN ---
  {
    ID_Barang: 'MNM-001',
    Nama_Item: 'Bubuk Minuman Thai Tea',
    Kategori: 'Minuman',
    Satuan: 'Pack',
    Harga_Satuan: 55000,
    Stok_Min: 2,
    Aktif: 'Y',
    Konversi_Satuan: '1 Pack = 1 Kg (± 30 Porsi Cup 16oz)',
    Catatan_Audit: 'Ditetapkan satuan pack 1 kg.',
    Stok_Sistem_Sample: 3
  },
  {
    ID_Barang: 'MNM-002',
    Nama_Item: 'Bubuk Minuman Green Tea Matcha',
    Kategori: 'Minuman',
    Satuan: 'Pack',
    Harga_Satuan: 60000,
    Stok_Min: 2,
    Aktif: 'Y',
    Konversi_Satuan: '1 Pack = 1 Kg (± 30 Porsi)',
    Catatan_Audit: 'Harga numerik 60000.',
    Stok_Sistem_Sample: 2.5
  },
  {
    ID_Barang: 'MNM-003',
    Nama_Item: 'Sirup Gula Cair Murni (Simple Syrup)',
    Kategori: 'Minuman',
    Satuan: 'Jerigen',
    Harga_Satuan: 40000,
    Stok_Min: 2,
    Aktif: 'Y',
    Konversi_Satuan: '1 Jerigen = 5 Liter',
    Catatan_Audit: 'Standar jerigen 5L.',
    Stok_Sistem_Sample: 3
  },
  {
    ID_Barang: 'MNM-004',
    Nama_Item: 'Susu Kental Manis Carnation',
    Kategori: 'Minuman',
    Satuan: 'Kaleng',
    Harga_Satuan: 12500,
    Stok_Min: 8,
    Aktif: 'Y',
    Konversi_Satuan: '1 Dus = 48 Kaleng (@ 370gr)',
    Catatan_Audit: 'Satuan hitung harian = Kaleng.',
    Stok_Sistem_Sample: 12
  },
  {
    ID_Barang: 'MNM-005',
    Nama_Item: 'Susu Evaporasi Tiga Sapi',
    Kategori: 'Minuman',
    Satuan: 'Kaleng',
    Harga_Satuan: 15500,
    Stok_Min: 6,
    Aktif: 'Y',
    Konversi_Satuan: '1 Dus = 48 Kaleng (@ 380gr)',
    Catatan_Audit: 'Satuan hitung harian = Kaleng.',
    Stok_Sistem_Sample: 9
  },
  {
    ID_Barang: 'MNM-006',
    Nama_Item: 'Teh Celup Melati Jumbo',
    Kategori: 'Minuman',
    Satuan: 'Box',
    Harga_Satuan: 18000,
    Stok_Min: 3,
    Aktif: 'Y',
    Konversi_Satuan: '1 Box = 25 Kantong Jumbo (1 Kantong = 5 Liter Teh)',
    Catatan_Audit: 'Ditetapkan dalam box.',
    Stok_Sistem_Sample: 4
  },
  {
    ID_Barang: 'MNM-007',
    Nama_Item: 'Biji Selasih Kering',
    Kategori: 'Minuman',
    Satuan: 'Pack',
    Harga_Satuan: 16000,
    Stok_Min: 2,
    Aktif: 'Y',
    Konversi_Satuan: '1 Pack = 250 Gram',
    Catatan_Audit: 'Satuan pack 250g.',
    Stok_Sistem_Sample: 2
  },

  // --- KATEGORI 4: BAHAN OPERASIONAL ---
  {
    ID_Barang: 'OPS-001',
    Nama_Item: 'Sedotan Steril Ulir Bening',
    Kategori: 'Bahan Operasional',
    Satuan: 'Pack',
    Harga_Satuan: 8500,
    Stok_Min: 5,
    Aktif: 'Y',
    Konversi_Satuan: '1 Dus = 20 Pack (@ 100 Pcs = 2.000 Pcs)',
    Catatan_Audit: 'Sebelumnya tercatat Dus & Ecer; kini standarisasi ke Pack.',
    Stok_Sistem_Sample: 7
  },
  {
    ID_Barang: 'OPS-002',
    Nama_Item: 'Sendok Plastik Bening Tebal',
    Kategori: 'Bahan Operasional',
    Satuan: 'Pack',
    Harga_Satuan: 7000,
    Stok_Min: 6,
    Aktif: 'Y',
    Konversi_Satuan: '1 Dus = 25 Pack (@ 50 Pcs = 1.250 Pcs)',
    Catatan_Audit: 'Dilebur dari Sendok Putih & Sendok Bening ganda.',
    Stok_Sistem_Sample: 8
  },
  {
    ID_Barang: 'OPS-003',
    Nama_Item: 'Cup Minuman Dingin 16oz Sablon',
    Kategori: 'Bahan Operasional',
    Satuan: 'Roll',
    Harga_Satuan: 22000,
    Stok_Min: 5,
    Aktif: 'Y',
    Konversi_Satuan: '1 Dus = 20 Roll (@ 50 Pcs = 1.000 Cup)',
    Catatan_Audit: 'Satuan opname di kasir = Roll.',
    Stok_Sistem_Sample: 6
  },
  {
    ID_Barang: 'OPS-004',
    Nama_Item: 'Lid Sealer Cup Minuman Motif',
    Kategori: 'Bahan Operasional',
    Satuan: 'Roll',
    Harga_Satuan: 65000,
    Stok_Min: 2,
    Aktif: 'Y',
    Konversi_Satuan: '1 Roll = 1.200 Cup Sealing',
    Catatan_Audit: 'Satuan roll murni.',
    Stok_Sistem_Sample: 2
  },
  {
    ID_Barang: 'OPS-005',
    Nama_Item: 'Mangkok Kertas Kraft Takeaway (Paper Bowl 650ml)',
    Kategori: 'Bahan Operasional',
    Satuan: 'Pack',
    Harga_Satuan: 34000,
    Stok_Min: 5,
    Aktif: 'Y',
    Konversi_Satuan: '1 Dus = 10 Pack (@ 25 Pcs = 250 Bowl)',
    Catatan_Audit: 'Satuan harian = Pack.',
    Stok_Sistem_Sample: 7
  },
  {
    ID_Barang: 'OPS-006',
    Nama_Item: 'Tutup Lid Paper Bowl 650ml',
    Kategori: 'Bahan Operasional',
    Satuan: 'Pack',
    Harga_Satuan: 16000,
    Stok_Min: 5,
    Aktif: 'Y',
    Konversi_Satuan: '1 Dus = 10 Pack (@ 25 Pcs = 250 Lid)',
    Catatan_Audit: 'Dipisahkan dari bowl agar selisih tutup terlacak.',
    Stok_Sistem_Sample: 8
  },
  {
    ID_Barang: 'OPS-007',
    Nama_Item: 'Kantong Kresek Bening Sablon 15cm',
    Kategori: 'Bahan Operasional',
    Satuan: 'Pack',
    Harga_Satuan: 9000,
    Stok_Min: 6,
    Aktif: 'Y',
    Konversi_Satuan: '1 Ikat = 5 Pack (@ 100 Lembar = 500 Lembar)',
    Catatan_Audit: 'Satuan opname = Pack.',
    Stok_Sistem_Sample: 9
  },
  {
    ID_Barang: 'OPS-008',
    Nama_Item: 'Kertas Struk Thermal Kasir 58mm',
    Kategori: 'Bahan Operasional',
    Satuan: 'Roll',
    Harga_Satuan: 4000,
    Stok_Min: 8,
    Aktif: 'Y',
    Konversi_Satuan: '1 Dus = 50 Roll',
    Catatan_Audit: 'Satuan hitung = Roll.',
    Stok_Sistem_Sample: 14
  },
  {
    ID_Barang: 'OPS-009',
    Nama_Item: 'Sarung Tangan Plastik Higienis (Food Grade)',
    Kategori: 'Bahan Operasional',
    Satuan: 'Box',
    Harga_Satuan: 15000,
    Stok_Min: 3,
    Aktif: 'Y',
    Konversi_Satuan: '1 Box = 100 Pcs (50 Pasang)',
    Catatan_Audit: 'Satuan baku = Box.',
    Stok_Sistem_Sample: 4
  },
  {
    ID_Barang: 'OPS-010',
    Nama_Item: 'Gas LPG Melon 3 Kg',
    Kategori: 'Bahan Operasional',
    Satuan: 'Tabung',
    Harga_Satuan: 22000,
    Stok_Min: 3,
    Aktif: 'Y',
    Konversi_Satuan: '1 Tabung = 3 Kg Gas',
    Catatan_Audit: 'Tabung isi siap pakai.',
    Stok_Sistem_Sample: 4
  }
];

export const KARYAWAN_SAMATA: KaryawanItem[] = [
  { ID: 'KRY-001', Nama: 'Budi Santoso', Role: 'Kasir', Cabang: 'Samata', Email: 'budi.samata@resto.com' },
  { ID: 'KRY-002', Nama: 'Siti Rahma', Role: 'Partner', Cabang: 'Samata', Email: 'siti.samata@resto.com' },
  { ID: 'KRY-003', Nama: 'Rizky Pratama', Role: 'Kasir', Cabang: 'Samata', Email: 'rizky.samata@resto.com' },
  { ID: 'KRY-004', Nama: 'Dewi Anggraini', Role: 'Partner', Cabang: 'Samata', Email: 'dewi.samata@resto.com' },
  { ID: 'KRY-005', Nama: 'Andi Saputra', Role: 'Supervisor', Cabang: 'Samata', Email: 'andi.samata@resto.com' }
];

export const APPSHEET_TABLE_SCHEMAS = {
  Master_Barang: [
    { kolom: 'ID_Barang', type: 'Text', key: true, label: false, initial: 'CONCATENATE("TOP-", UNIQUEID())', formula: '-', note: 'Key utama, tidak boleh diubah setelah dibuat' },
    { kolom: 'Nama_Item', type: 'Text', key: false, label: true, initial: '-', formula: '-', note: 'Label yang tampil di dropdown' },
    { kolom: 'Kategori', type: 'Enum', key: false, label: false, initial: '"Topping"', formula: '-', note: 'Topping, Bumbu, Minuman, Bahan Operasional' },
    { kolom: 'Satuan', type: 'Enum', key: false, label: false, initial: '"Pcs"', formula: '-', note: 'Butir, Porsi, Pack, Kg, Liter, Kaleng, Roll, Box, Tabung' },
    { kolom: 'Harga_Satuan', type: 'Price', key: false, label: false, initial: '0', formula: '-', note: 'Format rupiah murni, Currency symbol Rp' },
    { kolom: 'Stok_Min', type: 'Decimal', key: false, label: false, initial: '5', formula: '-', note: 'Batas minimal restock trigger' },
    { kolom: 'Aktif', type: 'Enum', key: false, label: false, initial: '"Y"', formula: '-', note: 'Y / N (Filter hanya item aktif yang muncul)' },
    { kolom: 'Konversi_Satuan', type: 'Text', key: false, label: false, initial: '""', formula: '-', note: 'Keterangan konversi (misal 1 Rak = 30 Butir)' }
  ],
  Karyawan: [
    { kolom: 'ID', type: 'Text', key: true, label: false, initial: 'UNIQUEID()', formula: '-', note: 'Primary key staf' },
    { kolom: 'Nama', type: 'Text', key: false, label: true, initial: '-', formula: '-', note: 'Nama lengkap karyawan' },
    { kolom: 'Role', type: 'Enum', key: false, label: false, initial: '"Kasir"', formula: '-', note: 'Kasir / Partner / Supervisor' },
    { kolom: 'Cabang', type: 'Text', key: false, label: false, initial: '"Samata"', formula: '-', note: 'Lokasi cabang' },
    { kolom: 'Email', type: 'Email', key: false, label: false, initial: '-', formula: '-', note: 'Email login Google AppSheet (USEREMAIL())' }
  ],
  Opname_Header: [
    { kolom: 'ID_Opname', type: 'Text', key: true, label: false, initial: 'CONCATENATE("OPN-", TEXT(TODAY(), "YYYYMMDD"), "-", UNIQUEID())', formula: '-', note: 'ID unik per sesi opname' },
    { kolom: 'Tanggal', type: 'Date', key: false, label: false, initial: 'TODAY()', formula: '-', note: 'Otomatis tanggal saat dibuat' },
    { kolom: 'Cabang', type: 'Text', key: false, label: false, initial: '"Samata"', formula: '-', note: 'Cabang bertugas' },
    { kolom: 'Nama_Kasir', type: 'Text', key: false, label: true, initial: 'LOOKUP(USEREMAIL(), "Karyawan", "Email", "Nama")', formula: '-', note: 'Otomatis mendeteksi nama staf dari akun Google login' },
    { kolom: 'Nama_Partner_Shift', type: 'Ref / Text', key: false, label: false, initial: '-', formula: '-', note: 'Valid_If: FILTER("Karyawan", AND([Cabang] = [_THISROW].[Cabang], [Nama] <> [_THISROW].[Nama_Kasir]))' },
    { kolom: 'Jam_Mulai', type: 'Time', key: false, label: false, initial: 'TIMENOW()', formula: '-', note: 'Jam mulai opname' },
    { kolom: 'Jam_Selesai', type: 'Time', key: false, label: false, initial: '-', formula: 'IF([Status]="Selesai", TIMENOW(), "")', note: 'Otomatis terisi saat status berubah Selesai' },
    { kolom: 'Status', type: 'Enum', key: false, label: false, initial: '"Draft"', formula: '-', note: 'Draft / Selesai' },
    { kolom: 'Total_Selisih_Rp', type: 'Price', key: false, label: false, initial: '-', formula: 'SUM(Opname_Detail[Nilai_Selisih_Rp])', note: 'Dihitung otomatis dari relasi detail' },
    { kolom: 'Tanda_Tangan_Kasir', type: 'Signature', key: false, label: false, initial: '-', formula: '-', note: 'Digital signature kasir' },
    { kolom: 'Tanda_Tangan_Partner', type: 'Signature', key: false, label: false, initial: '-', formula: '-', note: 'Digital signature partner shift' },
    { kolom: 'Ringkasan_AI', type: 'LongText', key: false, label: false, initial: '""', formula: '-', note: 'Catatan ringkasan temuan AI' }
  ],
  Opname_Detail: [
    { kolom: 'ID_Detail', type: 'Text', key: true, label: false, initial: 'UNIQUEID()', formula: '-', note: 'Key item detail' },
    { kolom: 'ID_Opname', type: 'Ref', key: false, label: false, initial: '-', formula: '-', note: 'Relasi ke Opname_Header (IsPartOf = TRUE)' },
    { kolom: 'ID_Barang', type: 'Ref', key: false, label: true, initial: '-', formula: '-', note: 'Relasi ke Master_Barang' },
    { kolom: 'Stok_Sistem', type: 'Decimal', key: false, label: false, initial: '[ID_Barang].[Stok_Sistem_Sample]', formula: '-', note: 'Stok buku/sistem' },
    { kolom: 'Stok_Fisik', type: 'Decimal', key: false, label: false, initial: '0', formula: '-', note: 'Diinput kasir/partner' },
    { kolom: 'Selisih', type: 'Decimal', key: false, label: false, initial: '-', formula: '[Stok_Fisik] - [Stok_Sistem]', note: 'Otomatis: Fisik - Sistem' },
    { kolom: 'Nilai_Selisih_Rp', type: 'Price', key: false, label: false, initial: '-', formula: '[Selisih] * [ID_Barang].[Harga_Satuan]', note: 'Otomatis: Selisih * Harga' },
    { kolom: 'Catatan', type: 'Text', key: false, label: false, initial: '""', formula: '-', note: 'Wajib jika ABS([Selisih]) > Ambang_Batas' },
    { kolom: 'Flag_AI', type: 'Text', key: false, label: false, initial: '"Normal"', formula: '-', note: 'Anomali / Normal / Restock Warning' }
  ]
};

export const APPSHEET_EXPRESSIONS = [
  {
    tujuan: 'Selisih Unit (Opname_Detail)',
    rumus: '[Stok_Fisik] - [Stok_Sistem]',
    penjelasan: 'Jika bernilai negatif artinya barang hilang/kurang; jika positif artinya barang berlebih fisik.'
  },
  {
    tujuan: 'Nilai Selisih Rupiah (Opname_Detail)',
    rumus: '[Selisih] * [ID_Barang].[Harga_Satuan]',
    penjelasan: 'Mengambil harga satuan dari tabel Master_Barang melalui dereference [ID_Barang].[Harga_Satuan].'
  },
  {
    tujuan: 'Total Selisih Rupiah (Opname_Header)',
    rumus: 'SUM(SELECT(Opname_Detail[Nilai_Selisih_Rp], [ID_Opname] = [_THISROW].[ID_Opname]))',
    penjelasan: 'Menjumlahkan semua Nilai_Selisih_Rp milik ID_Opname ini.'
  },
  {
    tujuan: 'Tanggal Otomatis (Initial Value)',
    rumus: 'TODAY()',
    penjelasan: 'Merekam tanggal kalender sistem saat form pertama kali dibuat.'
  },
  {
    tujuan: 'Nama Kasir Otomatis dari Akun Google Login (Initial Value)',
    rumus: 'ANY(SELECT(Karyawan[Nama], [Email] = USEREMAIL()))',
    penjelasan: 'Mencari baris karyawan yang email-nya cocok dengan USEREMAIL() login AppSheet.'
  },
  {
    tujuan: 'Dropdown Partner Shift (Valid_If)',
    rumus: 'FILTER("Karyawan", AND([Cabang] = [_THISROW].[Cabang], [Nama] <> [_THISROW].[Nama_Kasir], [Role] = "Partner"))',
    penjelasan: 'Hanya menampilkan karyawan satu cabang, berstatus Partner, dan nama TIDAK boleh sama dengan Kasir login.'
  },
  {
    tujuan: 'Validasi Catatan Wajib Jika Selisih Melampaui Batas (Valid_If di Kolom Catatan)',
    rumus: 'IF(ABS([Selisih]) >= 5, ISNOTBLANK([_THIS]), TRUE)',
    penjelasan: 'Jika selisih absolut >= 5 (atau nilai Rp tertentu), kasir wajib mengetik alasan selisih sebelum bisa save.'
  },
  {
    tujuan: 'Kunci Edit Jika Status Selesai (Editable_If di Form Header & Detail)',
    rumus: '[Status] <> "Selesai"',
    penjelasan: 'Mencegah manipulasi data: jika laporan sudah disahkan dan berstatus Selesai, form terkunci read-only.'
  }
];

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * Google Apps Script - Webhook Otomatisasi Stok Opname F&B Samata
 * Menerima trigger dari AppSheet Automation / Bot saat status Opname_Header menjadi "Selesai"
 * Menghasilkan PDF resmi dan mengirimkan notifikasi Email & WhatsApp Gateway
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const opnameId = data.ID_Opname;
    const tanggal = data.Tanggal;
    const kasir = data.Nama_Kasir;
    const partner = data.Nama_Partner_Shift;
    const totalSelisihRp = data.Total_Selisih_Rp;
    const cabang = data.Cabang || "Samata";
    
    // 1. Buat Draft PDF / Ambil File PDF yang digenerate AppSheet
    const emailTujuan = "manager.samata@restofnb.com, owner@restofnb.com";
    const subject = \`[LAPORAN OPNAME RESMI] Cabang \${cabang} - \${tanggal} (\${kasir} & \${partner})\`;
    
    const bodyHtml = \`
      <div style="font-family: Arial, sans-serif; max-width: 600px; color: #1e293b;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          Laporan Stok Opname Selesai - Cabang \${cabang}
        </h2>
        <p>Halo Tim Manajemen,</p>
        <p>Stok opname bahan baku telah diselesaikan dengan rincian sebagai berikut:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 6px; font-weight: bold; width: 140px;">No. Dokumen:</td><td>\${opnameId}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Tanggal:</td><td>\${tanggal}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Kasir Bertugas:</td><td>\${kasir}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Partner Shift:</td><td>\${partner}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Total Selisih Rp:</td><td style="color: \${totalSelisihRp < 0 ? '#dc2626' : '#16a34a'}; font-weight: bold;">Rp \${Number(totalSelisihRp).toLocaleString('id-ID')}</td></tr>
        </table>
        <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px; margin: 16px 0;">
          <strong>Ringkasan AI:</strong>
          <p style="margin: 4px 0 0 0; font-size: 13px;">\${data.Ringkasan_AI || "Tidak ada anomali kritis terdeteksi."}</p>
        </div>
        <p>Laporan PDF resmi dengan tanda tangan digital kedua staf terlampir pada dokumen ini.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <small style="color: #64748b;">Sistem Inventori SCM Samata • Powered by Google AppSheet & Gemini AI</small>
      </div>
    \`;

    // Kirim Email Resmi
    MailApp.sendEmail({
      to: emailTujuan,
      subject: subject,
      htmlBody: bodyHtml
    });

    // 2. Integrasi WhatsApp (Opsional via WA Gateway API seperti Fonnte / Wablas)
    // kirimNotifikasiWA(cabang, tanggal, kasir, partner, totalSelisihRp);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Notifikasi terkirim" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;

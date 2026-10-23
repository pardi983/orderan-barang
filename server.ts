import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_EXACT_OPNAME_ITEMS } from './src/data/rawAndCleanData.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '15mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Master item mini lookup for AI context
const masterLookupContext = INITIAL_EXACT_OPNAME_ITEMS.map(item => ({
  id: item.id_barang,
  name: item.nama_item,
  isi_per_pack: item.isi_per_pack,
}));

// 1. AI Voice Parse Endpoint
app.post('/api/ai/voice-parse', async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ error: 'Field transcript diperlukan' });
    }

    const systemInstruction = `Kamu adalah asisten inventori pintar untuk restoran F&B Seblak & Baso Aci Cabang Samata.
Tugasmu adalah membedah kalimat input suara kasir (contoh: "bakso ikan 45, boci keju 30, telur 3 rak, enoki 2 dus, teh 5 pack") dan mencocokkannya ke Daftar Master Barang resmi.
Perhatikan aturan konversi:
- Jika kasir menyebut "telur 3 rak", 1 rak = 30 butir/pcs -> total 90 pcs.
- Jika kasir menyebut "enoki 2 dus", 1 dus = 150 pcs -> total 300 pcs.
- Jika nama item ambigu (misalnya hanya menyebut "cikur" padahal ada "Pilus Cikur Renyah"), masukkan ke daftar ambigu beserta kandidatnya agar kasir bisa konfirmasi.
Daftar Master Barang:
${JSON.stringify(masterLookupContext, null, 2)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Bongkar kalimat suara opname berikut: "${transcript}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matched: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id_barang: { type: Type.STRING },
                  nama_item: { type: Type.STRING },
                  jumlah_input: { type: Type.NUMBER },
                  satuan_input: { type: Type.STRING },
                  jumlah_final_standar: { type: Type.NUMBER },
                  satuan_standar: { type: Type.STRING },
                  catatan_konversi: { type: Type.STRING },
                },
                required: ['id_barang', 'nama_item', 'jumlah_final_standar', 'satuan_standar'],
              },
            },
            ambiguous: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  input_term: { type: Type.STRING },
                  suggested_ids: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  alasan: { type: Type.STRING },
                },
                required: ['input_term', 'suggested_ids', 'alasan'],
              },
            },
            unrecognized: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['matched', 'ambiguous'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in voice-parse:', error);
    return res.status(500).json({ error: error.message || 'Gagal memproses suara AI' });
  }
});

// 2. AI OCR Endpoint (Handwritten or Paper Notes)
app.post('/api/ai/ocr-parse', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Base64 image diperlukan' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || 'image/jpeg',
            },
          },
          {
            text: `Periksa foto catatan stok opname kertas / tulisan tangan ini.
Ekstrak nama barang dan angka hitungan fisik yang tertulis.
Cocokkan nama barang ke Master Barang Cabang Samata berikut:
${JSON.stringify(masterLookupContext, null, 2)}
Kembalikan JSON terstruktur.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extracted_items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  raw_text: { type: Type.STRING },
                  matched_id: { type: Type.STRING },
                  matched_name: { type: Type.STRING },
                  stok_fisik: { type: Type.NUMBER },
                  confidence: { type: Type.STRING },
                  catatan: { type: Type.STRING },
                },
                required: ['raw_text', 'stok_fisik'],
              },
            },
            catatan_pembacaan: { type: Type.STRING },
          },
          required: ['extracted_items'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in ocr-parse:', error);
    return res.status(500).json({ error: error.message || 'Gagal membaca gambar dengan AI' });
  }
});

// 3. AI Anomaly & Summary Endpoint
app.post('/api/ai/analyze-opname', async (req, res) => {
  try {
    const { opnameData } = req.body;
    if (!opnameData || !Array.isArray(opnameData.items)) {
      return res.status(400).json({ error: 'Data opname tidak valid' });
    }

    const prompt = `Analisis hasil stok opname Cabang Samata berikut ini:
Kasir: ${opnameData.kasir}
Partner: ${opnameData.partner}
Tanggal: ${opnameData.tanggal}
Item dengan selisih atau stok tipis:
${JSON.stringify(opnameData.items, null, 2)}

Tugasmu:
1. Deteksi Anomali: cari item dengan selisih fisik vs sistem yang tidak wajar (misal minus sangat tinggi, atau fisik 3x lipat sistem yang mungkin salah ketik koma/digit nol).
2. Item Kritis Butuh Restock: daftar item yang stok fisiknya di bawah Stok_Min.
3. Rekomendasi Pemesanan Ulang (Auto Order) beserta perkiraan belanja.
4. Buat Paragraf Ringkasan Eksekutif resmi untuk dicantumkan di Laporan PDF.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ringkasan_eksekutif: { type: Type.STRING },
            anomali_terdeteksi: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id_barang: { type: Type.STRING },
                  nama_item: { type: Type.STRING },
                  selisih: { type: Type.NUMBER },
                  nilai_selisih_rp: { type: Type.NUMBER },
                  tingkat_bahaya: { type: Type.STRING },
                  alasan_anomali: { type: Type.STRING },
                  pertanyaan_kasir: { type: Type.STRING },
                },
                required: ['id_barang', 'nama_item', 'tingkat_bahaya', 'alasan_anomali'],
              },
            },
            rekomendasi_restock: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id_barang: { type: Type.STRING },
                  nama_item: { type: Type.STRING },
                  stok_sekarang: { type: Type.NUMBER },
                  stok_min: { type: Type.NUMBER },
                  order_qty: { type: Type.NUMBER },
                  estimasi_rupiah: { type: Type.NUMBER },
                  urgensi: { type: Type.STRING },
                },
                required: ['id_barang', 'nama_item', 'order_qty', 'urgensi'],
              },
            },
            total_estimasi_restock_rp: { type: Type.NUMBER },
            catatan_manajemen: { type: Type.STRING },
          },
          required: ['ringkasan_eksekutif', 'anomali_terdeteksi', 'rekomendasi_restock'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in analyze-opname:', error);
    return res.status(500).json({ error: error.message || 'Gagal menganalisis opname dengan AI' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server SCM Samata running on http://localhost:${PORT}`);
  });
}

startServer();

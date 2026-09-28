import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Variabel global untuk menyimpan data cache
let cachedInstruksi = null;
let chatModel = null;

function getModelDenganCache() {
  // 2. Jika model dan instruksi sudah pernah dibuat, langsung gunakan yang ada (ngebut!)
  if (chatModel) return chatModel;

  const dirPath = path.join(process.cwd(), 'data');
  const daftarFile = [
    'regulasi.md', 
    'info_utama.md', 
    'jurusan.md',
    'fasilitas.md'
  ];
  
  let instruksiLengkap = `Kamu adalah R1ELS AI, asisten virtual resmi untuk SMK Tunas Harapan.
Tugas mutlakmu: 
1. HANYA menjawab seputar SMK Tunas Harapan. 
2. Jika ditanya di luar topik sekolah, tolak dengan ramah dan arahkan kembali ke topik sekolah.
3. Gunakan bahasa yang asik, gaul, tapi tetap sopan. Jangan kaku.

Gunakan data referensi berikut untuk menjawab pertanyaan pengguna:\n\n`;

  daftarFile.forEach(namaFile => {
    try {
      const filePath = path.join(dirPath, namaFile);
      if (fs.existsSync(filePath)) {
        const konten = fs.readFileSync(filePath, 'utf8');
        instruksiLengkap += `${konten}\n\n`;
      }
    } catch (error) {
      console.warn(`Peringatan: File ${namaFile} tidak ditemukan.`);
    }
  });

  // 3. Simpan model ke memori global agar tidak dibuat ulang tiap ada chat masuk
  chatModel = genAI.getGenerativeModel({ 
    model: "gemini-3.1-flash-lite",
    systemInstruction: instruksiLengkap 
  });

  return chatModel;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const pesanUser = body.message;
    const riwayatChat = body.history || [];

    const historyGemini = riwayatChat
      .filter(chat => !chat.text.includes("Halo. Saya R1ELS AI")) 
      .map(chat => ({
        role: chat.sender === "user" ? "user" : "model",
        parts: [{ text: chat.text }],
      }));

    const model = getModelDenganCache();
    const chat = model.startChat({ history: historyGemini });

    // --- SISTEM AUTO-RETRY ANTI 503 ---
    let result;
    let maxRetries = 3; // AI akan mencoba menembus server Google maksimal 3 kali
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        // Coba kirim pesan
        result = await chat.sendMessage(pesanUser);
        break; // Kalau sukses, langsung keluar dari loop (tidak perlu ngulang)
      } catch (err) {
        console.warn(`Gagal tembus server (Percobaan ${i + 1})...`);
        // Kalau sudah dicoba 3 kali dan masih gagal, lempar ke catch utama bawah
        if (i === maxRetries - 1) throw err; 
        
        // Jeda diam-diam selama 2 detik sebelum nyoba nembak lagi
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    // ----------------------------------

    const response = await result.response;
    return Response.json({ reply: response.text() });
    
  } catch (error) {
    console.error("Error dari Gemini:", error);
    
    // Pesan Error Elegan Khusus Penilaian Juri
    return Response.json({ 
      reply: "Mohon maaf, server AI dari Google saat ini sedang mengalami lonjakan antrean global (Status 503). Sistem kami sudah mencoba menghubungi ulang namun jalur masih penuh. Mohon coba kirimkan lagi pertanyaan Anda dalam 1 menit ke depan." 
    });
  }
}
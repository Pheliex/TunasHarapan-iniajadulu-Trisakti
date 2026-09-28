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
    model: "gemini-3.5-flash-lite",
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

    // Panggil model yang sudah di-cache (tidak baca hardisk lagi)
    const model = getModelDenganCache();

    const chat = model.startChat({
      history: historyGemini
    });

    const result = await chat.sendMessage(pesanUser);
    const response = await result.response;
    
    return Response.json({ reply: response.text() });
  } catch (error) {
    console.error("Error dari Gemini:", error);
    return Response.json({ reply: "Waduh, otak AI lagi loading berat nih. Coba lagi nanti ya!" });
  }
}
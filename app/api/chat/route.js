import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Narik API Key dari .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fungsi pembaca Markdown (sama persis logikanya dengan Python kemarin)
function bacaDataSekolah() {
  const regulasiPath = path.join(process.cwd(), 'data', 'regulasi.md');
  const infoPath = path.join(process.cwd(), 'data', 'info_sekolah.md');
  
  let regulasi = "";
  let info = "";

  try {
    regulasi = fs.readFileSync(regulasiPath, 'utf8');
    info = fs.readFileSync(infoPath, 'utf8');
  } catch (error) {
    console.error("Gagal membaca file data:", error);
  }
  
  return `\({regulasi}\n\nBerikut adalah data referensi sekolah yang bisa kamu gunakan untuk menjawab:\n\){info}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const pesanUser = body.message;

    // Menggunakan model flash-lite pilihanmu yang ngebut dan hemat token
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash-lite",
      systemInstruction: bacaDataSekolah() 
    });

    const result = await model.generateContent(pesanUser);
    const response = await result.response;
    
    return Response.json({ reply: response.text() });
  } catch (error) {
    console.error("Error dari Gemini:", error);
    return Response.json({ error: "Waduh, koneksi ke otak AI terputus." }, { status: 500 });
  }
}
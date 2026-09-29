import Groq from "groq-sdk";
import fs from "fs";
import path from "path";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// PAKAI LLAMA 3.1 8B: Jauh lebih kenceng, hemat limit, dan jago roleplay tsundere!
const MODEL = "qwen/qwen3.8-27b";
const MAX_HISTORY = 6;
const HISTORY_CHAR_LIMIT = 500;
const MAX_INPUT_LENGTH = 1000;

// ---------- KNOWLEDGE BASE ----------
let knowledgeCache = null;
let aturanCache = null; // Cache khusus untuk sifat & aturan tsundere

const KNOWLEDGE_FILES = {
  utama: ["data_utama.md"], // aturan_chatbot.md dipisah dari sini
  jurusan: ["jurusan.md"],
  pplg: ["pplg.md"],
  tjkt: ["tjkt.md"],
  dkv: ["dkv.md"],
  tkr: ["tkr.md"],
  fasilitas: ["fasilitas.md"],
  ppdb: ["ppdb.md"],
  sekolah: ["visi_misi.md", "sejarah.md"],
  karier: ["bk_dan_karier.md"],
};

function bacaFile(nama) {
  const p = path.join(process.cwd(), "data", nama);
  try {
    return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
  } catch {
    return "";
  }
}

// Load khusus file aturan chatbot (Tsundere)
function loadAturan() {
  if (aturanCache) return aturanCache;
  aturanCache = bacaFile("aturan_chatbot.md");
  return aturanCache;
}

function loadKnowledge() {
  if (knowledgeCache) return knowledgeCache;
  const result = {};
  for (const [k, files] of Object.entries(KNOWLEDGE_FILES)) {
    result[k] = files.map(bacaFile).filter(Boolean).join("\n\n");
  }
  knowledgeCache = result;
  return result;
}

function pilihKnowledge(pesan) {
  const data = loadKnowledge();
  const t = pesan.toLowerCase();
  const hasil = [data.utama];
  
  if (/jurusan|pplg|rpl|coding|software|game/.test(t)) hasil.push(data.jurusan, data.pplg);
  if (/tjkt|tkj|jaringan|mikrotik|cisco/.test(t)) hasil.push(data.jurusan, data.tjkt);
  if (/dkv|desain|visual|multimedia/.test(t)) hasil.push(data.jurusan, data.dkv);
  if (/tkr|otomotif|mobil|bengkel/.test(t)) hasil.push(data.jurusan, data.tkr);
  if (/ppdb|spmb|daftar|pendaftaran|syarat/.test(t)) hasil.push(data.ppdb);
  if (/fasilitas|asrama|tefa|lab/.test(t)) hasil.push(data.fasilitas);
  if (/sejarah|visi|misi/.test(t)) hasil.push(data.sekolah);
  if (/kerja|karier|kuliah|beasiswa|cv/.test(t)) hasil.push(data.karier);
  
  return [...new Set(hasil)].filter(Boolean).join("\n\n");
}

function buatSystemPrompt(knowledge, aturan) {
  // Aturan Tsundere ditaruh PALING ATAS biar AI nggak lupa perannya
  return `Kamu adalah R1ELS AI, asisten virtual SMK Telekomunikasi Tunas Harapan.

=== ATURAN KARAKTER & GAYA BAHASA (WAJIB DIIKUTI) ===
${aturan}

=== ATURAN SISTEM ===
1. Jawab LANGSUNG ke inti pertanyaan. Jangan sapa ulang kalau di history sudah menyapa.
2. HANYA gunakan Markdown (**bold**, *italic*). DILARANG menggunakan HTML.
3. JANGAN PERNAH mengarang info (alamat, nomor telepon, biaya, dll). Kalau info tidak ada di knowledge base, bilang dengan gaya tsundere-mu kalau kamu belum dikasih tahu info itu.
4. Jurusan yang ada HANYA: PPLG, TJKT, DKV, TKR.

=== KNOWLEDGE BASE (INFO SEKOLAH) ===
${knowledge}
=== AKHIR KNOWLEDGE BASE ===`;
}

function buatHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .slice(-MAX_HISTORY)
    .filter(c => c && typeof c.text === "string" && c.text.trim())
    .map(c => ({
      role: c.sender === "user" ? "user" : "assistant",
      content: c.text.slice(0, HISTORY_CHAR_LIMIT)
    }));
}

// ---------- API ROUTE ----------
export async function POST(req) {
  try {
    const body = await req.json();
    const pesanUser = typeof body?.message === "string" ? body.message.trim() : "";
    
    if (!pesanUser) return Response.json({ reply: "Hmph, ngetik yang bener dong! Tulis pertanyaannya!" }, { status: 400 });
    if (pesanUser.length > MAX_INPUT_LENGTH) return Response.json({ reply: "Bawel banget sih, pertanyaannya kepanjangan! Ringkas dikit bisa nggak?" }, { status: 400 });

    const aturan = loadAturan();
    const knowledge = pilihKnowledge(pesanUser);
    const systemPrompt = buatSystemPrompt(knowledge, aturan);
    const history = buatHistory(body.history);

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: pesanUser }
      ],
      // Temperature dinaikkan sedikit (0.6) biar gaya tsundere-nya lebih luwes dan natural, nggak kaku kayak robot
      temperature: 0.6, 
      max_tokens: 800,
      top_p: 0.9,
    });

    const jawaban = completion.choices[0]?.message?.content || "Lagi males jawab nih. Coba tanya lagi nanti.";
    return Response.json({ reply: jawaban });

  } catch (error) {
    console.error("[R1ELS GROQ ERROR]", error);
    if (error?.status === 429) {
      return Response.json({ reply: "Ugh, yang nanya lagi antre banyak banget! Sabar dikit kenapa sih, tunggu 10 detik lagi!" }, { status: 429 });
    }
    return Response.json({ reply: "Lagi pusing nih servernya, coba lagi nanti ya! Jangan bawel!" }, { status: 500 });
  }
}
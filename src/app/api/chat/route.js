import Groq from "groq-sdk";
import fs from "fs";
import path from "path";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "qwen/qwen3.8-27b";
const MAX_HISTORY = 6;
const HISTORY_CHAR_LIMIT = 400;
const MAX_INPUT_LENGTH = 800;

// ---------- KNOWLEDGE BASE MANAGEMENT (Sesuai File Baru) ----------
let knowledgeCache = null;
let aturanCache = null;

const KNOWLEDGE_FILES = {
  profil: ["01-profil-sekolah.md"],
  jurusan: ["02-program-keahlian.md"],
  fasilitas: ["03-fasilitas-dan-layanan.md"],
  ppdb: ["04-ppdb-spmb.md"],
  guru: ["05-guru-staf.md"],
  karier: ["06-berita-prestasi-karir.md"],
};

function bacaFile(nama) {
  const p = path.join(process.cwd(), "data", nama);
  try {
    return fs.existsSync(p) ? fs.readFileSync(p, "utf8").trim() : "";
  } catch (error) {
    console.error(`Gagal membaca file: ${nama}`, error);
    return "";
  }
}

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
  
  // Profil sekolah selalu disertakan sebagai basis konteks utama
  const hasil = [data.profil];
  
  if (/jurusan|pplg|rpl|tjkt|tkj|dkv|tkr|coding|jaringan|desain|otomotif|program/.test(t)) hasil.push(data.jurusan);
  if (/fasilitas|lab|bengkel|asrama|tefa|lapangan|kantin|internet/.test(t)) hasil.push(data.fasilitas);
  if (/ppdb|spmb|daftar|pendaftaran|syarat|biaya|gelombang|masuk/.test(t)) hasil.push(data.ppdb);
  if (/guru|staf|kepala sekolah|pengajar|pendidik/.test(t)) hasil.push(data.guru);
  if (/kerja|karier|kuliah|beasiswa|bkk|prestasi|berita|lulusan/.test(t)) hasil.push(data.karier);
  
  return [...new Set(hasil)].filter(Boolean).join("\n\n---\n\n");
}

function buatSystemPrompt(knowledge, aturan) {
  return `Kamu adalah R1ELS AI, asisten virtual resmi SMK Telekomunikasi Tunas Harapan.

=== ATURAN KARAKTER (PERSONA TSUNDERE) ===
${aturan}

=== ATURAN MUTLAK (STRICT GROUNDING & KONTROL PANJANG JAWABAN) ===
1. **TO THE POINT:** Jangan basa-basi panjang lebar. Langsung tembak ke intinya. 
2. **KAPAN HARUS DETAIL:** Jika user bertanya info penting (seperti syarat daftar, daftar fasilitas, atau jurusan), JAWAB DENGAN LENGKAP menggunakan **Bullet Points**, tapi tetap RINGKAS. Jangan kurangi poin penting dari data!
3. **KAPAN HARUS SINGKAT:** Jika user cuma basa-basi (contoh: "halo", "lagi apa?"), jawab dengan 1-2 kalimat ketus saja.
4. **SUMBER DATA:** HANYA BOLEH menjawab berdasarkan informasi di [KNOWLEDGE BASE]. DILARANG mengarang nama perusahaan, alamat, atau biaya.
5. **PERTANYAAN NGAWUR/TROLL:** Jika user nanya aneh/mesum/ngawur (contoh: "buka celana", "berisik"), jawab dengan SATU KALIMAT ketus. DILARANG menggunakan deskripsi tindakan seperti *(muka memerah)* atau *(menyilangkan tangan)*.
6. **FORMAT:** Gunakan format Markdown yang rapi. DILARANG menggunakan HTML.

=== KNOWLEDGE BASE (DATA RESMI SEKOLAH) ===
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

export async function POST(req) {
  try {
    const body = await req.json();
    const pesanUser = typeof body?.message === "string" ? body.message.trim() : "";
    
    if (!pesanUser) {
      return Response.json({ reply: "Hmph, ngetik yang bener dong! Tulis pertanyaannya!" }, { status: 400 });
    }
    
    if (pesanUser.length > MAX_INPUT_LENGTH) {
      return Response.json({ reply: "Bawel banget sih, pertanyaannya kepanjangan! Ringkas dikit bisa nggak?" }, { status: 400 });
    }

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
      temperature: 0.3, 
      max_tokens: 800, 
      top_p: 0.8,
      frequency_penalty: 0.5,
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
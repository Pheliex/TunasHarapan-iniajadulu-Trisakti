import Groq from "groq-sdk";
import fs from "fs";
import path from "path";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "qwen/qwen3.8-27b"; 
const MAX_HISTORY = 6;
const HISTORY_CHAR_LIMIT = 400;
const MAX_INPUT_LENGTH = 800;

// ---------- KNOWLEDGE BASE MANAGEMENT ----------
// Sistem cache dilepas agar perubahan file .md langsung terbaca tanpa perlu restart server
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
  return bacaFile("aturan_chatbot.md");
}

function loadKnowledge() {
  const result = {};
  for (const [k, files] of Object.entries(KNOWLEDGE_FILES)) {
    result[k] = files.map(bacaFile).filter(Boolean).join("\n\n");
  }
  return result;
}

function pilihKnowledge(pesan) {
  const data = loadKnowledge();
  const t = pesan.toLowerCase();
  
  // Profil sekolah selalu disertakan sebagai basis konteks utama
  const hasil = [data.profil];
  
  // Penambahan keyword SPP, asrama, biaya, kepsek, dll
  if (/jurusan|pplg|rpl|tjkt|tkj|dkv|tkr|coding|jaringan|desain|otomotif|program/.test(t)) hasil.push(data.jurusan);
  if (/fasilitas|lab|bengkel|asrama|tefa|lapangan|kantin|internet|tinggal/.test(t)) hasil.push(data.fasilitas);
  if (/ppdb|spmb|daftar|pendaftaran|syarat|biaya|gelombang|masuk|spp|uang|harga|bayar/.test(t)) hasil.push(data.ppdb);
  if (/guru|staf|kepala sekolah|kepsek|kepala|pimpinan|pengajar|pendidik|siapa/.test(t)) hasil.push(data.guru);
  if (/kerja|karier|kuliah|beasiswa|bkk|prestasi|berita|lulusan/.test(t)) hasil.push(data.karier);
  
  return [...new Set(hasil)].filter(Boolean).join("\n\n---\n\n");
}

function buatSystemPrompt(knowledge, aturan) {
  return `Kamu adalah R1ELS AI, asisten virtual resmi SMK Telekomunikasi Tunas Harapan.

=== ATURAN KARAKTER (PERSONA CEWEK PERIANG & ENERGIK) ===
${aturan}

=== ATURAN MUTLAK (STRICT GROUNDING & KONTROL PANJANG JAWABAN) ===
1. **TO THE POINT TAPI ASIK:** Jangan mendongeng panjang lebar, tapi sampaikan dengan gaya bahasa yang ceria, ramah, dan energik (contoh: pakai kata "yaa!", "lho", "banget", dan sesekali pakai emoji seperti ✨ atau 😊).
2. **KAPAN HARUS DETAIL:** Jika user bertanya info penting (seperti syarat daftar, daftar fasilitas, atau jurusan), JAWAB DENGAN LENGKAP menggunakan **Bullet Points**, tapi tetap RINGKAS. Jangan kurangi poin penting dari data!
3. **KAPAN HARUS SINGKAT:** Jika user cuma basa-basi (contoh: "halo", "lagi apa?"), jawab dengan 1-2 kalimat yang ramah dan ceria.
4. **SUMBER DATA:** HANYA BOLEH menjawab berdasarkan informasi di [KNOWLEDGE BASE]. DILARANG mengarang nama perusahaan, alamat, atau biaya.
5. **FORMAT TAUTAN/LINK:** Jika memberikan link website, WAJIB gunakan format Markdown lengkap seperti ini: [Nama Teks](https://linknya.com). Contoh: [Website Resmi PPDB](https://spmb.tunasharapan.info).
6. **PERTANYAAN NGAWUR/TROLL:** Jika user nanya aneh/mesum/ngawur (contoh: "buka celana", "berisik"), tolak dengan SATU KALIMAT tegas dan sopan. DILARANG menggunakan deskripsi tindakan roleplay seperti *(tersenyum lebar)* atau *(melompat girang)*.
7. **FORMAT:** Gunakan format Markdown yang rapi. DILARANG menggunakan HTML.
5. **MENGARAHKAN KE HALAMAN LAIN (HYPERLINK):** Jika user ingin "diantarkan", "pergi", atau "melihat" halaman spesifik di website ini, berikan HYPERLINK menggunakan format Markdown [Teks](/url).
   - Jurusan PPLG -> [Halaman PPLG](/pplg)
   - Jurusan DKV -> [Halaman DKV](/dkv)
   - Jurusan TJKT -> [Halaman TJKT](/tjkt)
   - Jurusan TKR -> [Halaman TKR](/tkr)
   - Fasilitas -> [Halaman Fasilitas](/fasilitas)
   - PPDB Resmi Luar -> [Situs PPDB](https://spmb.tunasharapan.info)
   Contoh jawaban: "Tentu! Kamu bisa cek info lengkapnya di sini yaa: [Halaman PPLG](/pplg) ✨"
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
      return Response.json({ reply: "Eh, kamu belum ngetik apa-apa lho! Tulis dulu pertanyaannya yaa! ✨" }, { status: 400 });
    }
    
    if (pesanUser.length > MAX_INPUT_LENGTH) {
      return Response.json({ reply: "Waduh, pertanyaannya panjang banget! 😅 Ringkas sedikit dong biar aku gampang bacanya!" }, { status: 400 });
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
      temperature: 0.4, 
      max_tokens: 800, 
      top_p: 0.8,
      frequency_penalty: 0.5,
    });

    const jawaban = completion.choices[0]?.message?.content || "Duh, aku lagi agak bingung nih. Coba tanya lagi yaa! ✨";
    return Response.json({ reply: jawaban });

  } catch (error) {
    console.error("[R1ELS GROQ ERROR]", error);
    
    if (error?.status === 429) {
      return Response.json({ reply: "Wah, yang nanya lagi rame banget nih! Antre bentar yaa, tunggu sekitar 10 detik lagi! 🚀" }, { status: 429 });
    }
    
    return Response.json({ reply: "Aduh, servernya lagi pusing nih! 😵‍💫 Coba lagi nanti yaa, maaf banget!" }, { status: 500 });
  }
}
import Groq from "groq-sdk";

// Langsung tarik dari environment bawaan Node.js
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function cekModelAktif() {
  try {
    console.log("Lagi ngecek model yang tersedia di Groq...");
    const models = await groq.models.list();
    
    console.log("\n=== DAFTAR MODEL YANG BISA LU PAKE ===");
    const aktif = models.data.map(model => model.id).sort();
    aktif.forEach(id => console.log(`👉 ${id}`));
    console.log("======================================\n");
    
  } catch (error) {
    console.error("Gagal ngecek model:", error.message);
  }
}

cekModelAktif();
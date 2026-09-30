"use client";

/**
 * app/login/page.tsx
 * ---------------------------------------------------------------------------
 * Halaman login SMK Telekomunikasi Tunas Harapan (Next.js App Router).
 *
 * Halaman ini HANYA front-end. Semua logika database ada di:
 *   -> app/api/auth/login/route.ts  (server side)
 * Halaman ini cuma mengirim data ke endpoint tersebut lewat fetch().
 *
 * Yang perlu Anda siapkan
 *   2. Ubah LOGIN_ENDPOINT / DEFAULT_REDIRECT di bawah kalau route Anda berbeda.
 * ---------------------------------------------------------------------------
 */

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Instrument_Serif, Inter } from "next/font/google";
import styles from "./login.module.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

// ---- Konfigurasi yang mungkin perlu Anda ubah ------------------------------
const LOGIN_ENDPOINT = "/api/auth/login"; // endpoint back-end untuk login
const DEFAULT_REDIRECT = "/dashboard"; // tujuan setelah login berhasil
// ---------------------------------------------------------------------------

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState(""); // username / NIS / NIP / email
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Validasi ringan di sisi client (hanya untuk UX).
    // Validasi yang sebenarnya WAJIB diulang di server (route.ts).
    if (!identifier.trim() || !password) {
      setError("Isi username dan kata sandi terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      // -----------------------------------------------------------------
      // TODO (DATABASE): request ini diterima oleh app/api/auth/login/route.ts
      // Di sana Anda:
      //   1. cari user di database berdasarkan `identifier`
      //   2. bandingkan `password` dengan hash di database (bcrypt / argon2)
      //   3. kalau cocok, buat session/JWT dan simpan di cookie httpOnly
      //   4. balas { ok: true, redirectTo: "/dashboard" }
      // Kalau gagal, balas status 401 dengan { message: "..." }.
      // -----------------------------------------------------------------
      const res = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // supaya cookie session ikut tersimpan
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
          remember, // true = session lebih lama (mis. 30 hari)
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // `message` datang dari back-end, jadi Anda bebas mengubah teksnya di sana.
        setError(data.message ?? "Username atau kata sandi tidak cocok.");
        return;
      }

      // Login berhasil -> pindah halaman.
      // TODO (ROLE): kalau ada beberapa peran (siswa / guru / admin),
      // kirim `redirectTo` yang berbeda dari back-end.
      router.push(data.redirectTo ?? DEFAULT_REDIRECT);
      router.refresh(); // muat ulang data server component agar status login terbaca
    } catch {
      setError("Tidak dapat terhubung ke server. Coba lagi sebentar lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={`${styles.page} ${serif.variable} ${sans.variable}`}>
      {/* ---------- Navigasi atas ---------- */}
      <header className={styles.nav}>
        <Link href="/" className={styles.brand}>
          {/* Ganti file logo di /public sesuai kebutuhan */}
          <Image
            src="/images/school/logo-transparent.png"
            alt="logo"
            width={44}
            height={44}
            className={styles.logo}
            priority
          />
          <span>Tunas Harapan</span>
        </Link>
        <Link href="/" className={styles.back}>
          Kembali ke beranda
        </Link>
      </header>

      {/* ---------- Panel kiri (biru) ---------- */}
      <section className={styles.intro}>
        <h1 className={styles.headline}>
          Selamat datang
          <br />
          kembali.
        </h1>
        <p className={styles.lead}>
          Masuk untuk membuka ruang belajar, jadwal, dan informasi sekolah Anda.
        </p>
      </section>

      {/* ---------- Panel kanan (form) ---------- */}
      <section className={styles.stage}>
        <span className={styles.watermark} aria-hidden="true">
          SMK
        </span>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Masuk</h2>
          <p className={styles.cardHint}>Gunakan akun yang diberikan sekolah.</p>

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            {/* Pesan error dari client / back-end */}
            <div role="alert" aria-live="polite">
              {error && <p className={styles.error}>{error}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="identifier" className={styles.label}>
                Username atau NIS
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                className={styles.input}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Kata sandi
              </label>
              <div className={styles.passwordWrap}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`${styles.input} ${styles.inputWithButton}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className={styles.toggle}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                  }
                  aria-pressed={showPassword}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div className={styles.row}>
              <label className={styles.check}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                />
                <span>Ingat saya</span>
              </label>

              {/* TODO: buat halaman /lupa-password (kirim email / reset lewat admin) */}
              <Link href="/lupa-password" className={styles.forgot}>
                Lupa kata sandi?
              </Link>
            </div>

            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? "Memeriksa akun..." : "Masuk"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

/** Ikon mata untuk tombol tampilkan / sembunyikan kata sandi. */
function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <path d="M4 4l16 16" />}
    </svg>
  );
}

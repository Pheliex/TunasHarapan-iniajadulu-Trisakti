/**
 * app/api/auth/login/route.ts
 * ---------------------------------------------------------------------------
 * Endpoint back-end untuk login. Dipanggil oleh app/login/page.tsx lewat
 *   POST /api/auth/login   body: { identifier, password, remember }
 *
 * File ini masih KERANGKA. Bagian bertanda TODO adalah tempat Anda
 * menyambungkan database dan session.
 *
 * Kontrak respons yang diharapkan halaman login:
 *   sukses -> 200  { ok: true, redirectTo: "/dashboard" }
 *   gagal  -> 401  { ok: false, message: "Username atau kata sandi tidak cocok." }
 *   error  -> 400 / 429 / 500 dengan { ok: false, message: "..." }
 * ---------------------------------------------------------------------------
 */

import { NextResponse } from "next/server";
// TODO: import library yang Anda pakai, contoh:
// import bcrypt from "bcrypt";                 // cek hash kata sandi
// import { db } from "@/lib/db";               // koneksi database (Prisma / mysql2 / pg)
// import { createSession } from "@/lib/session"; // buat cookie session / JWT

export async function POST(request: Request) {
  // 1. Baca dan validasi body -----------------------------------------------
  let body: { identifier?: string; password?: string; remember?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Permintaan tidak valid." }, { status: 400 });
  }

  const identifier = body.identifier?.trim();
  const password = body.password;
  const remember = Boolean(body.remember);

  if (!identifier || !password) {
    return NextResponse.json(
      { ok: false, message: "Isi username dan kata sandi terlebih dahulu." },
      { status: 400 }
    );
  }

  // 2. (Disarankan) Batasi percobaan login ------------------------------------
  // TODO: rate limit per IP dan per identifier supaya tidak bisa ditebak terus-menerus.

  // 3. Cari user di database --------------------------------------------------
  // TODO: ganti dengan query Anda. Selalu pakai query berparameter, jangan
  // menyambung string langsung.
  //
  // Contoh (Prisma):
  //   const user = await db.user.findFirst({
  //     where: { OR: [{ username: identifier }, { nis: identifier }] },
  //   });
  //
  // Contoh (mysql2):
  //   const [rows] = await db.execute(
  //     "SELECT id, password_hash, role FROM users WHERE username = ? OR nis = ? LIMIT 1",
  //     [identifier, identifier]
  //   );
  //   const user = rows[0];
  const user = null as null | { id: string; passwordHash: string; role: string }; // TODO: hapus baris ini

  // 4. Cocokkan kata sandi ----------------------------------------------------
  // TODO: kata sandi di database harus berupa HASH (bcrypt / argon2), bukan teks asli.
  //   const valid = user && (await bcrypt.compare(password, user.passwordHash));
  const valid = false; // TODO: hapus baris ini

  // Pesan sengaja dibuat sama untuk "user tidak ada" dan "sandi salah"
  // agar orang luar tidak bisa mengetahui username mana yang terdaftar.
  if (!user || !valid) {
    return NextResponse.json(
      { ok: false, message: "Username atau kata sandi tidak cocok." },
      { status: 401 }
    );
  }

  // 5. Buat session -----------------------------------------------------------
  // TODO: simpan session di cookie httpOnly. Contoh dengan cookies():
  //   import { cookies } from "next/headers";
  //   const token = await createSession({ userId: user.id, role: user.role });
  //   cookies().set("session", token, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: "lax",
  //     path: "/",
  //     maxAge: remember ? 60 * 60 * 24 * 30 : undefined, // 30 hari, atau sampai browser ditutup
  //   });
  void remember; // hapus baris ini setelah `remember` dipakai di atas

  // 6. Balas ke front-end -----------------------------------------------------
  // TODO: arahkan sesuai peran, misalnya admin -> "/admin", guru -> "/guru", siswa -> "/dashboard".
  return NextResponse.json({ ok: true, redirectTo: "/dashboard" });
}

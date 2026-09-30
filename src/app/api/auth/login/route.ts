import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  // 1. Baca dan validasi input dari Front-End -------------------------------
  let body: { identifier?: string; password?: string; remember?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Permintaan tidak valid." }, { status: 400 });
  }

  const identifier = body.identifier?.trim();
  const password = body.password;
  // Catatan: Di Supabase modern, masa aktif session diatur di dashboard Supabase.
  // Tapi kita tetap simpan opsi ini jika ingin dikembangkan nanti.
  const remember = Boolean(body.remember);

  if (!identifier || !password) {
    return NextResponse.json(
      { ok: false, message: "Isi email/username dan kata sandi terlebih dahulu." },
      { status: 400 }
    );
  }

  // TRIK JIKA PAKAI NIS:
  // Jika 'identifier' adalah NIS (misal: 12345), ubah jadi email fiktif.
  // Jika identifier memang email, biarkan saja.
  const loginEmail = identifier.includes("@") ? identifier : `${identifier}@sekolah.local`;

  // 2. Setup Supabase Client untuk Server & Cookies -------------------------
  // Ini cara resmi Next.js + Supabase untuk membaca & menulis cookie session.
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Abaikan error jika dipanggil dari middleware
          }
        },
      },
    }
  );

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );



  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginEmail,
    password: password,
  });

  // Jika password salah atau user tidak ada, Supabase akan mengembalikan 'error'
  if (error) {
    // Kita samarkan pesannya agar hacker tidak tahu mana email yang terdaftar
    return NextResponse.json(
      { ok: false, message: "Username atau kata sandi tidak cocok." },
      { status: 401 }
    );
  }

  // 6. Cek Role (Peran) dan Arahkan (Redirect) ------------------------------
  // Asumsi: Anda punya tabel 'profiles' atau 'users' di Supabase Database biasa
  // yang menyimpan kolom 'role' (admin, guru, siswa) berdasarkan id user (UUID).

  let redirectTo = "/dashboard"; // Default arahkan ke dashboard siswa

  // Ambil data role dari database (Tabel public)
  const { data: userData } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (userData) {
    if (userData.role === "admin") {
      redirectTo = "/admin";
    } else if (userData.role === "guru") {
      redirectTo = "/guru";
    }
    // jika "siswa", tetap menggunakan default "/dashboard"
  }

  // Berhasil! Balas ke front-end
  return NextResponse.json({ ok: true, redirectTo: redirectTo });
}

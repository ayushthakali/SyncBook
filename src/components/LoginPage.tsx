"use client";

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function LoginPage() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bg4.jpg')] bg-cover bg-fixed bg-no-repeat bg-center relative overflow-hidden">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="bg-white/5 border border-white/10 rounded-3xl py-10 px-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/30 to-indigo-500/30 blur-md scale-110" />
              <div className="relative w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-xl shadow-black/30">
                <Image
                  src="/logo1.png"
                  width={36}
                  height={36}
                  alt="TrackBoard logo"
                  className="object-contain"
                />
              </div>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white mb-1.5">
              TaskBoard
            </h1>
            <p className="text-sm text-white/50 leading-relaxed text-center">
              Your real-time Kanban workspace.
              <br />
              Built for focus, designed to flow.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-white/50 tracking-widest uppercase">
              Sign in
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50
              active:bg-gray-100 py-3 px-6 rounded-xl font-semibold text-gray-800 text-sm
              transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-xl
              hover:shadow-black/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Image
              src="https://www.google.com/favicon.ico"
              width={16}
              height={16}
              alt="Google"
              className="w-4 h-4"
            />
            Continue with Google
          </button>

          {/* Footer note */}
          <p className="text-center text-[11px] text-white/25 mt-6 leading-relaxed">
            By continuing, you agree to our{" "}
            <span className="text-white/35 hover:text-white/55 cursor-pointer transition-colors underline underline-offset-2">
              Terms
            </span>
            {" & "}
            <span className="text-white/35 hover:text-white/55 cursor-pointer transition-colors underline underline-offset-2">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

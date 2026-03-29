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
    <div className="min-h-screen flex items-center justify-center bg-[url('/bg5.jpg')] bg-cover bg-fixed bg-no-repeat bg-center relative overflow-hidden">
      {/* Dark overlay for depth */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl py-10 px-8 shadow-2xl backdrop-blur-xl">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">
              SyncBook
            </h1>
            <p className="text-sm text-white/50 leading-relaxed">
              AI-powered workspace for your
              <br />
              most focused work yet.
            </p>
          </div>

          {/* Divider with label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30 tracking-widest uppercase">
              Sign in
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleLogin}
            className="w-full group flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:bg-gray-100 py-3 px-6 rounded-xl font-semibold text-gray-800 text-sm transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Image
              src="https://www.google.com/favicon.ico"
              width={18}
              height={18}
              className="w-[18px] h-[18px]"
              alt="Google"
            />
            Continue with Google
          </button>

          {/* Footer note */}
          <p className="text-center text-xs text-white/25 mt-6 leading-relaxed">
            By continuing, you agree to our
            <br />
            <span className="text-white/40 hover:text-white/60 cursor-pointer transition-colors">
              Terms
            </span>
            {" & "}
            <span className="text-white/40 hover:text-white/60 cursor-pointer transition-colors">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

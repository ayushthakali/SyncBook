"use client";

import { supabase } from "@/lib/supabaseClient";
import { useAppSelector } from "@/lib/hooks";
import { LogOut, User as UserIcon } from "lucide-react";
import Image from "next/image";

export default function UserNav() {
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 p-2  pl-4 rounded-3xl shadow-lg">
      <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/20 flex-shrink-0">
        {user.user_metadata.avatar_url ? (
          <Image
            src={user.user_metadata.avatar_url}
            alt="Profile"
            width={36}
            height={36}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-violet-600 flex items-center justify-center text-white">
            <UserIcon size={16} />
          </div>
        )}
      </div>

      <div className="hidden sm:block">
        <p className="text-[10px] text-white/50 font-medium leading-none mb-1 uppercase tracking-wider">
          Signed in
        </p>
        <p className="text-sm font-semibold text-white/90 leading-none">
          {user.user_metadata.full_name || user.email}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="ml-1 p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        title="Logout"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}

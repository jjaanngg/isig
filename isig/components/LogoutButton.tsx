"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium text-[#6B7280] transition-colors hover:bg-[#F7F8FA] hover:text-[#17191C]"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      로그아웃
    </button>
  );
}
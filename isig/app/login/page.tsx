"use client";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-5">
      <div className="w-full max-w-[400px] flex flex-col items-center gap-6 text-center">
        <span className="text-[20px] font-extrabold tracking-tight text-[#17191C]">
          ISIG
        </span>
        <p className="text-[14px] text-[#6B7280]">
          말로 설명이 안 되는 업무를,
          <br />
          대화만으로 인수인계 문서로 만들어보세요
        </p>
        <button
          onClick={handleGoogleLogin}
          className="w-full rounded-full bg-[#0F8477] px-6 py-3 text-[14px] font-medium text-white hover:opacity-90"
        >
          Google로 시작하기
        </button>
      </div>
    </div>
  );
}
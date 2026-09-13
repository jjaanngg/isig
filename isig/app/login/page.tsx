"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace("/home");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });
  };

  if (checking) {
    return <div className="min-h-screen bg-white" />;
  }

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
          className="flex w-full items-center justify-center gap-2.5 rounded-full border border-[#EAECEF] bg-white px-6 py-3 text-[14px] font-medium text-[#17191C] hover:bg-[#F7F8FA]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0012 23z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 010-4.2V7.05H2.18a11 11 0 000 9.9l3.66-2.85z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 00-9.82 6.05l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z" />
          </svg>
          Google로 시작하기
        </button>
      </div>
    </div>
  );
}
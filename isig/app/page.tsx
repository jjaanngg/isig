"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import MarkdownDoc from "@/components/MarkdownDoc";

const SAMPLE_DOC = `# 개인화기 손질 및 점검
## 개요
매주 금요일 오후 진행하는 개인화기 손질 절차입니다.
## 순서
- [ ] 탄알집 제거 및 약실 확인 (안전검사)
- [ ] 노리쇠 분리
- [ ] 총열 내부 세척
- [ ] 오일 도포 후 재조립
- [ ] 간부 검사
## 주의사항 / 예외
- 우천 훈련 직후엔 물기 제거를 먼저 할 것
- 노리쇠 재조립 시 방향 확인 필수`;

const STEPS = [
  {
    title: "대화로 설명하기",
    desc: "업무를 말로 설명하면 AI가 빠진 부분을 되물어요",
    icon: (
      <path d="M4 6h16v10H8l-4 4V6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
    ),
  },
  {
    title: "문서 자동 완성",
    desc: "체크리스트 형태의 인수인계 문서로 자동 정리돼요",
    icon: (
      <path d="M6 3h9l3 3v15H6V3zM8 11h8M8 15h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    ),
  },
  {
    title: "공유 & 인쇄",
    desc: "링크로 공유하거나 그대로 인쇄해서 전달할 수 있어요",
    icon: (
      <path d="M12 3v12M7 8l5-5 5 5M5 15v4a2 2 0 002 2h10a2 2 0 002-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
  },
];

export default function LandingPage() {
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

  if (checking) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-5 py-16">
      <div className="flex w-full max-w-[480px] flex-col items-center gap-8 text-center">
        <span className="text-[15px] font-extrabold tracking-tight text-[#17191C]">
          ISIG
        </span>

        <h1 className="text-[28px] font-extrabold leading-snug tracking-tight text-[#17191C]">
          몸으로 익힌 일을,
          <br />
          말로 설명 못 해서
          <br />
          생기는 인수인계 문제
        </h1>

        <p className="text-[14px] leading-relaxed text-[#6B7280]">
          병사들이 자기 업무를 몸으로 익히다 보니, 인수인계 시점엔
          <br />
          어디서부터 설명해야 할지 막막해지는 경우가 많습니다.
          <br />
          ISIG는 그 부담을 대화 하나로 줄여줍니다.
        </p>

        <Link
          href="/login"
          className="w-full rounded-full bg-[#0F8477] px-6 py-3 text-[14px] font-medium text-white hover:opacity-90"
        >
          시작하기
        </Link>
      </div>

      <div className="mt-20 grid w-full max-w-[480px] grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-3">
        {STEPS.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4F3F1] text-[#0F8477]">
              <svg width="18" height="18" viewBox="0 0 24 24">{step.icon}</svg>
            </div>
            <div className="text-[13px] font-medium text-[#17191C]">{step.title}</div>
            <div className="text-[11px] leading-relaxed text-[#6B7280]">{step.desc}</div>
          </div>
        ))}
      </div>

      <div className="mt-16 flex w-full max-w-[480px] flex-col gap-3">
        <p className="text-center text-[13px] font-medium text-[#6B7280]">
          이런 문서가 대화만으로 완성됩니다
        </p>
        <div className="rounded-2xl border border-[#EAECEF] bg-white p-6">
          <MarkdownDoc content={SAMPLE_DOC} />
        </div>
        <p className="text-center text-[12px] text-[#9AA1AC]">
          예시 화면입니다. 실제 문서는 대화 내용에 따라 자동 생성됩니다.
        </p>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";

export default function BackLink({
  href = "/home",
  label = "내 문서로",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 self-start rounded-full px-3.5 py-2 text-[13px] font-medium text-[#6B7280] transition-colors hover:bg-[#F7F8FA] hover:text-[#17191C]"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </Link>
  );
}
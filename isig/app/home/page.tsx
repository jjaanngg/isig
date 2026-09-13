"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Doc = {
  share_slug: string;
  content: string;
  created_at: string;
  topic: string | null;
};

export default function HomePage() {
  const router = useRouter();
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }
      setCheckingAuth(false);

      const { data: docs } = await supabase
        .from("documents")
        .select("share_slug, content, created_at, topic")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false });

      setDocs(docs ?? []);
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("이 문서를 삭제할까요? 되돌릴 수 없어요.")) return;
    await supabase.from("documents").delete().eq("share_slug", slug);
    setDocs((prev) => prev?.filter((d) => d.share_slug !== slug) ?? null);
  };

  if (checkingAuth) {
    return <div className="min-h-screen bg-white" />;
  }

  const topics = Array.from(
    new Set(docs?.map((d) => d.topic).filter(Boolean) ?? [])
  ) as string[];

  const filteredDocs = docs
    ?.filter((doc) => !topicFilter || doc.topic === topicFilter)
    .filter((doc) => doc.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col px-5 py-6">
        <div className="flex items-center justify-between pb-6">
          <span className="text-[15px] font-extrabold tracking-tight text-[#17191C]">
            ISIG
          </span>
          <button
            onClick={handleLogout}
            className="text-[13px] font-medium text-[#6B7280] hover:text-[#17191C]"
          >
            로그아웃
          </button>
        </div>

        <Link
          href="/interview"
          className="mb-4 rounded-full bg-[#0F8477] px-5 py-3 text-center text-[14px] font-medium text-white hover:opacity-90"
        >
          새 인터뷰 시작하기
        </Link>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="문서 검색"
          className="mb-4 rounded-full border border-[#EAECEF] bg-white px-5 py-2.5 text-[14px] outline-none focus:border-[#0F8477]"
        />

        {docs && docs.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setTopicFilter(null)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium ${
                !topicFilter ? "bg-[#0F8477] text-white" : "bg-[#F7F8FA] text-[#6B7280]"
              }`}
            >
              전체
            </button>
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setTopicFilter(t)}
                className={`rounded-full px-3 py-1 text-[12px] font-medium ${
                  topicFilter === t ? "bg-[#0F8477] text-white" : "bg-[#F7F8FA] text-[#6B7280]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {filteredDocs && filteredDocs.length === 0 && (
          <p className="text-center text-[14px] text-[#6B7280]">
            해당하는 문서가 없습니다.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {filteredDocs?.map((doc) => {
            const firstLine =
              doc.content.split("\n").find((line) => line.trim()) ?? "제목 없음";
            return (
              <div
                key={doc.share_slug}
                className="flex items-center justify-between rounded-2xl border border-[#EAECEF] bg-white p-4 hover:bg-[#F7F8FA]"
              >
                <Link href={`/docs/${doc.share_slug}`} className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-medium text-[#17191C]">
                    {firstLine.replace(/^#+\s*/, "")}
                  </div>
                  <div className="mt-1 text-[12px] text-[#6B7280]">
                    {new Date(doc.created_at).toLocaleString("ko-KR")}
                  </div>
                </Link>
                <div className="ml-2 flex shrink-0 items-center">
                  <Link
                    href={`/docs/${doc.share_slug}/edit`}
                    className="rounded-full p-2 text-[#6B7280] hover:bg-[#F7F8FA] hover:text-[#0F8477]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleDelete(doc.share_slug)}
                    aria-label="삭제"
                    className="rounded-full p-2 text-[#6B7280] hover:bg-[#FBEAEA] hover:text-[#E5484D]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MarkdownDoc from "@/components/MarkdownDoc";
import PrintButton from "@/components/PrintButton";
import BackLink from "@/components/BackLink";

export default function DocPage() {
  const params = useParams<{ slug: string }>();
  const [content, setContent] = useState<string | null>(null);
  const [notFoundState, setNotFoundState] = useState(false);

  const fetchDoc = async () => {
    const { data, error } = await supabase.rpc("get_document_by_slug", {
      slug_input: params.slug,
    });
    if (error || !data?.[0]) {
      setNotFoundState(true);
      return;
    }
    setContent(data[0].content);
  };

  useEffect(() => {
    fetchDoc();
  }, [params.slug]);

  if (notFoundState) {
    notFound();
  }

  if (!content) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col px-5 py-6">
        <div className="no-print mb-6 flex items-center justify-between">
          <BackLink />
          <span className="text-[15px] font-extrabold tracking-tight text-[#17191C]">
            ISIG
          </span>
        </div>
        <div className="rounded-2xl border border-[#EAECEF] bg-white p-6">
          <div className="mb-3 text-[13px] font-medium text-[#0F8477]">
            공유된 인수인계 문서
          </div>
          <MarkdownDoc content={content} />
          <p className="mt-4 text-[11px] text-[#9AA1AC]">
            문서 ID: {params.slug} · 열람일: {new Date().toLocaleString("ko-KR")}
          </p>
        </div>
        <PrintButton />
      </div>
    </div>
  );
}
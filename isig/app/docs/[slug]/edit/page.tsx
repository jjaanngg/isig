"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditDocPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.replace("/login");
        return;
      }
      // RLS가 본인 문서만 조회 허용하므로, 남의 문서면 결과가 비어있음
      const { data } = await supabase
        .from("documents")
        .select("content")
        .eq("share_slug", params.slug)
        .single();

      if (!data) {
        router.replace("/home");
        return;
      }
      setContent(data.content);
      setLoading(false);
    })();
  }, [params.slug, router]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("documents").update({ content }).eq("share_slug", params.slug);
    setSaving(false);
    router.push(`/docs/${params.slug}`);
  };

  if (loading) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col px-5 py-6">
        <span className="mb-6 text-[15px] font-extrabold tracking-tight text-[#17191C]">ISIG</span>
        <h1 className="mb-3 text-[16px] font-bold text-[#17191C]">문서 수정</h1>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[400px] flex-1 rounded-2xl border border-[#EAECEF] bg-white p-4 text-[14px] leading-relaxed text-[#17191C] outline-none focus:border-[#0F8477]"
        />
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => router.push(`/docs/${params.slug}`)}
            className="flex-1 rounded-full border border-[#EAECEF] px-5 py-3 text-[14px] font-medium text-[#6B7280]"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-full bg-[#0F8477] px-5 py-3 text-[14px] font-medium text-white disabled:opacity-40"
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
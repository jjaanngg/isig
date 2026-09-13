import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  // 로그인 확인
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const token = authHeader.replace("Bearer ", "");
  const { data: userData, error: authError } = await supabaseAuth.auth.getUser(token);

  if (authError || !userData.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  // 속도 제한: 최근 1시간 내 5개 이상 문서 생성 시 차단
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabaseAuth
    .from("sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userData.user.id)
    .gte("created_at", oneHourAgo);

  if (count !== null && count >= 5) {
    return NextResponse.json(
      { error: "시간당 생성 가능한 문서 수를 초과했어요. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  const { messages } = await req.json();

  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
    systemInstruction: `당신은 인터뷰 대화 내용을 인수인계 매뉴얼로 정리하는 어시스턴트입니다.
아래 대화 전체를 읽고, 다음 사람이 바로 실행할 수 있는 체크리스트 형태의 마크다운 문서로 재구성하세요.

형식:
# (업무 제목)
## 개요
(한두 문장 요약)
## 순서
- [ ] 단계1
- [ ] 단계2
...
## 주의사항 / 예외
- ...

마크다운 문서만 출력하고, 다른 설명은 하지 마세요.`,
  });

  const conversationText = messages
    .map((m: any) => `${m.role === "ai" ? "AI" : "사용자"}: ${m.content}`)
    .join("\n");

  const result = await model.generateContent(conversationText);
  return NextResponse.json({ document: result.response.text() });
}
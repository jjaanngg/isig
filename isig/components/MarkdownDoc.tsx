"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownDoc({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-3 text-[19px] font-extrabold tracking-tight text-[#17191C]">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-2 mt-5 text-[14px] font-bold text-[#0F8477]">
            {children}
          </h2>
        ),
        p: ({ children }) => (
          <p className="mb-2 text-[14px] leading-relaxed text-[#17191C]">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="mb-2 flex flex-col gap-1.5">{children}</ul>
        ),
        li: ({ children }) => (
          <li className="flex items-start gap-2 text-[14px] leading-relaxed text-[#17191C]">
            {children}
          </li>
        ),
        input: ({ checked }) => (
          <input
            type="checkbox"
            checked={!!checked}
            readOnly
            className="mt-1 h-4 w-4 accent-[#0F8477]"
          />
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-[#17191C]">{children}</strong>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
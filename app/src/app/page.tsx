"use client"

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/cn";
import React, { useState, useRef, ChangeEvent, ReactNode } from "react";

export const CustomTextarea = () => {
  const [contentHeight, setContentHeight] = useState<number>(400)
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (textareaRef.current) {
      setContentHeight(textareaRef.current.scrollHeight)
    }

    if (!value.length) {
      setContentHeight(40)
    }
  };

  return (
    <Textarea
      className={cn(
        "text-sm shadow-none border-none focus-visible:ring-transparent focus:border-transparent resize-none overflow-hidden",
      )}
      onChange={onChangeContent}
      ref={textareaRef}
      style={{
        height: contentHeight
      }}
      placeholder="入力してください…"
      />
  )
}

type PasteWrapperProps = React.ComponentProps<"div">

export const PasteWrapper = ({ children }: PasteWrapperProps) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <PasteWrapper>
        <CustomTextarea />
      </PasteWrapper>
    </div>
  );
}

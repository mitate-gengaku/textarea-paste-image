"use client"

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn";
import React, { useState, useRef, ChangeEvent, ReactNode } from "react";
import { FieldPath, FieldValues, useController, UseControllerProps, useForm } from "react-hook-form";

type CustomTextareaProps = React.ComponentProps<typeof Textarea> 

export const CustomTextarea = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, ...props }: CustomTextareaProps & UseControllerProps<TFieldValues, TName>) => {
  const [contentHeight, setContentHeight] = useState<number>(700)
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    field,
  } = useController({
    name: name,
    control: control
  })

  const onChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (textareaRef.current) {
      setContentHeight(textareaRef.current.scrollHeight)
    }

    if (!value.length) {
      setContentHeight(40)
    }

    field.onChange(e)
  };

  return (
    <Textarea
      {...field}
      {...props}
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

export const PasteWrapper = ({ children, ...props }: PasteWrapperProps) => {
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    //
  }

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    //
  }

  return (
    <div
      {...props}
      onDrop={onDrop}
      onPaste={onPaste}
      >
      {children}
    </div>
  )
}

export default function Home() {
  const {
    handleSubmit,
    formState,
    control,
  } = useForm({
    defaultValues: {
      text: ""
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
  })

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <form 
        className="space-y-2"
        onSubmit={onSubmit}
        >
        <Button>送信</Button>
        <PasteWrapper>
          <CustomTextarea
            name="text"
            control={control}
            />
        </PasteWrapper>
      </form>
    </div>
  );
}

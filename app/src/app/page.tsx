"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps,
  useForm,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import { Spinner } from "@/components/loading/spinner";
import { fileSchema } from "@/lib/zod/schema";
import { upload } from "@vercel/blob/client";

type CustomTextareaProps = React.ComponentProps<typeof Textarea>;

export const CustomTextarea = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  ...props
}: CustomTextareaProps & UseControllerProps<TFieldValues, TName>) => {
  const [contentHeight, setContentHeight] = useState<number>(700);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { field } = useController({
    name: name,
    control: control,
  });

  const onChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (textareaRef.current) {
      setContentHeight(textareaRef.current.scrollHeight);
    }

    if (!value.length) {
      setContentHeight(40);
    }

    field.onChange(e);
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
        height: contentHeight,
      }}
      placeholder="入力してください…"
    />
  );
};

const uploadFile = async (file: File) => {
  const newBlob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/files/upload",
  });

  return {
    url: newBlob.url,
  };
};

type PasteWrapperProps = React.ComponentProps<"div"> & {
  setValue: UseFormSetValue<{
    text: string;
  }>;
  getValues: UseFormGetValues<{
    text: string;
  }>;
};

export const PasteWrapper = ({
  children,
  setValue,
  getValues,
  className,
  ...props
}: PasteWrapperProps) => {
  const [isDragActive, setDragActive] = useState<boolean>(false);

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    if (
      e.dataTransfer &&
      e.dataTransfer.items &&
      e.dataTransfer.items.length > 0
    ) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    }
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const prevValue = getValues("text");

    const files = e.dataTransfer.files;

    if (!files) return;

    const parsedResult = fileSchema.safeParse({
      file: files[0],
    });

    if (parsedResult.success) {
      const file = parsedResult.data.file;

      if (!file) return;

      const { url } = await uploadFile(file);

      setValue("text", prevValue + "\n" + `![${file.name}](${url})`, {
        shouldValidate: true,
      });
    } else {
      return;
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const prevValue = getValues("text");

    const { items } = e.clipboardData;

    if (items[0].kind === "string") {
      items[0].getAsString((value) => {
        setValue("text", prevValue + value, {
          shouldValidate: true,
        });
      });
    }
  };

  return (
    <div
      {...props}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onPaste={onPaste}
      className={cn(className, isDragActive && "bg-slate-100")}
    >
      {children}
    </div>
  );
};

export default function Home() {
  const {
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    return;
  });

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <form className="space-y-2" onSubmit={onSubmit}>
        <Button disabled={isSubmitting}>
          {isSubmitting ? <Spinner className="text-white" /> : "送信"}
        </Button>
        <PasteWrapper setValue={setValue} getValues={getValues}>
          <CustomTextarea name="text" control={control} />
        </PasteWrapper>
      </form>
    </div>
  );
}

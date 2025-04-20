import { z } from "zod";

export const fileSchema = z.object({
  file: z
    .optional(
      z.instanceof(File, {
        message: "表紙の画像は必ず選んでください",
      }),
    )
    .nullable(),
});

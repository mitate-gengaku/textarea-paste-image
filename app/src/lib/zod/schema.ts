import { z } from "zod";

export const fileSchema = z.object({
  file: z
    .optional(
      z.instanceof(File, {
        message: "ファイルは必ず選んでください",
      }),
    )
    .nullable(),
});

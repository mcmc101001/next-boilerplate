import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function isValidBody<T extends z.ZodTypeAny>(
  body: any,
  schema: T
): body is z.infer<typeof schema> {
  const { success } = schema.safeParse(body);
  return success;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

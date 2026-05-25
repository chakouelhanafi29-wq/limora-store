type SupabaseErrorLike = {
  code?: string;
  message?: string;
} | null;

export function isSupabaseSchemaError(error: SupabaseErrorLike): boolean {
  if (!error) return false;

  const message = error.message?.toLowerCase() ?? "";

  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    message.includes("could not find the table") ||
    message.includes("schema cache") ||
    (message.includes("relation") && message.includes("does not exist"))
  );
}

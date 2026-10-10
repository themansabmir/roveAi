export function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: { message?: string; error?: { message?: string } } } }).response?.data
    const message = data?.error?.message ?? data?.message
    if (message) return String(message)
  }
  if (err instanceof Error) return err.message
  return "Something went wrong. Please try again."
}

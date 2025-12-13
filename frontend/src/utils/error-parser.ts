export async function safeParseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data && (data.message || data.error)) return data.message || data.error;
    return `HTTP ${res.status} ${res.statusText}`;
  } catch {
    return `HTTP ${res.status} ${res.statusText}`;
  }
}

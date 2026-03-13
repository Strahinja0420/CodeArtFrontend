// Free MyMemory translation API — no key required, 5000 words/day
const cache = new Map<string, string>();

export async function translateText(
  text: string,
  targetLang: string,
): Promise<string> {
  if (!text || targetLang === "en") return text;

  const key = `${targetLang}:${text}`;
  if (cache.has(key)) return cache.get(key)!;

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`,
    );
    const data = await res.json();
    const translated: string = data.responseData?.translatedText || text;
    cache.set(key, translated);
    return translated;
  } catch {
    return text;
  }
}

export async function translateFields<T extends Record<string, string | undefined | null>>(
  fields: T,
  targetLang: string,
): Promise<T> {
  if (targetLang === "en") return fields;
  const entries = await Promise.all(
    Object.entries(fields).map(async ([k, v]) => [
      k,
      v ? await translateText(v, targetLang) : v,
    ]),
  );
  return Object.fromEntries(entries) as T;
}

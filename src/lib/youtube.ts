const ID_RE = /^[A-Za-z0-9_-]{11}$/;

/**
 * YouTube linkinden video ID'sini çıkarır. Desteklenenler:
 * youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, /embed/ID, /live/ID,
 * m./music./www. alt alan adları ve doğrudan 11 karakterlik ID.
 */
export function videoIdCikar(girdi: string): string | null {
  const s = girdi.trim();
  if (!s) return null;
  if (ID_RE.test(s)) return s;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^(www|m|music)\./, '');
  const parcalar = url.pathname.split('/').filter(Boolean);
  let aday: string | null = null;

  if (host === 'youtu.be') {
    aday = parcalar[0] ?? null;
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (url.searchParams.has('v')) aday = url.searchParams.get('v');
    else if (['shorts', 'embed', 'live', 'v'].includes(parcalar[0])) aday = parcalar[1] ?? null;
  }

  return aday && ID_RE.test(aday) ? aday : null;
}

export function aramaUrl(sorgu: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(sorgu)}`;
}

export function embedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1`;
}

export function izleUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

let ctx: AudioContext | null = null;

/**
 * Tarayıcılar sesi yalnızca kullanıcı etkileşiminden sonra çalar.
 * Set işaretlenirken çağrılır ki sayaç bitince ses çalabilsin.
 */
export function sesiHazirla(): void {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
  } catch {
    // Ses desteklenmiyor; titreşim yine çalışır
  }
}

function bip(baslangic: number, frekans: number, sure: number): void {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frekans;
  gain.gain.setValueAtTime(0.0001, baslangic);
  gain.gain.exponentialRampToValueAtTime(0.4, baslangic + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, baslangic + sure);
  osc.connect(gain).connect(ctx.destination);
  osc.start(baslangic);
  osc.stop(baslangic + sure + 0.05);
}

/** Dinlenme bitti: titreşim + üç bip */
export function bitisSinyali(): void {
  try {
    navigator.vibrate?.([300, 120, 300, 120, 500]);
  } catch {
    // yoksay
  }
  if (!ctx) return;
  const t = ctx.currentTime + 0.05;
  bip(t, 880, 0.18);
  bip(t + 0.3, 880, 0.18);
  bip(t + 0.6, 1320, 0.35);
}

/** Set işaretlenince kısa geri bildirim */
export function kisaTitresim(): void {
  try {
    navigator.vibrate?.(30);
  } catch {
    // yoksay
  }
}

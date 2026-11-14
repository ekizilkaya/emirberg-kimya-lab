/** Türkçeye duyarlı arama katlaması: "iyot", "IYOT", "İyot" aynı sonucu verir. */
export function foldTr(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

export function upperTr(s: string): string {
  return s.toLocaleUpperCase('tr-TR');
}

/** Ondalık ayırıcı virgül, binlik ayırıcı nokta */
export function formatNumber(n: number, maxDecimals = 1): string {
  return n.toLocaleString('tr-TR', { maximumFractionDigits: maxDecimals });
}

export function formatTemp(n: number): string {
  const sign = n < 0 ? '−' : '';
  return `${sign}${formatNumber(Math.abs(n))} °C`;
}

const SUB: Record<string, string> = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };

export function subscript(n: number): string {
  return String(n)
    .split('')
    .map((d) => SUB[d] ?? d)
    .join('');
}

/** Hill sırası: önce C, sonra H, sonra alfabetik */
export function hillFormula(counts: Record<string, number>): string {
  const keys = Object.keys(counts).filter((k) => counts[k] > 0);
  const hasC = keys.includes('C');
  keys.sort((a, b) => {
    if (hasC) {
      if (a === 'C') return -1;
      if (b === 'C') return 1;
      if (a === 'H') return -1;
      if (b === 'H') return 1;
    }
    return a.localeCompare(b);
  });
  return keys.map((k) => `${k}${counts[k] > 1 ? subscript(counts[k]) : ''}`).join('');
}

export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Arabic text normalisation utilities for search.
 * Applied in the application layer BEFORE writing to search_terms column.
 */

/** Remove tashkeel (diacritics) */
export function stripDiacritics(text: string): string {
  return text.replace(/[ً-ٰٟ]/g, '');
}

/** Normalise alef variants to bare alef */
export function normaliseAlef(text: string): string {
  return text.replace(/[آأإا]/g, 'ا');
}

/** Unify ya/alef maqsura */
export function normaliseYa(text: string): string {
  return text.replace(/ى/g, 'ي');
}

/** Unify ha variants */
export function normaliseHa(text: string): string {
  return text.replace(/ة/g, 'ه');
}

/** Full Arabic normalisation pipeline */
export function normaliseArabic(text: string): string {
  return normaliseHa(normaliseYa(normaliseAlef(stripDiacritics(text)))).trim();
}

/** Build search terms string combining EN + normalised AR */
export function buildSearchTerms(nameEn: string, nameAr?: string | null): string {
  const parts = [nameEn.toLowerCase()];
  if (nameAr) {
    parts.push(normaliseArabic(nameAr));
  }
  return parts.join(' ');
}

/**
 * Date parsing and formatting helper for SIAS
 * Handles standard dates, ISO strings, and Excel serial numeric dates (e.g. 41065.291666666664)
 */

const BULAN_INDONESIA = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Converts an Excel serial date number (e.g. 41065 or "41065.291666666664") to a Date object.
 */
export function parseExcelSerialDate(serial: number): Date {
  // Excel base date: Dec 30, 1899 (to account for the 1900 leap-year bug)
  const excelEpochUtc = Date.UTC(1899, 11, 30);
  const ms = Math.round(serial * 86400 * 1000);
  return new Date(excelEpochUtc + ms);
}

/**
 * Converts raw date input (Excel serial number, ISO string, etc.) into a clean YYYY-MM-DD string.
 */
export function normalizeDateToIso(val: string | number | undefined | null): string {
  if (!val) return '';
  const str = String(val).trim();

  // Check if it's a numeric Excel serial date, e.g. "41065" or "41065.291666666664"
  const num = Number(str);
  if (!isNaN(num) && num > 10000 && num < 90000) {
    const d = parseExcelSerialDate(num);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(d.getUTCDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
  }

  // Check if it's DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const dd = dmyMatch[1].padStart(2, '0');
    const mm = dmyMatch[2].padStart(2, '0');
    const yyyy = dmyMatch[3];
    return `${yyyy}-${mm}-${dd}`;
  }

  // Standard ISO match YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const yyyy = isoMatch[1];
    const mm = isoMatch[2].padStart(2, '0');
    const dd = isoMatch[3].padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  return str;
}

/**
 * Formats a birth date string into human-readable Indonesian format (e.g. "6 Juni 2012").
 * Safely parses Excel serial dates like "41065.291666666664".
 */
export function formatTanggalLahirIndo(val: string | number | undefined | null): string {
  if (!val) return '-';
  const str = String(val).trim();

  // Check if it's a numeric Excel serial date
  const num = Number(str);
  if (!isNaN(num) && num > 10000 && num < 90000) {
    const d = parseExcelSerialDate(num);
    if (!isNaN(d.getTime())) {
      const day = d.getUTCDate();
      const monthName = BULAN_INDONESIA[d.getUTCMonth()] || '';
      const year = d.getUTCFullYear();
      return `${day} ${monthName} ${year}`;
    }
  }

  // Check if it's YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const year = isoMatch[1];
    const monthIdx = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${day} ${BULAN_INDONESIA[monthIdx]} ${year}`;
    }
  }

  // Check if it's DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const monthIdx = parseInt(dmyMatch[2], 10) - 1;
    const year = dmyMatch[3];
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${day} ${BULAN_INDONESIA[monthIdx]} ${year}`;
    }
  }

  return str;
}

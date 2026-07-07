/**
 * Format ISO date string into "15 Sep 2025" format (Indonesian locale).
 * @param dateString - ISO date string or any valid date input
 * @returns Formatted date string or empty string if invalid
 */
function formatDateOnly(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default formatDateOnly;

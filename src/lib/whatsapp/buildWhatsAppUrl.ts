export function buildWhatsAppUrl(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function extractHeartMessage(raw?: string): string {
  const trimmed = raw?.trim() ?? '';
  if (!trimmed) return '';

  return trimmed.replace(/^رسالة\s*من\s*القلب\s*[:：]\s*/u, '').trim();
}

export function buildNaqootWhatsAppMessage(input: {
  donorName: string;
  amount: number;
  message?: string;
  groomNickname?: string;
  defaultMessage?: string;
}): string {
  const groom = input.groomNickname ?? 'ابو حسان';
  const heartBody =
    extractHeartMessage(input.message) ||
    input.defaultMessage ||
    `الف مبارك ${groom}...`;

  const lines = [`رسالة من القلب: ${heartBody}`];

  if (input.amount > 0) {
    lines.push('', `واحلى ${input.amount} شمعة لعيون العريس`, '');
  } else {
    lines.push('');
  }

  lines.push(`محبك: ${input.donorName}`);

  return lines.join('\n');
}

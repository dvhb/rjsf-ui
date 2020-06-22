import sanitizeHtml from 'sanitize-html';

export const sanitized = (text?: boolean | number | string | object | null): string => sanitizeHtml(String(text));

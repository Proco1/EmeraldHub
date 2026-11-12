export interface GameItem {
  id: number;
  name: string;
  cover: string;
  url: string;
  author?: string;
  authorLink?: string;
  special?: string;
}

export const COVER_BASE = 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/';
export const HTML_BASE = 'https://cdn.jsdelivr.net/gh/freebuisness/html@main/';

export const resolveCoverUrl = (cover: string): string => {
  if (!cover) return '';
  if (cover.startsWith('http://') || cover.startsWith('https://')) return cover;
  return cover.replace('{COVER_URL}/', COVER_BASE).replace('{COVER_URL}', COVER_BASE);
};

export const resolveGameUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return url.replace('{HTML_URL}/', HTML_BASE).replace('{HTML_URL}', HTML_BASE);
};

export const prepareGameHtml = (rawHtml: string, gameUrl: string): string => {
  if (!rawHtml) return '';

  let html = rawHtml;

  // If the html does not contain a <base href= tag, inject one from the game URL
  if (!/<base\s+href=/i.test(html)) {
    const lastSlash = gameUrl.lastIndexOf('/');
    const baseDir = lastSlash !== -1 ? gameUrl.substring(0, lastSlash + 1) : gameUrl;
    const baseTag = `<base href="${baseDir}">`;

    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, (m) => m + '\n' + baseTag);
    } else if (/<html[^>]*>/i.test(html)) {
      html = html.replace(/<html[^>]*>/i, (m) => m + '\n<head>' + baseTag + '</head>');
    } else {
      html = baseTag + '\n' + html;
    }
  }

  // Ensure full viewport reset styles so canvas/game fills 100% of the iframe
  const resetStyle = `
    <style>
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overflow: hidden !important;
        background-color: #000 !important;
      }
    </style>
  `;

  if (/<head[^>]*>/i.test(html)) {
    html = html.replace(/<\/head>/i, resetStyle + '</head>');
  } else {
    html = resetStyle + html;
  }

  return html;
};

export interface CloakPreset {
  id: string;
  name: string;
  title: string;
  icon: string;
}

export const CLOAK_PRESETS: CloakPreset[] = [
  {
    id: 'default',
    name: 'Default Emerald',
    title: 'Emerald Portal - Proxies, Movies & Games Hub',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2310b981"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polygon points="2 17 12 22 22 17"/><polygon points="2 12 12 17 22 12"/></svg>',
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png',
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png',
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard',
    icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    icon: 'https://www.desmos.com/favicon.ico',
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    icon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
  },
];

export const applyCloak = (preset: CloakPreset) => {
  document.title = preset.title;

  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = preset.icon;
};

export const openInAboutBlank = (targetUrl: string) => {
  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Pop-up blocked! Please allow pop-ups for this site to open in stealth mode.');
    return;
  }

  const iframe = win.document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.bottom = '0';
  iframe.style.left = '0';
  iframe.style.right = '0';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.margin = '0';
  iframe.style.padding = '0';
  iframe.style.overflow = 'hidden';
  iframe.style.zIndex = '999999';
  iframe.src = targetUrl;

  win.document.body.style.margin = '0';
  win.document.body.style.height = '100vh';
  win.document.body.style.overflow = 'hidden';
  win.document.body.appendChild(iframe);
};

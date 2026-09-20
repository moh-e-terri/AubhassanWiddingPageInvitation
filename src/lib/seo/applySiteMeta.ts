import { weddingConfig } from '@/config/wedding.config';

const shareTitle = weddingConfig.copy.siteTitle;

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

/** يوحّد عنوان التبويب ووسوم المشاركة (واتساب / تيليجرام / تويتر). */
export function applySiteMeta() {
  document.title = shareTitle;

  setMeta('name', 'description', shareTitle);
  setMeta('property', 'og:title', shareTitle);
  setMeta('property', 'og:description', shareTitle);
  setMeta('name', 'twitter:title', shareTitle);
  setMeta('name', 'twitter:description', shareTitle);
}

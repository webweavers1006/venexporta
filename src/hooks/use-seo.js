import { useEffect } from 'react';

function upsertMeta({ key, value, attr = 'name' }) {
  if (!value) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function upsertLink({ rel, href }) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, json) {
  if (!json) return;
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json);
}

export function useSEO({ title, description, canonical, og = {}, twitter = {}, jsonLd, jsonLdId = 'seo-jsonld' }) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) upsertMeta({ key: 'description', value: description });
    if (canonical) upsertLink({ rel: 'canonical', href: canonical });

    // Open Graph
    if (og) {
      const { title: ogTitle, description: ogDesc, type, url, image, width, height, site_name, locale, imageAlt } = og;
      upsertMeta({ key: 'og:type', value: type, attr: 'property' });
      upsertMeta({ key: 'og:title', value: ogTitle, attr: 'property' });
      upsertMeta({ key: 'og:description', value: ogDesc, attr: 'property' });
      upsertMeta({ key: 'og:url', value: url, attr: 'property' });
      upsertMeta({ key: 'og:image', value: image, attr: 'property' });
      upsertMeta({ key: 'og:site_name', value: site_name, attr: 'property' });
      upsertMeta({ key: 'og:locale', value: locale, attr: 'property' });
      upsertMeta({ key: 'og:image:alt', value: imageAlt, attr: 'property' });
      // Optional dimensions help parsers
      upsertMeta({ key: 'og:image:width', value: width, attr: 'property' });
      upsertMeta({ key: 'og:image:height', value: height, attr: 'property' });
    }

    // Twitter
    if (twitter) {
      const { card, title: twTitle, description: twDesc, image: twImage, site } = twitter;
      upsertMeta({ key: 'twitter:card', value: card });
      upsertMeta({ key: 'twitter:title', value: twTitle });
      upsertMeta({ key: 'twitter:description', value: twDesc });
      upsertMeta({ key: 'twitter:image', value: twImage });
      upsertMeta({ key: 'twitter:site', value: site });
    }

    // JSON-LD
    if (jsonLd) upsertJsonLd(jsonLdId, jsonLd);
  }, [
    title,
    description,
    canonical,
    og?.title,
    og?.description,
    og?.type,
    og?.url,
    og?.image,
    og?.width,
    og?.height,
    og?.site_name,
    og?.locale,
    og?.imageAlt,
    twitter?.card,
    twitter?.title,
    twitter?.description,
    twitter?.image,
    twitter?.site,
    jsonLd,
  ]);
}

export default useSEO;

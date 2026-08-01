// Type definitions for SEO components

export { default as SEOHead } from './SEOHead.astro';
export { default as StructuredData } from './StructuredData.astro';
export { default as CompleteSEO } from './CompleteSEO.astro';
export { default as Breadcrumb } from './Breadcrumb.astro';
export { default as FAQ } from './FAQ.astro';

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  canonicalURL?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  locale?: string;
  siteName?: string;
  twitterHandle?: string;
  noindex?: boolean;
}

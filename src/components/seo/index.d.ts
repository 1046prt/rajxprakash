// Type definitions for SEO components

export const SEOHead: any;
export const StructuredData: any;
export const CompleteSEO: any;
export const Breadcrumb: any;
export const FAQ: any;

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

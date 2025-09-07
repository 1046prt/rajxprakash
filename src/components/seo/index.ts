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

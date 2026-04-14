import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
  title: string;
  description?: string;
}

/**
 * PageMeta Component
 * Handles dynamic document head management for SEO and user tab contextualization.
 */
const PageMeta = ({ title, description }: PageMetaProps) => {
  const fullTitle = `${title}`;
  const defaultDescription = 'Ideagram  A collaborative project reporting platform for teams to track progress and resolve issues.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />

      {/* OpenGraph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
    </Helmet>
  );
};

export default PageMeta;

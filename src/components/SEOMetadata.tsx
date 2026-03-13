import Head from 'next/head';

interface SEOMetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

export default function SEOMetadata({
  title = "Knit Info - India's Leading Textile Industry Directory & Platform",
  description = "Knit Info is India's most comprehensive textile industry directory connecting manufacturers, suppliers, buyers, and service providers. Find yarn suppliers, fabric manufacturers, knitting companies, printing services, dyes & chemicals, machineries, and more.",
  keywords = "knit info, knitinfo, textile directory, textile industry, yarn suppliers, fabric manufacturers, knitting companies, textile machinery, dyes chemicals, printing services, buying agents, textile business, garment industry, hosiery manufacturers, textile sourcing, India textile directory, textile suppliers directory, knitwear industry, textile trade, fabric suppliers, textile equipment, textile raw materials",
  canonical,
  ogImage = "/logo.jpg",
  ogType = "website",
  noindex = false
}: SEOMetadataProps) {
  const fullTitle = title.includes('Knit Info') ? title : `${title} | Knit Info`;
  const siteUrl = "https://knitinfo.netlify.app";
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Knit Info" />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"} />
      <meta name="googlebot" content="index,follow" />
      <meta name="bingbot" content="index,follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Knit Info" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:site" content="@knitinfo" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#1e3a8a" />
      <meta name="msapplication-TileColor" content="#1e3a8a" />
      <meta name="application-name" content="Knit Info" />
      <meta name="apple-mobile-web-app-title" content="Knit Info" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Geo Meta Tags */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.country" content="India" />
      <meta name="geo.placename" content="Tirupur, Tamil Nadu, India" />
      <meta name="ICBM" content="11.1085, 77.3411" />
      
      {/* Business Meta Tags */}
      <meta name="classification" content="Business Directory" />
      <meta name="category" content="Textile Industry" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="en-IN" />
      <link rel="alternate" hrefLang="en-in" href={fullCanonical} />
      <link rel="alternate" hrefLang="en" href={fullCanonical} />
      <link rel="alternate" hrefLang="x-default" href={fullCanonical} />
      
      {/* Structured Data - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Knit Info",
            "alternateName": ["KnitInfo", "Knit Info Directory"],
            "url": siteUrl,
            "logo": `${siteUrl}/logo.jpg`,
            "description": description,
            "foundingDate": "2007",
            "founders": [
              {
                "@type": "Person",
                "name": "N. Mohanraj"
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Winner Traders, 51, RPS Complex, KSC School Road, Near Shri Paper Mart, Dharapuram Road",
              "addressLocality": "Tirupur",
              "addressRegion": "Tamil Nadu",
              "postalCode": "641604",
              "addressCountry": "IN"
            },
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+91-9943632229",
                "contactType": "customer service",
                "availableLanguage": ["English", "Tamil", "Hindi"]
              },
              {
                "@type": "ContactPoint",
                "telephone": "+91-9843232229",
                "contactType": "customer service",
                "availableLanguage": ["English", "Tamil", "Hindi"]
              }
            ],
            "email": "knitinfo.in@gmail.com",
            "sameAs": [
              siteUrl
            ],
            "industry": "Textile Industry Directory",
            "numberOfEmployees": "10-50",
            "areaServed": {
              "@type": "Country",
              "name": "India"
            }
          })
        }}
      />
      
      {/* Structured Data - WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Knit Info",
            "alternateName": "KnitInfo Directory",
            "url": siteUrl,
            "description": description,
            "publisher": {
              "@type": "Organization",
              "name": "Knit Info"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${siteUrl}/catalogue?search={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </Head>
  );
}
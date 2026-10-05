// Canonical origin for metadata, sitemap and robots. heysrajan.com redirects to www.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.heysrajan.com"
).replace(/\/+$/, "");

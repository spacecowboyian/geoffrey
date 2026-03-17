import type { SanityBuildLog, SanitySettings } from '../types/sanity';
import { sanityClient } from './sanityClient';

const BUILD_LOG_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  date,
  vehicle,
  phase,
  odometer,
  hours,
  status,
  partsUsed,
  featured,
  coverImage { ..., asset-> },
  gallery[]{ ..., asset-> }[defined(asset)],
  summary,
  body[] {
    ...,
    _type == "image" => { ..., asset-> }
  }
`;

export async function getAllBuildLogs(): Promise<SanityBuildLog[]> {
  return sanityClient.fetch(
    `*[_type == "buildLog"] | order(date desc) { ${BUILD_LOG_FIELDS} }`,
  );
}

export async function getFeaturedBuildLog(): Promise<SanityBuildLog | null> {
  return sanityClient.fetch(
    `*[_type == "buildLog" && featured == true][0] { ${BUILD_LOG_FIELDS} }`,
  );
}

export async function getBuildLogBySlug(slug: string): Promise<SanityBuildLog | null> {
  return sanityClient.fetch(
    `*[_type == "buildLog" && slug.current == $slug][0] { ${BUILD_LOG_FIELDS} }`,
    { slug },
  );
}

export async function getAllBuildLogSlugs(): Promise<string[]> {
  const results: Array<{ slug: string }> = await sanityClient.fetch(
    `*[_type == "buildLog"] { "slug": slug.current }`,
  );
  return results.map((r) => r.slug).filter(Boolean);
}

export async function getSiteSettings(): Promise<SanitySettings | null> {
  return sanityClient.fetch(
    `*[_type == "siteSettings"][0] {
      siteTitle,
      siteDescription,
      heroTitle,
      heroText,
      aboutText,
      socialLinks
    }`,
  );
}

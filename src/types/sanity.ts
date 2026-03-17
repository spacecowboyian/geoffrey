import type { ArbitraryTypedObject, PortableTextBlock } from '@portabletext/types';

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface SanityBuildLog {
  _id: string;
  title: string;
  slug: string;
  date: string | null;
  vehicle: string;
  phase: string;
  odometer: number | null;
  hours: number | null;
  status: string;
  partsUsed: string[];
  coverImage: SanityImage | null;
  gallery: SanityImage[];
  summary: string;
  body: (PortableTextBlock | ArbitraryTypedObject)[];
}

export interface SanitySocialLink {
  platform: string;
  url: string;
}

export interface SanitySettings {
  siteTitle: string;
  siteDescription: string;
  heroTitle: string;
  heroText: string;
  aboutText: string;
  socialLinks: SanitySocialLink[];
}

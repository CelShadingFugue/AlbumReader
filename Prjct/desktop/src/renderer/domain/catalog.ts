export type CollectionKind = 'smart' | 'folder' | 'archive';

export interface CatalogCollection {
  id: string;
  name: string;
  kind: CollectionKind;
  /** Short label shown under archive/folder names. */
  sourceLabel?: string;
}

export type PhotoOrigin = 'workspace' | 'archive';
export type ViewMode = 'grid' | 'list';
export type ThemeMode = 'dark' | 'light';

export interface CatalogPhoto {
  id: string;
  collectionId: string;
  name: string;
  title: string;
  origin: PhotoOrigin;
  archiveName?: string;
  width: number;
  height: number;
  sizeBytes: number;
  modifiedAt: string;
  format: 'JPEG' | 'PNG' | 'WEBP' | 'HEIC';
  favorite: boolean;
  /** Data URL used by the front-end prototype until real thumbnails arrive. */
  thumbnail: string;
  accent: string;
}

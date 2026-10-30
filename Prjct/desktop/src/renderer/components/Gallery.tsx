import {
  Archive,
  Check,
  Grid2X2,
  ImageOff,
  List,
  SlidersHorizontal,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { CatalogPhoto, ViewMode } from '../domain/catalog';
import { formatBytes } from '../lib/format';

interface GalleryProps {
  photos: CatalogPhoto[];
  selectedId: string | null;
  viewMode: ViewMode;
  onSelect: (photo: CatalogPhoto) => void;
  onOpen: (photo: CatalogPhoto) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

type SourceFilter = 'all' | 'workspace' | 'archive';

export function Gallery({
  photos,
  selectedId,
  viewMode,
  onSelect,
  onOpen,
  onViewModeChange,
}: GalleryProps) {
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');

  const visiblePhotos = useMemo(
    () =>
      sourceFilter === 'all'
        ? photos
        : photos.filter((photo) => photo.origin === sourceFilter),
    [photos, sourceFilter],
  );

  return (
    <main className="gallery" aria-label="图片列表">
      <div className="gallery-heading">
        <div>
          <div className="heading-kicker">
            <span className="live-dot" />
            本地图库预览
          </div>
          <h1>让照片自己讲故事。</h1>
          <p>
            在这里浏览工作区图片与压缩包内容。当前为交互原型，真实缩略图和文件索引由后续核心层提供。
          </p>
        </div>
        <div
          className="gallery-counter"
          aria-label={`${visiblePhotos.length} 张图片`}
        >
          <strong>{String(visiblePhotos.length).padStart(2, '0')}</strong>
          <span>张图片</span>
        </div>
      </div>

      <div className="gallery-toolbar">
        <div className="filter-group" role="group" aria-label="来源筛选">
          {(
            [
              ['all', '全部'],
              ['workspace', '工作区文件'],
              ['archive', '压缩包'],
            ] as const
          ).map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={sourceFilter === value ? 'is-active' : ''}
              onClick={() => setSourceFilter(value)}
              aria-pressed={sourceFilter === value}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="toolbar-spacer" />

        <button type="button" className="quiet-button" title="排序：最近修改">
          <SlidersHorizontal size={15} aria-hidden="true" />
          最近修改
        </button>

        <div className="segmented-control" role="group" aria-label="视图方式">
          <button
            type="button"
            className={viewMode === 'grid' ? 'is-active' : ''}
            onClick={() => onViewModeChange('grid')}
            title="网格视图"
            aria-pressed={viewMode === 'grid'}
          >
            <Grid2X2 size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={viewMode === 'list' ? 'is-active' : ''}
            onClick={() => onViewModeChange('list')}
            title="列表视图"
            aria-pressed={viewMode === 'list'}
          >
            <List size={17} aria-hidden="true" />
          </button>
        </div>
      </div>

      {visiblePhotos.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">
            <ImageOff size={28} aria-hidden="true" />
          </span>
          <h2>没有匹配的图片</h2>
          <p>换个关键词，或切换到其他来源。</p>
        </div>
      ) : (
        <div
          className={`photo-collection ${viewMode === 'list' ? 'is-list' : ''}`}
        >
          {visiblePhotos.map((photo, index) => (
            <button
              type="button"
              key={photo.id}
              className={`photo-card ${selectedId === photo.id ? 'is-selected' : ''}`}
              style={
                {
                  '--stagger': `${Math.min(index, 12) * 42}ms`,
                } as React.CSSProperties
              }
              onClick={() => onSelect(photo)}
              onDoubleClick={() => onOpen(photo)}
              aria-label={`选择 ${photo.title}，双击打开大图`}
              aria-pressed={selectedId === photo.id}
            >
              <span className="photo-card__visual">
                <img src={photo.thumbnail} alt={photo.title} loading="lazy" />
                <span className="photo-card__scrim" />
                <span className="photo-card__badge">
                  {photo.origin === 'archive' ? (
                    <>
                      <Archive size={12} aria-hidden="true" />
                      ZIP
                    </>
                  ) : (
                    photo.format
                  )}
                </span>
                {photo.favorite && (
                  <span className="photo-card__favorite">精选</span>
                )}
                {selectedId === photo.id && (
                  <span className="photo-card__check">
                    <Check size={13} strokeWidth={3} aria-hidden="true" />
                  </span>
                )}
              </span>
              <span className="photo-card__info">
                <span className="photo-card__text">
                  <strong>{photo.title}</strong>
                  <span>
                    {photo.origin === 'archive'
                      ? photo.archiveName
                      : photo.name}
                  </span>
                </span>
                <span className="photo-card__meta">
                  {photo.width} × {photo.height}
                  <span>·</span>
                  {formatBytes(photo.sizeBytes)}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}

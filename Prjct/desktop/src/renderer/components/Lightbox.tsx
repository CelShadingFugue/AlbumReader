import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect } from 'react';
import type { CatalogPhoto } from '../domain/catalog';
import { formatBytes } from '../lib/format';

interface LightboxProps {
  photo: CatalogPhoto;
  hasPrevious: boolean;
  hasNext: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function Lightbox({
  photo,
  hasPrevious,
  hasNext,
  onClose,
  onPrevious,
  onNext,
}: LightboxProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && hasPrevious) onPrevious();
      if (event.key === 'ArrowRight' && hasNext) onNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hasNext, hasPrevious, onClose, onNext, onPrevious]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`查看 ${photo.title}`}
      onMouseDown={onClose}
    >
      <div
        className="lightbox__ambient"
        style={{ backgroundImage: `url("${photo.thumbnail}")` }}
      />
      <div
        className="lightbox__topbar"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div>
          <strong>{photo.title}</strong>
          <span>
            {photo.origin === 'archive' ? photo.archiveName : photo.name}
          </span>
        </div>
        <button
          type="button"
          className="icon-button icon-button--on-dark"
          onClick={onClose}
          aria-label="关闭大图"
        >
          <X size={19} aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        className="lightbox__nav lightbox__nav--previous"
        onClick={onPrevious}
        disabled={!hasPrevious}
        aria-label="上一张"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ChevronLeft size={25} aria-hidden="true" />
      </button>

      <figure
        className="lightbox__stage"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <img src={photo.thumbnail} alt={photo.title} />
        <figcaption>
          <span>
            {photo.width} × {photo.height}
          </span>
          <span>{formatBytes(photo.sizeBytes)}</span>
          <span>{photo.format}</span>
        </figcaption>
      </figure>

      <button
        type="button"
        className="lightbox__nav lightbox__nav--next"
        onClick={onNext}
        disabled={!hasNext}
        aria-label="下一张"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ChevronRight size={25} aria-hidden="true" />
      </button>

      <div className="lightbox__hint">← → 切换 · Esc 关闭</div>
    </div>
  );
}

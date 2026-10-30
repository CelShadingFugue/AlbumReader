import {
  Archive,
  Copy,
  Download,
  ExternalLink,
  Heart,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import type { CatalogPhoto } from '../domain/catalog';
import { formatBytes } from '../lib/format';

interface InspectorProps {
  photo: CatalogPhoto | null;
  onOpen: (photo: CatalogPhoto) => void;
  onToggleFavorite: (photoId: string) => void;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="meta-row">
      <dt>{label}</dt>
      <dd title={value}>{value}</dd>
    </div>
  );
}

export function Inspector({ photo, onOpen, onToggleFavorite }: InspectorProps) {
  if (!photo) {
    return (
      <aside className="inspector inspector--empty" aria-label="图片检查器">
        <div className="inspector-empty">
          <ImageIcon size={24} aria-hidden="true" />
          <p>选择一张图片查看详情</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="inspector" aria-label="图片检查器">
      <div className="inspector-heading">
        <span>检查器</span>
        <span className="inspector-heading__source">
          {photo.origin === 'archive' ? (
            <Archive size={13} />
          ) : (
            <ImageIcon size={13} />
          )}
          {photo.origin === 'archive' ? '压缩包内图片' : '工作区文件'}
        </span>
      </div>

      <button
        type="button"
        className="inspector-preview"
        onClick={() => onOpen(photo)}
      >
        <img src={photo.thumbnail} alt={photo.title} />
        <span className="inspector-preview__overlay">
          <ExternalLink size={15} aria-hidden="true" />
          打开大图
        </span>
      </button>

      <div className="inspector-title">
        <div>
          <h2>{photo.title}</h2>
          <p title={photo.name}>{photo.name}</p>
        </div>
        <button
          type="button"
          className={`favorite-button ${photo.favorite ? 'is-active' : ''}`}
          onClick={() => onToggleFavorite(photo.id)}
          aria-pressed={photo.favorite}
          title={photo.favorite ? '取消精选' : '加入精选'}
        >
          <Heart
            size={17}
            fill={photo.favorite ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
          <span className="sr-only">切换精选</span>
        </button>
      </div>

      <div className="tag-row" aria-label="图片标签">
        <span># 风景</span>
        <span># 2026</span>
        <span className="tag-row__muted">+ 添加</span>
      </div>

      <dl className="metadata">
        <MetaRow label="尺寸" value={`${photo.width} × ${photo.height}`} />
        <MetaRow label="文件大小" value={formatBytes(photo.sizeBytes)} />
        <MetaRow label="格式" value={photo.format} />
        <MetaRow label="修改时间" value={photo.modifiedAt} />
        <MetaRow
          label="来源"
          value={
            photo.origin === 'archive'
              ? (photo.archiveName ?? '压缩包')
              : '本地工作区'
          }
        />
      </dl>

      <div className="inspector-actions">
        <button
          type="button"
          className="action-button"
          onClick={() => onOpen(photo)}
        >
          <ExternalLink size={15} aria-hidden="true" />
          查看
        </button>
        <button
          type="button"
          className="icon-button"
          title="复制文件路径（待接入）"
          disabled
        >
          <Copy size={16} aria-hidden="true" />
          <span className="sr-only">复制路径</span>
        </button>
        <button
          type="button"
          className="icon-button"
          title="导出（待接入）"
          disabled
        >
          <Download size={16} aria-hidden="true" />
          <span className="sr-only">导出</span>
        </button>
        <button
          type="button"
          className="icon-button danger"
          title="删除（待接入）"
          disabled
        >
          <Trash2 size={16} aria-hidden="true" />
          <span className="sr-only">删除</span>
        </button>
      </div>
    </aside>
  );
}

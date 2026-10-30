import { Archive, Folder, HardDrive, Images, Sparkles } from 'lucide-react';
import type { CatalogCollection } from '../domain/catalog';
import { collectionKindLabel } from '../lib/format';

interface SidebarProps {
  collections: CatalogCollection[];
  activeCollectionId: string;
  counts: Record<string, number>;
  workspaceLabel: string;
  onSelectCollection: (collectionId: string) => void;
}

function CollectionIcon({ kind }: { kind: CatalogCollection['kind'] }) {
  if (kind === 'archive') return <Archive aria-hidden="true" size={15} />;
  if (kind === 'folder') return <Folder aria-hidden="true" size={15} />;
  return <Sparkles aria-hidden="true" size={15} />;
}

export function Sidebar({
  collections,
  activeCollectionId,
  counts,
  workspaceLabel,
  onSelectCollection,
}: SidebarProps) {
  const smartCollections = collections.filter(
    (collection) => collection.kind === 'smart',
  );
  const fileCollections = collections.filter(
    (collection) => collection.kind !== 'smart',
  );

  return (
    <aside className="sidebar" aria-label="图库导航">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <div>
          <strong>AlbumReader</strong>
          <span>Local photo workspace</span>
        </div>
      </div>

      <nav className="sidebar-scroll">
        <div className="workspace-mini">
          <span className="eyebrow">当前工作区</span>
          <button
            type="button"
            className="workspace-mini__button"
            title={workspaceLabel}
          >
            <HardDrive size={15} aria-hidden="true" />
            <span>{workspaceLabel}</span>
            <span className="status-dot" aria-label="已连接" />
          </button>
        </div>

        <div className="nav-section">
          {smartCollections.map((collection) => (
            <button
              type="button"
              key={collection.id}
              className={`nav-row ${activeCollectionId === collection.id ? 'is-active' : ''}`}
              onClick={() => onSelectCollection(collection.id)}
              aria-current={
                activeCollectionId === collection.id ? 'page' : undefined
              }
            >
              <span className="nav-row__icon">
                {collection.id === 'all' ? (
                  <Images size={16} aria-hidden="true" />
                ) : (
                  <Sparkles size={16} aria-hidden="true" />
                )}
              </span>
              <span className="nav-row__label">{collection.name}</span>
              <span className="nav-row__count">
                {counts[collection.id] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <div className="nav-section">
          <div className="section-heading">
            <span>收藏夹与来源</span>
            <span className="section-heading__line" />
          </div>
          {fileCollections.map((collection) => (
            <button
              type="button"
              key={collection.id}
              className={`nav-row nav-row--tall ${activeCollectionId === collection.id ? 'is-active' : ''}`}
              onClick={() => onSelectCollection(collection.id)}
              aria-current={
                activeCollectionId === collection.id ? 'page' : undefined
              }
            >
              <span className="nav-row__icon">
                <CollectionIcon kind={collection.kind} />
              </span>
              <span className="nav-row__body">
                <span className="nav-row__label">{collection.name}</span>
                <span className="nav-row__meta">
                  {collection.sourceLabel ??
                    collectionKindLabel(collection.kind)}
                </span>
              </span>
              <span className="nav-row__count">
                {counts[collection.id] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="storage-track" aria-hidden="true">
          <span />
        </div>
        <div className="storage-copy">
          <span>本地索引</span>
          <strong>演示数据</strong>
        </div>
        <p>真实文件扫描将在核心层接入。</p>
      </div>
    </aside>
  );
}

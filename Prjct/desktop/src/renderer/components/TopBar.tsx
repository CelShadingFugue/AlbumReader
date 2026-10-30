import { FolderOpen, Moon, Search, Sun } from 'lucide-react';
import type { RefObject } from 'react';
import type { CatalogCollection, ThemeMode } from '../domain/catalog';

interface TopBarProps {
  activeCollection: CatalogCollection;
  query: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
  theme: ThemeMode;
  workspacePath: string | null;
  onQueryChange: (value: string) => void;
  onToggleTheme: () => void;
  onPickWorkspace: () => void;
}

export function TopBar({
  activeCollection,
  query,
  searchInputRef,
  theme,
  workspacePath,
  onQueryChange,
  onToggleTheme,
  onPickWorkspace,
}: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar-location">
        <span className="topbar-location__parent">图库</span>
        <span className="topbar-location__slash">/</span>
        <strong>{activeCollection.name}</strong>
        <span className="path-pill" title={workspacePath ?? '尚未选择工作区'}>
          {workspacePath ?? '未选择工作区'}
        </span>
      </div>

      <label className="search-field">
        <Search size={17} aria-hidden="true" />
        <input
          ref={searchInputRef}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="搜索文件名、标题或来源…"
          aria-label="搜索图片"
        />
        <kbd>{navigator.platform.includes('Mac') ? '⌘ K' : 'Ctrl K'}</kbd>
      </label>

      <div className="topbar-actions">
        <button
          type="button"
          className="icon-button"
          onClick={onToggleTheme}
          title="切换主题"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          <span className="sr-only">切换主题</span>
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={onPickWorkspace}
        >
          <FolderOpen size={16} aria-hidden="true" />
          打开工作区
        </button>
      </div>
    </header>
  );
}

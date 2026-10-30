import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Gallery } from './components/Gallery';
import { Inspector } from './components/Inspector';
import { Lightbox } from './components/Lightbox';
import { Sidebar } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';
import { TopBar } from './components/TopBar';
import { mockCollections, mockPhotos } from './data/mockCatalog';
import type { CatalogPhoto, ThemeMode, ViewMode } from './domain/catalog';
import { fileNameFromPath } from './lib/format';

const getInitialTheme = (): ThemeMode => {
  const stored = localStorage.getItem('albumreader.theme');
  return stored === 'light' ? 'light' : 'dark';
};

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeCollectionId, setActiveCollectionId] = useState('all');
  const [query, setQuery] = useState('');
  const [workspacePath, setWorkspacePath] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    mockPhotos[0]?.id ?? null,
  );
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState(
    () =>
      new Set(
        mockPhotos.filter((photo) => photo.favorite).map((photo) => photo.id),
      ),
  );

  const searchInputRef = useRef<HTMLInputElement>(null);
  const toastTimerRef = useRef<number | undefined>(undefined);

  const photos = useMemo(
    () =>
      mockPhotos.map((photo) => ({
        ...photo,
        favorite: favoriteIds.has(photo.id),
      })),
    [favoriteIds],
  );

  const counts = useMemo(() => {
    const next: Record<string, number> = {
      all: photos.length,
      favorites: photos.filter((photo) => photo.favorite).length,
    };

    for (const collection of mockCollections) {
      if (collection.kind !== 'smart') {
        next[collection.id] = photos.filter(
          (photo) => photo.collectionId === collection.id,
        ).length;
      }
    }

    return next;
  }, [photos]);

  const activePhotos = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const byCollection = photos.filter((photo) => {
      if (activeCollectionId === 'all') return true;
      if (activeCollectionId === 'favorites') return photo.favorite;
      return photo.collectionId === activeCollectionId;
    });

    if (!normalizedQuery) return byCollection;

    return byCollection.filter((photo) =>
      [photo.title, photo.name, photo.archiveName, photo.format]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase().includes(normalizedQuery)),
    );
  }, [activeCollectionId, photos, query]);

  const activeCollection =
    mockCollections.find(
      (collection) => collection.id === activeCollectionId,
    ) ?? mockCollections[0]!;
  const selectedPhoto = photos.find((photo) => photo.id === selectedId) ?? null;
  const previewPhoto = photos.find((photo) => photo.id === previewId) ?? null;
  const previewIndex = previewPhoto
    ? activePhotos.findIndex((photo) => photo.id === previewPhoto.id)
    : -1;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('albumreader.theme', theme);
  }, [theme]);

  useEffect(() => {
    if (
      activePhotos.length > 0 &&
      !activePhotos.some((photo) => photo.id === selectedId)
    ) {
      setSelectedId(activePhotos[0]!.id);
    }
    if (activePhotos.length === 0 && selectedId !== null) {
      setSelectedId(null);
    }
  }, [activePhotos, selectedId]);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3400);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handlePickWorkspace = async () => {
    try {
      const path = await window.albumReader?.pickWorkspace();
      if (path) {
        setWorkspacePath(path);
        notify('工作区已选择。目录扫描接口将在核心层接入后启用。');
      }
    } catch {
      notify('无法打开文件夹选择器，请检查 Electron 主进程。');
    }
  };

  const handleSelectCollection = (collectionId: string) => {
    setActiveCollectionId(collectionId);
    setQuery('');
  };

  const handleToggleFavorite = (photoId: string) => {
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (next.has(photoId)) next.delete(photoId);
      else next.add(photoId);
      return next;
    });
  };

  const handleOpenPhoto = (photo: CatalogPhoto) => setPreviewId(photo.id);

  const handlePrevious = () => {
    if (previewIndex > 0) setPreviewId(activePhotos[previewIndex - 1]!.id);
  };

  const handleNext = () => {
    if (previewIndex >= 0 && previewIndex < activePhotos.length - 1) {
      setPreviewId(activePhotos[previewIndex + 1]!.id);
    }
  };

  return (
    <div className="app-shell">
      <TopBar
        activeCollection={activeCollection}
        query={query}
        searchInputRef={searchInputRef}
        theme={theme}
        workspacePath={workspacePath}
        onQueryChange={setQuery}
        onToggleTheme={() =>
          setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
        }
        onPickWorkspace={handlePickWorkspace}
      />

      <div className="app-body">
        <Sidebar
          collections={mockCollections}
          activeCollectionId={activeCollectionId}
          counts={counts}
          workspaceLabel={
            workspacePath ? fileNameFromPath(workspacePath) : '示例工作区'
          }
          onSelectCollection={handleSelectCollection}
        />
        <Gallery
          photos={activePhotos}
          selectedId={selectedId}
          viewMode={viewMode}
          onSelect={(photo) => setSelectedId(photo.id)}
          onOpen={handleOpenPhoto}
          onViewModeChange={setViewMode}
        />
        <Inspector
          photo={selectedPhoto}
          onOpen={handleOpenPhoto}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>

      <StatusBar
        photo={selectedPhoto}
        visibleCount={activePhotos.length}
        platform={window.albumReader?.platform ?? 'web'}
      />

      {previewPhoto && (
        <Lightbox
          photo={previewPhoto}
          hasPrevious={previewIndex > 0}
          hasNext={previewIndex >= 0 && previewIndex < activePhotos.length - 1}
          onClose={() => setPreviewId(null)}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}

      {toast && (
        <div className="toast" role="status">
          <span className="toast__dot" />
          {toast}
        </div>
      )}
    </div>
  );
}

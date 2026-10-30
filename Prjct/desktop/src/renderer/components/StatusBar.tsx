import { CircleDot, Images } from 'lucide-react';
import type { CatalogPhoto } from '../domain/catalog';

interface StatusBarProps {
  photo: CatalogPhoto | null;
  visibleCount: number;
  platform: string;
}

export function StatusBar({ photo, visibleCount, platform }: StatusBarProps) {
  return (
    <footer className="statusbar">
      <div className="statusbar__group">
        <CircleDot size={11} aria-hidden="true" />
        <span>
          {platform === 'win32' ? '桌面前端原型' : 'Desktop prototype'}
        </span>
        <span className="statusbar__separator" />
        <span>渲染进程已隔离</span>
      </div>
      <div className="statusbar__group">
        {photo && <span className="statusbar__filename">{photo.name}</span>}
        <span className="statusbar__separator" />
        <Images size={12} aria-hidden="true" />
        <span>{visibleCount} 张</span>
      </div>
    </footer>
  );
}

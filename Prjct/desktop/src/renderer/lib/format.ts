export function formatBytes(bytes: number): string {
  if (bytes < 1_000_000) {
    return `${Math.max(1, Math.round(bytes / 1000))} KB`;
  }

  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

export function fileNameFromPath(value: string): string {
  const segments = value.split(/[\\/]/).filter(Boolean);
  return segments.at(-1) ?? value;
}

export function collectionKindLabel(
  kind: 'smart' | 'folder' | 'archive',
): string {
  if (kind === 'archive') return '压缩包';
  if (kind === 'folder') return '文件夹';
  return '智能集合';
}

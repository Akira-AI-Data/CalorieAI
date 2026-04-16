'use client';

import { X, FileText, Image } from 'lucide-react';
import { FileAttachment } from '@/types';

interface FilePreviewProps {
  files: FileAttachment[];
  onRemove: (id: string) => void;
}

export function FilePreview({ files, onRemove }: FilePreviewProps) {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 pt-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-2 pl-3 pr-1 py-1.5 bg-sidebar-bg rounded-lg text-sm group"
        >
          {file.type.startsWith('image/') ? (
            <Image className="w-4 h-4 text-muted flex-shrink-0" />
          ) : (
            <FileText className="w-4 h-4 text-muted flex-shrink-0" />
          )}
          <span className="truncate max-w-[150px] text-foreground">{file.name}</span>
          <span className="text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(0)}KB
          </span>
          <button
            onClick={() => onRemove(file.id)}
            className="p-1 rounded hover:bg-sidebar-hover transition-colors"
          >
            <X className="w-3.5 h-3.5 text-muted" />
          </button>
        </div>
      ))}
    </div>
  );
}

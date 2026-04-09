export type FolderType = "Internal training" | "Customer training" | "Archived training";

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  rootType: "internal" | "customer" | "archived";
  createdAt: string;
  isSystemFolder?: boolean;
}

export interface Asset {
  id: string;
  name: string;
  folderId: string;
  fileSize: number;
  mimeType: string;
  url: string;
  createdAt: string;
}

export interface HistoryEntry {
  version: string;
  date: string;
  size: string;
  pushedToCourses?: string[]; // IDs of courses this version was pushed to
}

export interface FileItem {
  id: string;
  name?: string;
  title?: string;
  type: string;
  folderId: string;
  createdAt?: string;
  size?: string;
  version?: string;
  status?: string;
  usedIn?: number;
  views?: number;
  completionRate?: string;
  history?: HistoryEntry[];
  url?: string;
  tags?: string[];
  description?: string;
}

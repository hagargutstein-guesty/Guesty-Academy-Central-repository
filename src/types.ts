export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  isSystemFolder: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  children?: Folder[];
}

export interface Asset {
  id: string;
  name: string;
  url: string | null;
  folderId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    // In a real app, these would be set after login
    "x-tenant-id": "default-tenant",
    "x-user-id": "default-user",
  },
});

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  rootType: "internal" | "customer";
  createdAt: string;
}

export interface File {
  id: string;
  name: string;
  folderId: string;
  fileSize: number;
  mimeType: string;
  s3Key: string;
  createdAt: string;
}

export const repositoryApi = {
  seed: () => api.post("/seed"),
  
  getItems: (params: { parentId?: string; rootType: string; search?: string }) =>
    api.get<{ folders: Folder[]; files: File[] }>("/repository", { params }),
    
  createFolder: (data: { name: string; parentId: string; rootType: string }) =>
    api.post<Folder>("/folders", data),
    
  renameItem: (type: "folders" | "files", id: string, name: string) =>
    api.patch(`/${type}/${id}`, { name }),
    
  moveItem: (type: "folders" | "files", id: string, parentId: string) =>
    api.patch(`/${type}/${id}`, { parentId }),
    
  deleteFolder: (id: string) => api.delete(`/folders/${id}`),
  
  deleteFile: (id: string) => api.delete(`/files/${id}`),
  
  getUploadUrl: (data: {
    fileName: string;
    folderId: string;
    rootType: string;
    mimeType: string;
    fileSize: number;
  }) => api.post<{ uploadUrl: string; fileId: string; s3Key: string }>("/files/upload-url", data),
  
  getDownloadUrl: (id: string) =>
    api.get<{ downloadUrl: string }>(`/files/${id}/download-url`),
    
  getBreadcrumbs: (folderId: string) =>
    api.get<Folder[]>(`/folders/${folderId}/breadcrumbs`),
};

export default api;

export const ROOT_FOLDERS = [
  "Internal training",
  "Customer training",
  "Archived training"
] as const;

export type RootFolderType = typeof ROOT_FOLDERS[number];

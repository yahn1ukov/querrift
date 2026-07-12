export interface FileRepository {
  importFromFile: (path: string) => Promise<void>
  exportToFile: (path: string) => Promise<void>
}

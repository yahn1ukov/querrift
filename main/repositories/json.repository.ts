import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export interface IJSONRepository {
  importFromFile: (path: string) => Promise<void>
  exportToFile: (path: string) => Promise<void>
}

export abstract class JSONRepository {
  protected constructor(protected readonly path: string) {}

  protected async ensureDir(): Promise<void> {
    await mkdir(dirname(this.path), {
      recursive: true,
    })
  }

  protected async read<T>(): Promise<T | null> {
    try {
      const raw = await readFile(this.path, 'utf-8')

      return JSON.parse(raw) as T
    }
    catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        return null
      }

      throw err
    }
  }

  protected async write<T>(data: T): Promise<void> {
    await this.ensureDir()

    await writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8')
  }
}

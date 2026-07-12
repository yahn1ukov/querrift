import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { Mutex } from '@main/utils/mutex'

export abstract class JSONRepository {
  private readonly mutex = new Mutex()

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

    const tempPath = `${this.path}.${process.pid}.tmp`

    await writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8')

    try {
      await rename(tempPath, this.path)
    }
    catch (err: unknown) {
      await unlink(tempPath).catch(() => {})

      throw err
    }
  }

  protected async mutate<T>(operation: () => Promise<T>): Promise<T> {
    return this.mutex.run(operation)
  }
}

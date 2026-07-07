import { ipcMain } from 'electron'

export class SecureStorage {
  private storage = new Map<string, string>()

  async get(key: string): Promise<string | null> {
    return this.storage.get(key) || null
  }

  async set(key: string, value: string): Promise<void> {
    this.storage.set(key, value)
  }

  async delete(key: string): Promise<void> {
    this.storage.delete(key)
  }
}

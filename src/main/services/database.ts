import { ipcMain } from 'electron'

export class DatabaseService {
  async initialize(): Promise<void> {
    console.log('Database initialized')
  }

  async query(sql: string, params?: unknown[]): Promise<any[]> {
    console.log('Query:', sql, params)
    return []
  }

  async insert(table: string, data: Record<string, unknown>): Promise<{ id: string }> {
    console.log('Insert:', table, data)
    return { id: '1' }
  }

  async update(table: string, id: string, data: Record<string, unknown>): Promise<{ id: string }> {
    console.log('Update:', table, id, data)
    return { id }
  }

  async delete(table: string, id: string): Promise<void> {
    console.log('Delete:', table, id)
  }
}

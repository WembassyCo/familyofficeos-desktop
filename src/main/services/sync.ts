import { DatabaseService } from './database'

export class SyncEngine {
  constructor(private database: DatabaseService) {}

  async getStatus(): Promise<{ lastSync: string; pending: number }> {
    return { lastSync: new Date().toISOString(), pending: 0 }
  }

  async forceSync(): Promise<{ success: boolean }> {
    console.log('Force sync triggered')
    return { success: true }
  }

  async queueOperation(operation: unknown): Promise<{ success: boolean }> {
    console.log('Queue operation:', operation)
    return { success: true }
  }
}

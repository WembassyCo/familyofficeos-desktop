export class AutoUpdateService {
  async checkForUpdates(): Promise<void> {
    console.log('Checking for updates')
  }

  async installUpdate(): Promise<{ success: boolean }> {
    console.log('Installing update')
    return { success: true }
  }
}

import { Notification } from 'electron'

export class NotificationService {
  async show(options: { title: string; body: string }): Promise<void> {
    const notification = new Notification(options)
    notification.show()
  }
}

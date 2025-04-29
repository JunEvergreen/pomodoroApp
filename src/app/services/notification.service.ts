import { Injectable } from '@angular/core';
import { Haptics } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications'; // Import LocalNotifications

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  // Trigger a 5-second vibration
  async triggerHaptics() {
    try {
      // Vibrate for 5 seconds (5000ms)
      await Haptics.vibrate({ duration: 5000 });
    } catch (error) {
      console.error('Haptics error:', error);
    }
  }

  // Schedule a local notification
  async scheduleNotification(title: string, body: string) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: body,
            id: new Date().getTime(),
            schedule: { at: new Date(new Date().getTime() + 1000) }, // 1 second delay
            sound: 'default',
            smallIcon: 'ic_launcher',
          },
        ],
      });
    } catch (error) {
      console.error('Notification error:', error);
    }
  }
}
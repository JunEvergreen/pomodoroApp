import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NotificationService } from '../services/notification.service';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: false,
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  currentTime: string = '';
  timerDisplay: string = '00:10';
  cyclesCompleted: number = 0;
  isPomodoroRunning: boolean = false;
  timer: any; 

  constructor(private platform: Platform, private notificationService: NotificationService) {}

  ngOnInit() {
    this.updateRealTimeClock();
    this.requestNotificationPermission();

    this.platform.backButton.subscribeWithPriority(10, () => {
      navigator['app'].exitApp();
    });
  }


  async requestNotificationPermission() {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display === 'granted') {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  
    const currentPermission = await LocalNotifications.checkPermissions();
    console.log('Current Notification Permission:', currentPermission);
  }

  updateRealTimeClock() {
    setInterval(() => {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString();
    }, 1000);
  }

  startPomodoro() {
    if (this.isPomodoroRunning) return;

    this.isPomodoroRunning = true;
    let timeLeft = 10;

    this.timer = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      this.timerDisplay = `${this.formatTime(minutes)}:${this.formatTime(seconds)}`;

      if (timeLeft === 0) {
        clearInterval(this.timer);
        this.isPomodoroRunning = false;
        this.cyclesCompleted++;
        this.notificationService.triggerHaptics();
        this.notificationService.scheduleNotification('Pomodoro Complete', 'Take a 5-second break!');
        this.startBreak();
      }

      timeLeft--;
    }, 1000);
  }

  startBreak() {
    let breakTimeLeft = 10;

    this.timer = setInterval(() => {
      const minutes = Math.floor(breakTimeLeft / 60);
      const seconds = breakTimeLeft % 60;
      this.timerDisplay = `${this.formatTime(minutes)}:${this.formatTime(seconds)}`;

      if (breakTimeLeft === 0) {
        clearInterval(this.timer);
        this.isPomodoroRunning = false;
        this.notificationService.triggerHaptics();
        this.notificationService.scheduleNotification('Break Over', 'Start a new Pomodoro session!');
        this.timerDisplay = '00:10';
      }

      breakTimeLeft--;
    }, 1000);
  }

  formatTime(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

}
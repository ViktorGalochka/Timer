import { Component } from '@angular/core';
import { Observable, interval, defer, BehaviorSubject } from 'rxjs';
import { mapTo, reduce, take, tap, filter, map, share, withLatestFrom } from 'rxjs/operators'


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  value: number;
  notifications = {};
  keys = [];
  currentValue: any;
  seconds:any;
  addNotification() {
    this.keys = [];
    const subject = new BehaviorSubject<boolean>(false);
    let notification = { id: new Date().getTime(), paused: subject, obs: this.getPausableTimer(Infinity, subject) }
    this.notifications[notification.id] = notification;
    this.keys.push(notification.id);
  }
  
  dismiss(key) {
    this.keys = this.keys.filter(v => v !== key);
    delete this.notifications[key];
  }
  
  

  getPausableTimer(timeout: number, pause: BehaviorSubject<boolean>): { stepTimer: Observable<any>, completeTimer: Observable<any> } {
    const pausableTimer$ = defer(() => {
       this.seconds = 0;
      return interval(1000).pipe(
        withLatestFrom(pause),
        filter(([v, paused]) => !paused),
        take(timeout),
        map(() => {
          this.seconds++;
          return this.currentValue = this.formatValue(this.seconds);
        })
        )
      }).pipe(share());
      return { stepTimer: pausableTimer$, completeTimer: pausableTimer$.pipe(reduce((x, y) => y)) } 
    }

    private formatValue(v) {
      const hours = Math.floor(v / 3600);
      const formattedHours = '' + (hours > 9 ? hours : '0' + hours);
      const minutes = Math.floor(v / 60);
      const formattedMinutes = (minutes > 9 ? minutes : '0' + minutes && minutes < 59 ? '0' + minutes : minutes - 59);
      const seconds = v % 60;
      const formattedSeconds = '' + (seconds > 9 ? seconds : '0' + seconds);
      
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
    
  }
  
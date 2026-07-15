import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { StorageUtil } from '@/utility/StorageUtil';
import { Common } from '@/utility/Common';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  private timeout: any;
  private warningTimeout: any;
  private readonly idleTime = Common.minutesToMilliseconds(30); 
  private readonly warningTime = Common.secondsToMilliseconds(10); 
  private countdownSub?: Subscription;
  private sessionTickerSub?: Subscription;
  private logoutAt: number = 0;

  countdown$ = new Subject<number>();
  showWarning$ = new Subject<boolean>();
  // emits remaining session seconds continuously while the user is active
  sessionRemaining$ = new Subject<number>();
  // emits elapsed session seconds since login
  sessionElapsed$ = new Subject<number>();
  private sessionStart: number = 0;
  private sessionElapsedSub?: Subscription;
  
  private warningActive = false;

  private activityEvents = [
    'mousemove', 'mousedown', 'mouseup', 'click', 'dblclick', 'wheel', 'scroll',
    'touchstart', 'touchmove', 'touchend',
    'keydown', 'keyup', 'keypress',
    'focus', 'blur', 'resize',
    'pointermove', 'pointerdown', 'pointerup',
    'visibilitychange'
  ];

  constructor(private router: Router, private ngZone: NgZone) {
    // if a session start timestamp was persisted (user refreshed), restore it
    const persisted = StorageUtil.getItem<number>('sessionStart');
    if (persisted) {
      this.sessionStart = persisted;
      this.startSessionElapsedTicker();
    }
    this.startWatching();
  }

  startWatching() {
    this.activityEvents.forEach(event => {
      window.addEventListener(event, () => this.handleUserActivity());
    });
    this.resetTimer();
  }

  stopWatching() {
  this.activityEvents.forEach(event => {
    window.removeEventListener(event, () => this.handleUserActivity());
  });
  clearTimeout(this.timeout);
  clearTimeout(this.warningTimeout);
  this.stopCountdown();
  this.stopSessionTicker();
  this.stopSessionElapsedTicker();
  this.warningActive = false;
  this.showWarning$.next(false);
}



  private handleUserActivity() {
    if (!this.warningActive) {
      this.resetTimer();
    }
  }

  resetTimer() {
    clearTimeout(this.timeout);
    clearTimeout(this.warningTimeout);
    this.showWarning$.next(false);
    this.warningActive = false;
    this.stopCountdown();
    this.stopSessionTicker();

    // set logout timestamp and start session ticker
    this.logoutAt = Date.now() + this.idleTime;
    this.startSessionTicker();

    this.timeout = setTimeout(() => this.logoutUser(), this.idleTime);
    this.warningTimeout = setTimeout(() => this.showWarningCountdown(), this.idleTime - this.warningTime);
  }

  // mark session start time (call this after successful login)
  markSessionStart(startTimeMs?: number) {
    this.sessionStart = startTimeMs ?? Date.now();
    // persist so refresh keeps elapsed timer
    StorageUtil.setItem('sessionStart', this.sessionStart);
    this.startSessionElapsedTicker();
  }

  private startSessionElapsedTicker() {
    this.stopSessionElapsedTicker();
    // emit elapsed seconds since sessionStart every second
    this.sessionElapsedSub = interval(1000).subscribe(() => {
      if (!this.sessionStart) {
        this.sessionElapsed$.next(0);
        return;
      }
      const elapsedSec = Math.floor((Date.now() - this.sessionStart) / 1000);
      this.sessionElapsed$.next(elapsedSec);
    });
  }

  private stopSessionElapsedTicker() {
    this.sessionElapsedSub?.unsubscribe();
    this.sessionElapsedSub = undefined;
    this.sessionElapsed$.next(0);
  }

  private showWarningCountdown() {
    this.warningActive = true;
    this.showWarning$.next(true);
    this.startCountdown(10);
  }

  private startCountdown(seconds: number) {
    this.countdownSub = interval(1000).pipe(take(seconds + 1)).subscribe({
      next: value => {
        const remaining = seconds - value;
        this.countdown$.next(remaining);

        if (remaining <= 0) {
          this.logoutUser();
        }
      }
    });
  }

  private stopCountdown() {
    this.countdownSub?.unsubscribe();
  }

  private startSessionTicker() {
    // emit remaining seconds every second until stopped
    this.sessionTickerSub = interval(1000).subscribe(() => {
      const remainingMs = Math.max(0, this.logoutAt - Date.now());
      const remainingSec = Math.ceil(remainingMs / 1000);
      this.sessionRemaining$.next(remainingSec);
      if (remainingSec <= 0) {
        this.stopSessionTicker();
      }
    });
  }

  private stopSessionTicker() {
    this.sessionTickerSub?.unsubscribe();
    this.sessionTickerSub = undefined;
    this.sessionRemaining$.next(0);
  }

  stayLoggedIn() {
    this.warningActive = false;
    this.showWarning$.next(false);
    this.resetTimer();
  }

  logoutUser() {
    this.stopCountdown();
    this.showWarning$.next(false);
    this.warningActive = false;
    // clear only session-related storage; preserve other app data if needed
    StorageUtil.removeItem('sessionStart');
    StorageUtil.removeItem('user');
    localStorage.removeItem('userSessionExpiry');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('selectedBrand');
    this.router.navigate(['/login']);
  }
}

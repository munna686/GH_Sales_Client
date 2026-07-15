// spinner.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  private _spinner$ = new BehaviorSubject<boolean>(false);
  spinner$ = this._spinner$.asObservable();

  constructor(private ngxSpinner: NgxSpinnerService) {}

  show() { 
    this._spinner$.next(true);
    this.ngxSpinner.show();
  }
  
  hide() { 
    this._spinner$.next(false);
    this.ngxSpinner.hide();
  }
}

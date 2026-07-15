import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy.service';
import { delay, finalize } from 'rxjs';
import { SpinnerService } from '@/services/spinner.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);
  const spinnerService = inject(SpinnerService);
  
  // Show spinner
  busyService.busy();
  spinnerService.show();
  
  return next(req).pipe(
    finalize(() => {
      busyService.idle();
      spinnerService.hide();
    })
  );
};
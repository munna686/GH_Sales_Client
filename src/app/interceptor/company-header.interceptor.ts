import { HttpInterceptorFn } from '@angular/common/http';
import { StorageUtil } from '@/utility/StorageUtil';

const COMPANY_ID_HEADER = 'X-Company-Id';

export const companyHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const companyId = StorageUtil.getCompanyId().toString();

  const requestWithCompanyHeader = req.clone({
    setHeaders: {
      [COMPANY_ID_HEADER]: companyId,
      
    }
  });

  return next(requestWithCompanyHeader);
};

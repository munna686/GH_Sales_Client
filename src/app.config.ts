import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import Nora from '@primeuix/themes/nora';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { loadingInterceptor } from '@/interceptor/loading.interceptor';
import { companyHeaderInterceptor } from '@/interceptor/company-header.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withEnabledBlockingInitialNavigation()
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([companyHeaderInterceptor, loadingInterceptor]) 
    ),
    importProvidersFrom(
      NgxSpinnerModule.forRoot()
    ),
    provideAnimationsAsync(), 
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } })
    
  ]
};
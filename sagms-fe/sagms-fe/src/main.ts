import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideHttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideAuth0({
      domain: 'dev-wq7kgbrb43seerv2.us.auth0.com',
      clientId: 'lOpta3tHh8yY0xSZLlF8cXTq7FNYlpL0',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
    provideHttpClient(),
    appConfig.providers,
  ],
}).catch((err) => console.error(err));

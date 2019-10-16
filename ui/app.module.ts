import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomFormsModule } from 'ng2-validation';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ApiModule, Configuration, PydtSharedModule, ProfileCacheService } from 'pydt-shared';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthComponent } from './auth/auth.component';
import { GameComponent } from './home/game.component';
import { GamePlayers } from './home/game.players';
import { HomeComponent } from './home/home.component';
import { PlayTurnComponent } from './playTurn/playTurn.component';
import { PlayTurnState } from './playTurn/playTurnState.service';
import { RollbarErrorHandler, rollbarFactory, RollbarService } from './rollbarErrorHandler';
import { AuthService } from './shared/authService';
import { PydtHttpInterceptor } from './shared/pydtHttpInterceptor';
import { MarkdownModule } from 'ngx-markdown';

export function configFactory() {
  return new Configuration({
    apiKeys: {},
    basePath: PYDT_CONFIG.API_URL
  });
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomFormsModule,
    ApiModule.forRoot(configFactory),
    FormsModule,
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    PydtSharedModule,
    routing,
    MarkdownModule.forRoot()
  ],
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    GameComponent,
    PlayTurnComponent,
    GamePlayers
  ],
  providers: [
    ProfileCacheService,
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
    { provide: RollbarService, useFactory: rollbarFactory },
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: PydtHttpInterceptor, multi: true },
    PlayTurnState
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

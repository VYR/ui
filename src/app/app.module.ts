import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { ConfigService } from './configuration';
import { CacheService } from './cache/cache.service';
import { TranslationModule } from './shared/translation/translation.module';
import { HttpCoreModule } from './http-core';
import { UtilityModule } from './utility';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CibComponentsModule } from './cib-components/cib-components.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

registerLocaleData(en);

// AoT requires an exported function for configuration
export function configLoaderFactory(config: ConfigService): any {
    return () => config.load();
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        NgxSpinnerModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        TranslationModule,
        HttpCoreModule,
        UtilityModule,
        CibComponentsModule,
        MatAutocompleteModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: configLoaderFactory,
            deps: [ConfigService],
            multi: true,
        },
        CacheService,
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [NgxSpinnerModule],
})
export class AppModule {}

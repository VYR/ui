import { NgModule } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';

import { EncryptDecryptService } from './encrypt-decrypt.service';
import { UtilService } from './utility.service';
import { ValidationService } from './validation.service';

@NgModule({
    imports: [ToastrModule.forRoot()],
    providers: [UtilService, ValidationService, EncryptDecryptService, JwtHelperService],
})
export class UtilityModule {}

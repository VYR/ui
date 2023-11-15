import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionalAccountsRoutingModule } from './transactional-accounts-routing.module';
import { TransactionalAccountsComponent } from './transactional-accounts.component';

@NgModule({
    declarations: [TransactionalAccountsComponent],
    imports: [CommonModule, TransactionalAccountsRoutingModule],
})
export class TransactionalAccountsModule {}

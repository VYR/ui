import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CIBTableConfig, CIBTableQuery, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { USER_TABLE_COLUMNS } from '../constants/meta-data';
import { DECISION } from 'src/app/shared/enums';
import { SgsUpdateUserComponent } from '../sgs-update-user/sgs-update-user.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';

@Component({
  selector: 'app-sgs-schemes',
  templateUrl: './sgs-schemes.component.html',
  styleUrls: ['./sgs-schemes.component.scss']
})
export class SgsSchemesComponent implements OnInit {

  constructor(private router: Router, private dialog: CibDialogService, private sandbox: HomeSandbox) {}

  ngOnInit(): void {
  }

}

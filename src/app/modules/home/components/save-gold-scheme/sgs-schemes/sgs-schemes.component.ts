import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SGSTableConfig, SGSTableQuery, ColumnType } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
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

  @Input() type='addSchemes';
  constructor(private router: Router, private dialog: SgsDialogService, private sandbox: HomeSandbox) {}

  ngOnInit(): void {
  }

}

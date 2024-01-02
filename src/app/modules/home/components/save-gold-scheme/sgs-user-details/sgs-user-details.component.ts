import { Component, OnInit , Inject} from '@angular/core';
import { HomeSandbox } from '../../../home.sandbox';
import { SgsDialogService } from 'src/app/shared/services/sgs-dialog.service';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/utility';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';

@Component({
  selector: 'app-sgs-user-details',
  templateUrl: './sgs-user-details.component.html',
  styleUrls: ['./sgs-user-details.component.scss']
})
export class SgsUserDetailsComponent implements OnInit {

  DECISION=DECISION;
  constructor(public dialogRef: MatDialogRef<SgsUserDetailsComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sandBox: HomeSandbox,
        private dialog: SgsDialogService,
        private router: Router,
        private utilService: UtilService
    ) {
        console.log(this.data.data);
    }
    ngOnInit(): void {
      console.log(this.data);
    }
}

import { Component,Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';
import { SgsDialogService } from 'src/app/shared/services/sgs-dialog.service';

@Component({
  selector: 'app-sgs-details',
  templateUrl: './sgs-details.component.html',
  styleUrls: ['./sgs-details.component.scss']
})
export class SgsDetailsComponent implements OnInit {
  DECISION=DECISION;  
  constructor(public dialogRef: MatDialogRef<SgsDetailsComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialog: SgsDialogService
  ) 
  {
      console.log(this.data.data);
  }


  ngOnInit(): void {
  }

}

import { Component,Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';
import { SgsDialogService } from 'src/app/shared/services/sgs-dialog.service';
@Component({
  selector: 'app-online-food-view-details',
  templateUrl: './online-food-view-details.component.html',
  styleUrls: ['./online-food-view-details.component.scss']
})
export class OnlineFoodViewDetailsComponent implements OnInit {
  DECISION=DECISION;  
  constructor(public dialogRef: MatDialogRef<OnlineFoodViewDetailsComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialog: SgsDialogService
  ) 
  {
      console.log(this.data.data);
  }


  ngOnInit(): void {
  }

}

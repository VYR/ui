import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';

@Component({
  selector: 'app-online-food-image-selection',
  templateUrl: './online-food-image-selection.component.html',
  styleUrls: ['./online-food-image-selection.component.scss']
})
export class OnlineFoodImageSelectionComponent {
  constructor(
      public dialogRef: MatDialogRef<OnlineFoodImageSelectionComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  DECISION = DECISION;
  getImage(event:any){
    console.log(event);
    this.dialogRef.close({
      decision: DECISION.CONFIRM,
      data: event,
  });
  }
}
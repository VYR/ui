import { Component, Inject, OnInit } from '@angular/core';
import {EditorConfig, ST_BUTTONS} from 'ngx-simple-text-editor'; 
import { DeveloperSandbox } from '../../developer.sandbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder } from '@angular/forms';
import { SgsDialogService } from 'src/app/shared/services/sgs-dialog.service';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/utility';

@Component({
  selector: 'app-site-update-editor',
  templateUrl: './site-update-editor.component.html',
  styleUrls: ['./site-update-editor.component.scss']
})
export class SiteUpdateEditorComponent implements OnInit {

  content  = '';
  config: EditorConfig = {
    placeholder: 'Type something...',
    buttons: ST_BUTTONS,  
  };


  constructor(public dialogRef: MatDialogRef<SiteUpdateEditorComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sandBox: DeveloperSandbox,
    public fb: UntypedFormBuilder,
    private dialog: SgsDialogService, 
    private utilService: UtilService
) 
{
    console.log(this.data.data);
}

  ngOnInit(): void {
  }

}

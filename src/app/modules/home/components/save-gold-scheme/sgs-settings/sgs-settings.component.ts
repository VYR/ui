import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sgs-settings',
  templateUrl: './sgs-settings.component.html',
  styleUrls: ['./sgs-settings.component.scss']
})
export class SgsSettingsComponent implements OnInit {

  settings={
    individualCommission:5,
    groupCommission:15
  }
  constructor() { }

  ngOnInit(): void {
  }

}

import { Component } from '@angular/core';

@Component({
  selector: 'app-referral-amount',
  templateUrl: './referral-amount.component.html',
  styleUrls: ['./referral-amount.component.scss']
})
export class ReferralAmountComponent {

  public menu: Array<any> = [
    {         
      name: 'On Going Referrals',
      path: 'on-going',
    },
    {           
        name: 'Processed Referrals',
        path: 'completed',
    },
    ];

}

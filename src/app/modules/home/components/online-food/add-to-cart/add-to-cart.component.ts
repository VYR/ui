import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss']
})
export class AddToCartComponent implements OnInit {
  @Input() currentValue:any={value:0,item:null};
  @Output() _click=new EventEmitter<any>();
  constructor(private appContext:ApplicationContextService) { 
  }

  ngOnInit(): void {
    //console.log(this.currentValue.value);
  }
  updateCart(type:any){
    if(type==='add')
    this.currentValue.value=this.currentValue.value+1;
    if(type==='sub')
    this.currentValue.value=this.currentValue.value-1;
    this.currentValue.item.cart=this.currentValue.value;
    this._click.emit(this.currentValue);
  }
}

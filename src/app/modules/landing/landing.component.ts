import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  products:Array<any> = [
    {
      name: 'Inventory',
      color: 'card-type-1',
      imagePath: 'inventory.png'
    },
    
    {
      name: 'Online Exams',
      color: 'card-type-2',
      imagePath: 'online-exam.jpg'
    },
    {
      name: 'Stock Market',
      color: 'card-type-3',
      imagePath: 'stock-markets.png'
    },
    {
      name: 'E-Commerce',
      color: 'card-type-4',
      imagePath: 'e-commerce.jpg'
    },
    {
      name: 'Business Sites',
      color: 'card-type-5',
      imagePath: 'business-website.jpg'
    },
    {
      name: 'Personal Sites',
      color: 'card-type-6',
      imagePath: 'personal-sites.webp'
    }
  ];
  constructor() { }

  ngOnInit(): void {
    this.products=this.products.map((item:any) => {item.imagePath = '/assets/images/'+item.imagePath; return item;});
    console.log(this.products);
  }

}

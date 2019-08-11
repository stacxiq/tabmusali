import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'page-stuff-details',
  templateUrl: 'stuff-details.html',
})
export class StuffDetailsPage {

  item: any

  constructor(public router: Router, public navParams: NavParams) {
    this.item = navParams.get('item');
  }

  ngOnInit() {
    console.log('ngOnInit StuffDetailsPage');
  }

}

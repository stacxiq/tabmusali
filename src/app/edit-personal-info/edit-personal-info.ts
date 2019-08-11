import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

/**
 * Generated class for the EditPersonalInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-edit-personal-info',
  templateUrl: 'edit-personal-info.html',
})
export class EditPersonalInfoPage {

  constructor(public router: Router) {
  }

  ngOnInit() {
    console.log('ngOnInit EditPersonalInfoPage');
  }

}

import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NewRegistrationPage } from '../new-registration/new-registration';
import { FixChairPage } from '../fix-chair/fix-chair';

@IonicPage()
@Component({
  selector: 'page-students-form',
  templateUrl: 'students-form.html',
})
export class StudentsFormPage {

  tab1Root = NewRegistrationPage;
  tab2Root = FixChairPage;

  constructor() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentsFormPage');
  }
}

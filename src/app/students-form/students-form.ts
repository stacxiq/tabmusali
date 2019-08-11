import { Component } from '@angular/core';
import { NewRegistrationPage } from '../new-registration/new-registration';
import { FixChairPage } from '../fix-chair/fix-chair';


@Component({
  selector: 'page-students-form',
  templateUrl: 'students-form.html',
})
export class StudentsFormPage {

  tab1Root = NewRegistrationPage;
  tab2Root = FixChairPage;

  constructor() {
  }

  ngOnInit() {
    console.log('ngOnInit StudentsFormPage');
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NewRegistrationPage } from './new-registration';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: NewRegistrationPage
      }
    ])
  ],
  declarations: [NewRegistrationPage]
})
export class NewRegistrationPageModule { }

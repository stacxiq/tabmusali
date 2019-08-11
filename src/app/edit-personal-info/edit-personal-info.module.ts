import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EditPersonalInfoPage } from './edit-personal-info';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: EditPersonalInfoPage
      }
    ])
  ],
  declarations: [EditPersonalInfoPage]
})
export class EditPersonalInfoPageModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NotificationDetailsPage } from './notification-details';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: NotificationDetailsPage
      }
    ])
  ],
  declarations: [NotificationDetailsPage]
})
export class NotificationDetailsPageModule { }

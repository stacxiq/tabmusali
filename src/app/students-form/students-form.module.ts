import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { StudentsFormPage } from './students-form';


const routes: Routes = [
  {
    path: 'students-form',
    component: StudentsFormPage,
    children: [
      { 
       path: 'new-registration',
      
       loadChildren: () => import('../new-registration/new-registration.module').then(m => m.NewRegistrationPageModule) },
      
        { path: 'fix-chair', loadChildren: () => import('../fix-chair/fix-chair.module').then(m => m.FixChairPageModule) },
    ]
  },
  {
      path: '',
      redirectTo: 'students-form/new-registration'        
  
  }

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],

  exports: [RouterModule],
  declarations: [StudentsFormPage]
})
export class StudentsFormPageModule { }

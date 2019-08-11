import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TabsPage } from './tabs';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:
      [
        {
          path: 'home',
          children:
            [
              {
                path: '',
                loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
              }
            ]
        },
        {
          path: 'about',
          children:
            [
              {
                path: '',
                loadChildren: () => import('../about/about.module').then(m => m.AboutPageModule)
              }
            ]
        },
        {
          path: 'contact',
          children:
            [
              {
                path: '',
                loadChildren: () => import('../contact/contact.module').then(m => m.ContactPageModule)
              }
            ]
        },
        {
          path: '',
          redirectTo: '/tabs/home',
          pathMatch: 'full'
        }
      ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule { }

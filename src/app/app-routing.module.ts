import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
  { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutPageModule) },
  { path: 'about-app', loadChildren: () => import('./about-app/about-app.module').then(m => m.AboutAppPageModule) },
  { path: 'about-school', loadChildren: () => import('./about-school/about-school.module').then(m => m.AboutSchoolPageModule) },
  { path: 'absence', loadChildren: () => import('./absence/absence.module').then(m => m.AbsencePageModule) },
  { path: 'acceptance', loadChildren: () => import('./acceptance/acceptance.module').then(m => m.AcceptancePageModule) },
  { path: 'certificate', loadChildren: () => import('./certificate/certificate.module').then(m => m.CertificatePageModule) },
  { path: 'contact', loadChildren: () => import('./contact/contact.module').then(m => m.ContactPageModule) },
  { path: 'degrees', loadChildren: () => import('./degrees/degrees.module').then(m => m.DegreesPageModule) },
  { path: 'details', loadChildren: () => import('./details/details.module').then(m => m.DetailsPageModule) },
  { path: 'edit-person', loadChildren: () => import('./edit-person/edit-person.module').then(m => m.EditPersonPageModule) },
  { path: 'edit-personal-info', loadChildren: () => import('./edit-personal-info/edit-personal-info.module').then(m => m.EditPersonalInfoPageModule) },
  { path: 'employee', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeePageModule) },
  { path: 'exams', loadChildren: () => import('./exams/exams.module').then(m => m.ExamsPageModule) },
  { path: 'fix-chair', loadChildren: () => import('./fix-chair/fix-chair.module').then(m => m.FixChairPageModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'installments', loadChildren: () => import('./installments/installments.module').then(m => m.InstallmentsPageModule) },
  { path: 'new-registration', loadChildren: () => import('./new-registration/new-registration.module').then(m => m.NewRegistrationPageModule) },
  { path: 'notification', loadChildren: () => import('./notification/notification.module').then(m => m.NotificationPageModule) },
  { path: 'notification-details', loadChildren: () => import('./notification-details/notification-details.module').then(m => m.NotificationDetailsPageModule) },
  { path: 'read-info', loadChildren: () => import('./read-info/read-info.module').then(m => m.ReadInfoPageModule) },
  { path: 'send-message', loadChildren: () => import('./send-message/send-message.module').then(m => m.SendMessagePageModule) },
  { path: 'student-info', loadChildren: () => import('./student-info/student-info.module').then(m => m.StudentInfoPageModule) },
  { path: 'students', loadChildren: () => import('./students/students.module').then(m => m.StudentsPageModule) },
  { path: 'students-form', loadChildren: () => import('./students-form/students-form.module').then(m => m.StudentsFormPageModule) },
  { path: 'stuff', loadChildren: () => import('./stuff/stuff.module').then(m => m.StuffPageModule) },
  { path: 'stuff-details', loadChildren: () => import('./stuff-details/stuff-details.module').then(m => m.StuffDetailsPageModule) },
  { path: 'stuff-list', loadChildren: () => import('./stuff-list/stuff-list.module').then(m => m.StuffListPageModule) },
  { path: 'table', loadChildren: () => import('./table/table.module').then(m => m.TablePageModule) },
  { path: 'tabs', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

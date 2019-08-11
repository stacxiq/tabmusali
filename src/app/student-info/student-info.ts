import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Config } from 'ionic-angular';
import { TablePage } from '../table/table';
import { AbsencePage } from '../absence/absence';
import { ExamsPage } from '../exams/exams';
import { DegreesPage } from '../degrees/degrees';
import { Events } from '@ionic/angular';	


@IonicPage()
@Component({
  selector: 'page-student-info',
  templateUrl: 'student-info.html',
})
export class StudentInfoPage {
  
  tab1Root = DegreesPage;
  tab2Root = ExamsPage;
  tab3Root = AbsencePage;
  tab4Root = TablePage;

  public student:any;

  constructor(public router: Router, public navParams: NavParams, 
    public config: Config, public events: Events) {

    this.config.set('tabsHideOnSubPages', false);

    this.student = navParams.get('student');

    events.publish('stu:created', this.student, Date.now());
  }
}

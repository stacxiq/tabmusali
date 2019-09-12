import { Component } from '@angular/core';
import { NavParams, Config } from '@ionic/angular';
import { TablePage } from '../table/table';
import { AbsencePage } from '../absence/absence';
import { ExamsPage } from '../exams/exams';
import { DegreesPage } from '../degrees/degrees';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'page-student-info',
  templateUrl: 'student-info.html',
})
export class StudentInfoPage {

  tab1Root = DegreesPage;
  tab2Root = ExamsPage;
  tab3Root = AbsencePage;
  tab4Root = TablePage;

  public student: any;

  constructor(public router: Router, public navParams: NavParams,
    public config: Config, public events: Events, private storage: Storage) {

    this.student = navParams.get('student');
    //this.student = this.storage.set('selected');
    events.publish('stu:created', this.student, Date.now());
  }
}

import { Component } from '@angular/core';
import { NavParams, AlertController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Events } from '@ionic/angular';
import { window } from 'rxjs/operator/window';
import { InstallmentsPage } from '../installments/installments';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { Badge } from '@ionic-native/badge/ngx';

@IonicPage()
@Component({
  selector: 'page-table',
  templateUrl: 'table.html',
})
export class TablePage {

  public items:any[];
  public students:any[];
  public lessons:any[];
  public installments:any[];

  public participant_id:number;
  public username:string = '';
  public password:string = '';

  public saturday1:string = '';
  public saturday2:string = '';
  public saturday3:string = '';
  public saturday4:string = '';
  public saturday5:string = '';
  public saturday6:string = '';
  public saturday7:string = '';

  public sunday1:string = '';
  public sunday2:string = '';
  public sunday3:string = '';
  public sunday4:string = '';
  public sunday5:string = '';
  public sunday6:string = '';
  public sunday7:string = '';

  public monday1:string = '';
  public monday2:string = '';
  public monday3:string = '';
  public monday4:string = '';
  public monday5:string = '';
  public monday6:string = '';
  public monday7:string = '';

  public tuesday1:string = '';
  public tuesday2:string = '';
  public tuesday3:string = '';
  public tuesday4:string = '';
  public tuesday5:string = '';
  public tuesday6:string = '';
  public tuesday7:string = '';

  public wednesday1:string = '';
  public wednesday2:string = '';
  public wednesday3:string = '';
  public wednesday4:string = '';
  public wednesday5:string = '';
  public wednesday6:string = '';
  public wednesday7:string = '';

  public thursday1:string = '';
  public thursday2:string = '';
  public thursday3:string = '';
  public thursday4:string = '';
  public thursday5:string = '';
  public thursday6:string = '';
  public thursday7:string = '';

  isLoggedIn:boolean = false;
  isDelayed:boolean = false;  
  isLoaded:boolean = false;
  value:string = '';
  isConnected:boolean = true;

  constructor(public router: Router, public navParams: NavParams, 
    private http: HttpClient, private storage: Storage, private fcm: FCM, private badge: Badge,
    private nativeAudio: NativeAudio, private alertCtrl: AlertController,
    public platform: Platform, public events: Events, private network: Network, 
    private sqlite: SQLite) {

    setInterval(() => {
      this.storage.get('isConnected').then((val) => {
        if (val) {
          this.isConnected = true;
        } else {
          this.isConnected = false;
        }
      });

      this.storage.get('selected').then((val) => {
        if (val != '' && val != null) {
          this.value = val;      
        } 
      });

    }, 1000);

    if (this.isConnected) {
      this.loadStudentData(this.navParams.data)
    } else {
      this.loadStudentData(this.value);
    }
    
    if (platform.is('cordova')) {
      nativeAudio.preloadSimple('uniqueId1', 'assets/sound/demo.mp3').then(() => {
        // alert('okay');
      }, (err) => {
        // alert(err);
      });

      this.fcm.onNotification().subscribe(data => {
        if(data.wasTapped){
          // alert("Received in background");
        } else {
          // alert("Received in foreground");
          // this.presentAlert(data.notification.title, data.notification.body);
        }

        this.increaseBadges(1);
      });
    }

    storage.get('isLoggedIn').then((val) => {
      console.log('val is', val);
      
      if (val == 'true') {
        this.isLoggedIn = true;
      }
    });
  }

  ionViewDidLoad() {
    this.checkNetwork();
  }

  checkNetwork() {
    document.addEventListener('online', () => {
      this.storage.set('isConnected', true);
    }, false);

    document.addEventListener('offline', () => {
      this.storage.set('isConnected', false);
    }, false);
  }

  async increaseBadges(counter: number) {
    try {
      let badges = await this.badge.increase(Number(counter));
      console.log(badges);
    } catch (error) {
      console.log(error);
    }
  }

  async presentAlert(title, body) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: '<div dir="rtl">' + body + '</div>',
      buttons: ['رجوع']
    });
    await alert.present();
    this.nativeAudio.play('uniqueId1').then(() => {}, () => {});
  }

  loadStudentData(data) {
    this.lessons = data.student.lessons;
    this.installments = data.student.installment;
    this.storage.set('sname', data.student.name);
    this.storage.set('stage', data.student.class);
    this.storage.set('group', data.student.class_group);
    // this.storage.set('st_data', data);

    for (var j = 0; j < this.installments.length; j++) {
      if (this.installments[j].status == 'غير مدفوع') {
        this.isDelayed = true;
        break;
      } else {
        this.isDelayed = false;
      }
    }

    for (var j = 0; j < this.lessons.length; j++) {
      this.saturday1 = this.lessons[j].saturday_1;
      this.saturday2 = this.lessons[j].saturday_2;
      this.saturday3 = this.lessons[j].saturday_3;
      this.saturday4 = this.lessons[j].saturday_4;
      this.saturday5 = this.lessons[j].saturday_5;
      this.saturday6 = this.lessons[j].saturday_6;
      this.saturday7 = this.lessons[j].saturday_7;

      if (this.lessons[j].saturday_1 == '' && this.lessons[j].saturday_2 == ''
          && this.lessons[j].saturday_3 == '' && this.lessons[j].saturday_4 == ''
          && this.lessons[j].saturday_5 == '' && this.lessons[j].saturday_6 == ''
          && this.lessons[j].saturday_7 == '') {
            this.saturday1 = '-';
            this.saturday2 = '-';
            this.saturday3 = '-';
            this.saturday4 = '-';
            this.saturday5 = '-';
            this.saturday6 = '-';
            this.saturday7 = '-';
          }

      this.sunday1 = this.lessons[j].sunday_1;
      this.sunday2 = this.lessons[j].sunday_2;
      this.sunday3 = this.lessons[j].sunday_3;
      this.sunday4 = this.lessons[j].sunday_4;
      this.sunday5 = this.lessons[j].sunday_5;
      this.sunday6 = this.lessons[j].sunday_6;
      this.sunday7 = this.lessons[j].sunday_7;

      if (this.lessons[j].sunday1 == '' && this.lessons[j].sunday2 == ''
      && this.lessons[j].sunday3 == '' && this.lessons[j].sunday4 == ''
      && this.lessons[j].sunday5 == '' && this.lessons[j].sunday6 == ''
      && this.lessons[j].sunday7 == '') {
        this.sunday1 = '-';
        this.sunday2 = '-';
        this.sunday3 = '-';
        this.sunday4 = '-';
        this.sunday5 = '-';
        this.sunday6 = '-';
        this.sunday7 = '-';
      }

      this.monday1 = this.lessons[j].monday_1;
      this.monday2 = this.lessons[j].monday_2;
      this.monday3 = this.lessons[j].monday_3;
      this.monday4 = this.lessons[j].monday_4;
      this.monday5 = this.lessons[j].monday_5;
      this.monday6 = this.lessons[j].monday_6;
      this.monday7 = this.lessons[j].monday_7;

      if (this.lessons[j].monday1 == '' && this.lessons[j].monday2 == ''
      && this.lessons[j].monday3 == '' && this.lessons[j].monday4 == ''
      && this.lessons[j].monday5 == '' && this.lessons[j].monday6 == ''
      && this.lessons[j].monday7 == '') {
        this.monday1 = '-';
        this.monday2 = '-';
        this.monday3 = '-';
        this.monday4 = '-';
        this.monday5 = '-';
        this.monday6 = '-';
        this.monday7 = '-';
      }

      this.tuesday1 = this.lessons[j].tuesday_1;
      this.tuesday2 = this.lessons[j].tuesday_2;
      this.tuesday3 = this.lessons[j].tuesday_3;
      this.tuesday4 = this.lessons[j].tuesday_4;
      this.tuesday5 = this.lessons[j].tuesday_5;
      this.tuesday6 = this.lessons[j].tuesday_6;
      this.tuesday7 = this.lessons[j].tuesday_7;

      if (this.lessons[j].tuesday1 == '' && this.lessons[j].tuesday2 == ''
      && this.lessons[j].tuesday3 == '' && this.lessons[j].tuesday4 == ''
      && this.lessons[j].tuesday5 == '' && this.lessons[j].tuesday6 == ''
      && this.lessons[j].tuesday7 == '') {
        this.tuesday1 = '-';
        this.tuesday2 = '-';
        this.tuesday3 = '-';
        this.tuesday4 = '-';
        this.tuesday5 = '-';
        this.tuesday6 = '-';
        this.tuesday7 = '-';
      }

      this.wednesday1 = this.lessons[j].wednesday_1;
      this.wednesday2 = this.lessons[j].wednesday_2;
      this.wednesday3 = this.lessons[j].wednesday_3;
      this.wednesday4 = this.lessons[j].wednesday_4;
      this.wednesday5 = this.lessons[j].wednesday_5;
      this.wednesday6 = this.lessons[j].wednesday_6;
      this.wednesday7 = this.lessons[j].wednesday_7;

      if (this.lessons[j].wednesday1 == '' && this.lessons[j].wednesday2 == ''
      && this.lessons[j].wednesday3 == '' && this.lessons[j].wednesday4 == ''
      && this.lessons[j].wednesday5 == '' && this.lessons[j].wednesday6 == ''
      && this.lessons[j].wednesday7 == '') {
        this.wednesday1 = '-';
        this.wednesday2 = '-';
        this.wednesday3 = '-';
        this.wednesday4 = '-';
        this.wednesday5 = '-';
        this.wednesday6 = '-';
        this.wednesday7 = '-';
      }

      this.thursday1 = this.lessons[j].thursday_1;
      this.thursday2 = this.lessons[j].thursday_2;
      this.thursday3 = this.lessons[j].thursday_3;
      this.thursday4 = this.lessons[j].thursday_4;
      this.thursday5 = this.lessons[j].thursday_5;
      this.thursday6 = this.lessons[j].thursday_6;
      this.thursday7 = this.lessons[j].thursday_7;

      if (this.lessons[j].thursday_1 == '' && this.lessons[j].thursday_2 == ''
      && this.lessons[j].thursday_3 == '' && this.lessons[j].thursday_4 == ''
      && this.lessons[j].thursday_5 == '' && this.lessons[j].thursday_6 == ''
      && this.lessons[j].thursday_7 == '') {
        this.thursday1 = '-';
        this.thursday2 = '-';
        this.thursday3 = '-';
        this.thursday4 = '-';
        this.thursday5 = '-';
        this.thursday6 = '-';
        this.thursday7 = '-';
      }
    }
  }

  goToInstallments() {
    this.storage.get('selected').then((val) => {
      this.router.navigate(InstallmentsPage, {
        student: val
      });
    });
  } 
}

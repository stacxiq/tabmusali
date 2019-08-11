import { Component } from '@angular/core';
import { NavParams, AlertController, Platform } from '@ionic/angular';
import { NotificationDetailsPage } from '../notification-details/notification-details';
import { HttpClient } from '@angular/common/http';

import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Events } from '@ionic/angular';
import { InstallmentsPage } from '../installments/installments';
import { Network } from '@ionic-native/network';
import { Badge } from '@ionic-native/badge/ngx';
import { Jsonp } from '@angular/http/src/http';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  public students: any[];
  public notes: any[];
  gategory: boolean = false;
  username: string = '';
  password: string = '';
  participant_id: string;
  student: any;

  isLoggedIn: boolean = false;
  isDelayed: boolean = false;
  public installments: any[];
  isConnected: boolean = true;
  isRefreshed: boolean = false;

  constructor(public router: Router, public navParams: NavParams, private badge: Badge,
    private http: HttpClient, private storage: Storage, private fcm: FCM,
    private nativeAudio: NativeAudio, private alertCtrl: AlertController,
    public platform: Platform, public events: Events, private network: Network) {

    var data = this.navParams.get('student');

    this.notes = data.notification;

    this.clearBadges();

    setTimeout(() => {
      this.storage.get('isConnected').then((val) => {
        if (val) {
          this.isConnected = true;
        } else {
          this.isConnected = false;
        }
      });

      this.refreshInfo();
    }, 1000);

    document.addEventListener('online', () => {
      this.storage.set('isConnected', true);
    }, false);

    document.addEventListener('offline', () => {
      this.storage.set('isConnected', false);
    }, false);

    var push = this.navParams.get('push');

    if (push != null && push === 'background') {
      this.storage.get('username').then((val) => {
        this.username = val;
      });

      this.storage.get('password').then((val) => {
        this.password = val;
      });

      this.storage.get('participant_id').then((val) => {
        this.participant_id = val;
        // alert(this.username + '  ' +this.password + '  '+ this.participant_id);
        this.loadStudentData(this.username, this.password, this.participant_id);
      });
      return;
    }

    if (platform.is('cordova')) {

      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          // alert("Received in background");
        } else {
          // alert("Received in foreground");          
          // this.presentAlert(data.notification.title, data.notification.body);
        }

        this.increaseBadges(1);
        this.playSound();
      });
    }

    this.storage.get('username').then((val) => {
      this.username = val;
    });

    this.storage.get('password').then((val) => {
      this.password = val;
    });

    this.storage.get('participant_id').then((val) => {
      this.participant_id = val;
      this.clearBadge(this.participant_id);
    });

    storage.get('isLoggedIn').then((val) => {
      console.log('val is', val);
      if (val == 'true') {
        this.isLoggedIn = true;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  playSound() {
    this.nativeAudio.preloadSimple('uniqueId1', 'assets/sound/demo.mp3').then(() => {
      this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing'));
    }, (err) => {
      console.log(err);
    });
  }

  clearBadge(participant_id) {
    let url = 'http://alawaail.com/_mobile_data/api/clear.php?participant_id=' + participant_id;
    this.http.get(url).map(res => res.text())
      .subscribe(data => {
        console.log(data);
      });
  }

  async presentAlert(title, body) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: '<div dir="rtl">' + body + '</div>',
      buttons: ['رجوع']
    });
    await alert.present();
    this.nativeAudio.play('uniqueId1').then(() => { }, () => { });
  }

  loadStudentData(username, password, participant_id) {
    this.http.get('http://alawaail.com/_mobile_data/api/account_data.php?username=' + username + '&password=' + password + '&participant_id=' + participant_id).map(res => res.text())
      .subscribe(data => {
        var s = data.replace(/\\n/g, "\\n")
          .replace(/\\'/g, "\\'")
          .replace(/\\"/g, '\\"')
          .replace(/\\&/g, "\\&")
          .replace(/\\r/g, "\\r")
          .replace(/\\t/g, "\\t")
          .replace(/\\b/g, "\\b")
          .replace(/\\f/g, "\\f");
        // remove non-printable and other non-valid JSON chars
        //s = s.replace(/[\u0000-\u0019]+/g,""); 
        s = s.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        s = s.replace(/[\u0000-\u0019]+/g, "");
        var d = JSON.parse(s);

        this.students = d.accountData[0].students;
        let stu = this.navParams.get('student');

        for (var i = 0; i < this.students.length; i++) {
          if (this.students[i].name == stu.name) {
            this.notes = [];
            this.notes = this.students[i].notification;
            break;
          }
        }
      });
  }

  doRefresh(refresher) {
    this.isRefreshed = true;
    console.log('Begin async operation', refresher);
    this.loadStudentData(this.username, this.password, this.participant_id);

    setTimeout(() => {
      this.isRefreshed = false;
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  goToDetails(item) {
    this.router.navigate(NotificationDetailsPage, {
      item: item
    });
  }

  refreshInfo() {
    this.storage.get('installs').then((val) => {
      if (val != null && val != '') {
        this.setInstallments(val);
      } else {
        this.storage.get('st_data').then((val) => {
          if (val != null) {
            this.setInstallments(val[0].installment);
          }
        });
      }
    });
  }

  setInstallments(value) {
    for (var j = 0; j < value.length; j++) {
      if (value[j].status == 'غير مدفوع') {
        this.isDelayed = true;
        break;
      } else {
        this.isDelayed = false;
      }
    }
    console.log(this.isLoggedIn + ' ' + this.isDelayed);
  }

  goToInstallments() {
    if (this.isConnected) {
      this.storage.get('selected').then((val) => {
        if (val != null && val != '') {
          this.router.navigate(InstallmentsPage, {
            student: val
          });
        } else {
          this.storage.get('st_data').then((val) => {
            if (val != null) {
              this.router.navigate(InstallmentsPage, {
                student: val[0]
              });
            }
          });
        }
      });
    } else {
      this.storage.get('selected').then((val) => {
        this.router.navigate(InstallmentsPage, {
          student: val
        });
      });
    }
  }

  async clearBadges() {
    try {
      let badges = await this.badge.clear();
      console.log(badges);
    } catch (error) {
      console.log(error);
    }
  }

  async increaseBadges(counter: number) {
    try {
      let badges = await this.badge.increase(Number(counter));
      console.log(badges);
    } catch (error) {
      console.log(error);
    }
  }
}

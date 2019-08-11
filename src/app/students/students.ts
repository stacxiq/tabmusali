import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { StudentInfoPage } from '../student-info/student-info';
import { InstallmentsPage } from '../installments/installments';
import { NotificationPage } from '../notification/notification';
import { HomePage } from '../home/home';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';
import { NativeAudio } from '@ionic-native/native-audio';
import { Events } from 'ionic-angular';	
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { Badge } from '@ionic-native/badge';

@IonicPage()
@Component({
  selector: 'page-students',
  templateUrl: 'students.html',
})
export class StudentsPage {

  public students:any[];
  username:string = '';
  password:string = '';
  participant_id:string;
  isLoggedIn:boolean = false;
  isDelayed:boolean = false;
  public installments:any[];
  isLoaded:boolean = false;
  value:any = [];
  isConnected:boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private http: Http, private storage: Storage, private fcm: FCM, private badge: Badge,
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

      this.refreshInfo();
    }, 1000);

    setTimeout(() => {
      if (this.isConnected) {
        this.storage.get('username').then((val) => {
          this.username = val;
        });
    
        this.storage.get('password').then((val) => {
          this.password = val;
        });
    
        this.storage.get('participant_id').then((val) => {
          this.participant_id = val;
    
          this.loadStudentData(this.username, this.password, this.participant_id);
        });
      } else {
        this.getFromCache();
      }
    }, 1200);

    if (platform.is('cordova')) {

      nativeAudio.preloadSimple('uniqueId1', 'assets/sound/demo.mp3').then(() => {
        // alert('okay');
      }, (err) => {
        // alert(err);
      });
  
      this.fcm.onNotification().subscribe(data => { 
        if (data.wasTapped) {
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

    events.subscribe('user:created', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.isLoggedIn = true;
    });

    events.subscribe('user:removed', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.isLoggedIn = false;
    });
  }

  ionViewDidLoad() {
    this.checkNetwork();
    // this.events.unsubscribe('stu:created');
  }
  
  ionViewWillLeave() {
    this.storage.set('num', 5);
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

  presentAlert(title, body) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: '<div dir="rtl">' + body + '</div>',
      buttons: ['رجوع']
    });
    alert.present();
    this.nativeAudio.play('uniqueId1').then(() => {}, () => {});
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
      // s = s.replace(/[\u0000-\u0019]+/g,""); 
      s = s.replace(/(?:\r\n|\r|\n)/g, '<br/>');
      s = s.replace(/[\u0000-\u0019]+/g,"");
      
      if (s != null && s != '') {
          var d = JSON.parse(s);
          this.students = [];
          this.students = d.accountData[0].students;

          this.installments = [];
          this.installments = this.students[0].installment;
      }
    });
  }

  getFromCache() {
    setInterval(() => {      
      this.storage.get('st_data').then((val) => {
        if (val != '' && val != null) {
          this.value = val;      
        } 
      });

    }, 1000);

    setTimeout(() => {
      this.students = [];
      this.students = this.value;
    }, 1200);
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
    // alert(this.isLoggedIn + ' ' + this.isDelayed);
  }

  goToDetails(student) {
    this.storage.set('selected', student);
    this.storage.set('installs', student.installment);
    this.navCtrl.push(StudentInfoPage, {
      student: student
    }).catch((err) => alert(err));
  }

  goToInstallments() {
    if (this.isConnected) {
      this.storage.get('selected').then((val) => {
        if (val != null && val != '') {
          this.navCtrl.push(InstallmentsPage, {
            student: val
          });
        } else {
          this.storage.get('st_data').then((val) => {
            if (val != null) {
              this.navCtrl.push(InstallmentsPage, {
                student: val[0]
              });
            }
          });
        }
      }); 
    } else {
      this.storage.get('selected').then((val) => {
        this.navCtrl.push(InstallmentsPage, {
          student: val
        });
      });
    }
  } 
}

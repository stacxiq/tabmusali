import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { NativeAudio } from '@ionic-native/native-audio';
import { InstallmentsPage } from '../installments/installments';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Badge } from '@ionic-native/badge';

@IonicPage()
@Component({
  selector: 'page-about-school',
  templateUrl: 'about-school.html',
})
export class AboutSchoolPage {

  public students:any[];
  isLoggedIn:boolean = false;
  isDelayed:boolean = false;
  public installments:any[];
  username:string = '';
  password:string = '';
  participant_id:string;  
  isLoaded:boolean = false;
  isConnected:boolean = true;
  value:string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private badge: Badge,
    private fcm: FCM, private nativeAudio: NativeAudio, private storage: Storage,
    private http: Http, private alertCtrl: AlertController, public platform: Platform, 
    public events: Events) {

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

      setTimeout(() => {
        this.storage.get('isConnected').then((val) => {
          if (val) {
            this.isConnected = true;
          } else {
            this.isConnected = false;
          }
        });
      }, 1000);
      
      if (val == 'true') {
        this.isLoggedIn = true;

        setInterval(() => {
          this.storage.get('selected').then((val) => {
            if (val != '' && val != null) {
              this.value = val;      
            } 
          });
    
          this.refreshInfo();
        }, 1000);
      } else {
        this.isLoggedIn = false;
      }
    });

    this.storage.get('username').then((val) => {
      this.username = val;
    });

    this.storage.get('password').then((val) => {
      this.password = val;
    });

    this.storage.get('participant_id').then((val) => {
      this.participant_id = val;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutSchoolPage');
  }

  ionViewWillLeave() {
    this.storage.set('num', 2);
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

  refreshInfo() {
    this.storage.get('installs').then((val) => {
      if (val != null) {
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
    if (value != '') {
      for (var j = 0; j < value.length; j++) {
        if (value[j].status == 'غير مدفوع') {
          this.isDelayed = true;
          break;
        } else {
          this.isDelayed = false;
        }
      }
    }
  }

  goToInstallments(username, password, participant_id) {
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

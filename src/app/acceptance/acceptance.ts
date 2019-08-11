import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Badge } from '@ionic-native/badge/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'page-acceptance',
  templateUrl: 'acceptance.html',
})
export class AcceptancePage {

  public students: any[];
  isLoggedIn: boolean = false;
  isDelayed: boolean = false;
  public installments: any[];
  username: string = '';
  password: string = '';
  participant_id: string;
  isLoaded: boolean = false;
  isConnected: boolean = true;
  value: string = '';

  constructor(public router: Router,
    private fcm: FCM, private nativeAudio: NativeAudio, private storage: Storage, private badge: Badge,
    private alertCtrl: AlertController, public platform: Platform) {

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

  ngOnInit() {
    console.log('ngOnInit AcceptancePage');
  }

  ionViewWillLeave() {
    this.storage.set('num', 4);
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
    this.nativeAudio.play('uniqueId1').then(() => { }, () => { });
  }

  refreshInfo() {
    this.storage.get('installs').then((val) => {
      if (val != null) {
        this.setInstallments(this.value);
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
      for (var j = 0; j < value.installment.length; j++) {
        if (value.installment[j].status == 'غير مدفوع') {
          this.isDelayed = true;
          break;
        } else {
          this.isDelayed = false;
        }
      }
    }
  }

  goToInstallments() {
    if (this.isConnected) {
      this.storage.get('selected').then((val) => {
        if (val != null && val != '') {
          this.router.navigate(['installments', {
            student: val
          }]);
        } else {
          this.storage.get('st_data').then((val) => {
            if (val != null) {
              this.router.navigate(['installments', {
                student: val[0]
              }]);
            }
          });
        }
      });
    } else {
      this.storage.get('selected').then((val) => {
        this.router.navigate(['installments', {
          student: val
        }]);
      });
    }
  }
}

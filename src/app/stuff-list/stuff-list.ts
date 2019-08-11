import { Component } from '@angular/core';
import { NavParams, AlertController, LoadingController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { FCM } from '@ionic-native/fcm/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Badge } from '@ionic-native/badge/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'page-stuff-list',
  templateUrl: 'stuff-list.html',
})
export class StuffListPage {
  private url = 'http://alawaail.com/_mobile_data/api/staffs.php';
  public flag: number = 0;
  public items: any[];
  isLoaded: boolean = false;
  value: string = '';
  isConnected: boolean = true;
  public students: any[];
  isLoggedIn: boolean = false;
  isDelayed: boolean = false;
  public installments: any[];
  username: string = '';
  password: string = '';
  participant_id: string;
  loader: any = this.loadingCtrl.create();

  constructor(public router: Router, public navParams: NavParams,
    private http: HttpClient, private fcm: FCM, private nativeAudio: NativeAudio,
    private alertCtrl: AlertController, public platform: Platform, private badge: Badge,
    private storage: Storage, public events: Events, public loadingCtrl: LoadingController) {

    this.flag = navParams.get('flag');
    // this.loadData();

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

  async presentAlert(title, body) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: '<div dir="rtl">' + body + '</div>',
      buttons: ['رجوع']
    });
    await alert.present();
    this.nativeAudio.play('uniqueId1').then(() => { }, () => { });
  }

  async increaseBadges(counter: number) {
    try {
      let badges = await this.badge.increase(Number(counter));
      console.log(badges);
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit() {
    this.loader.present();

    this.checkNetwork().then(status => {
      if (status) {
        this.loadStuffData();
      } else {
        this.getFromCache();
      }
    });
  }

  async checkNetwork(): Promise<Boolean> {
    return await this.storage.get('isConnected');
  }

  async loadStuffData() {
    this.http.get(this.url)
      .subscribe(data => {

        if (data != null && data != '') {
          var s = data.toString().replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");

          s = s.replace(/(?:\r\n|\r|\n)/g, '<br/>');
          s = s.replace(/[\u0000-\u0019]+/g, "");
          var jsonData = JSON.parse(s);
          // alert(JSON.stringify(jsonData));

          this.loader.dismiss();

          switch (this.flag) {
            case 1:
              this.items = jsonData.staff[0].primary;
              this.storage.set('stuff_list_1', this.items);
              break;
            case 2:
              this.items = jsonData.staff[1].secondary_girls;
              this.storage.set('stuff_list_2', this.items);
              break;
            case 3:
              this.items = jsonData.staff[2].secondary_boys;
              this.storage.set('stuff_list_3', this.items);
              break;
            case 4:
              this.items = jsonData.staff[3].headquarter;
              this.storage.set('stuff_list_4', this.items);
              break;
          }
        }
      });
  }

  getFromCache() {
    let key = '';

    switch (this.flag) {
      case 1:
        key = 'stuff_list_1';
        break;
      case 2:
        key = 'stuff_list_2';
        break;
      case 3:
        key = 'stuff_list_3';
        break;
      case 4:
        key = 'stuff_list_4';
        break;
    }

    this.storage.get(key).then((val) => {
      if (val != null && val != '') {
        this.loader.dismiss();
        this.items = [];
        this.items = val;
      }
    });
  }

  refreshInfo() {
    this.storage.get('installs').then((val) => {
      if (val != null && val != '') {
        this.setInstallments(this.value);
      } else {
        this.storage.get('st_data').then((val) => {
          if (val != null && val != '') {
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

  goToDetails(item) {
    this.router.navigate(['stuff-details', {
      item: item
    }]);
  }
}

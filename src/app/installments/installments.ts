import { Component } from '@angular/core';
import { NavParams, AlertController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { Badge } from '@ionic-native/badge/ngx';


@Component({
  selector: 'page-installments',
  templateUrl: 'installments.html',
})
export class InstallmentsPage {

  public students: any[];
  public items: any[];
  public installments: any[];
  public icon: string = 'md-checkmark';
  username: string = '';
  password: string = '';
  delayed: boolean = false;
  public status: any = [];
  participant_id: string;
  student: any;
  isConnected: boolean = true;
  isLoggedIn: boolean = false;
  isDelayed: boolean = false;

  constructor(public router: Router, public navParams: NavParams,
    private http: HttpClient, private storage: Storage, private fcm: FCM,
    private nativeAudio: NativeAudio, private alertCtrl: AlertController,
    public platform: Platform, private network: Network, private badge: Badge,
    private sqlite: SQLite) {

    var data = this.navParams.get('student');
    this.items = data.installment;
    this.loadStudentData(this.items);

    document.addEventListener('online', () => {
      this.storage.set('isConnected', true);
    }, false);

    document.addEventListener('offline', () => {
      this.storage.set('isConnected', false);
    }, false);

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
      if (val == 'true') {
        this.isLoggedIn = true;
      }
    });
  }

  ngOnInit() {
    console.log('ngOnInit InstallmentsPage');
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

  loadStudentData(data) {
    for (var j = 0; j < data.length; j++) {
      if (data[j].status == 'غير مدفوع') {
        this.isDelayed = true;
        break;
      } else {
        this.isDelayed = false;
      }
    }
  }
}

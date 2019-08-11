import { Component, OnInit } from '@angular/core';
import { NavParams, AlertController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm/ngx';
import { Events } from '@ionic/angular';
import { Badge } from '@ionic-native/badge/ngx';
import { Router } from '@angular/router';


@Component({
  selector: 'page-this.degrees',
  templateUrl: 'degrees.html',
})
export class DegreesPage implements OnInit {

  public students: any[];
  public installments: any[];
  public degrees: any[];
  isLoggedIn: boolean = false;
  isDelayed: boolean = false;
  participant_id: string;
  username: string = '';
  password: string = '';
  value: string = '';
  isConnected: boolean = true;
  title: string;
  exam_title_1: string;
  exam_title_2: string;
  exam_title_3: string;
  exam_title_4: string;
  exam_title_5: string;
  exam_title_6: string;
  exam_title_7: string;
  exam_title_8: string;
  exam_title_9: string;
  exam_title_10: string;
  exam_title_11: string;
  exam_title_12: string;
  exam_title_13: string;
  exam_title_14: string;
  exam_title_15: string;
  exam_title_16: string;

  constructor(public router: Router, public navParams: NavParams,
    private http: HttpClient,
    private storage: Storage,
    private fcm: FCM,
    private badge: Badge,
    private alertCtrl: AlertController,
    public platform: Platform,
    public events: Events) {

    if (platform.is('cordova')) {
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

      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          // alert("Received in background");
        } else {
          // alert("Received in foreground");
          this.presentAlert(data.notification.title, data.notification.body);
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

  ngOnInit() {
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

  async presentAlert(title, body) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: '<div dir="rtl">' + body + '</div>',
      buttons: ['رجوع']
    });
    await alert.present();
  }

  async increaseBadges(counter: number) {
    try {
      let badges = await this.badge.increase(Number(counter));
      console.log(badges);
    } catch (error) {
      console.log(error);
    }
  }

  loadStudentData(data) {
    this.installments = data.student.installment;

    for (var j = 0; j < this.installments.length; j++) {
      if (this.installments[j].status == 'غير مدفوع') {
        this.isDelayed = true;
        break;
      }
    }

    this.degrees = data.student.degrees;
    this.title = this.degrees[0].title;
    this.exam_title_1 = this.degrees[0].exam_title_1;
    this.exam_title_2 = this.degrees[0].exam_title_2;
    this.exam_title_3 = this.degrees[0].exam_title_3;
    this.exam_title_4 = this.degrees[0].exam_title_4;
    this.exam_title_5 = this.degrees[0].exam_title_5;
    this.exam_title_6 = this.degrees[0].exam_title_6;
    this.exam_title_7 = this.degrees[0].exam_title_7;
    this.exam_title_8 = this.degrees[0].exam_title_8;
    this.exam_title_9 = this.degrees[0].exam_title_9;
    this.exam_title_10 = this.degrees[0].exam_title_10;
    this.exam_title_11 = this.degrees[0].exam_title_11;
    this.exam_title_12 = this.degrees[0].exam_title_12;
    this.exam_title_13 = this.degrees[0].exam_title_13;
    this.exam_title_14 = this.degrees[0].exam_title_14;
    this.exam_title_15 = this.degrees[0].exam_title_15;
    this.exam_title_16 = this.degrees[0].exam_title_16;
  }

  goToInstallments() {
    this.storage.get('selected').then((val) => {
      this.router.navigate(['installments', {
        student: val
      }]);
    });
  }
}

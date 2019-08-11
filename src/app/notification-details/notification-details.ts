import { Component } from '@angular/core';
import { NavParams, AlertController, Platform } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Storage } from '@ionic/storage';
import { Badge } from '@ionic-native/badge/ngx';
import { Router } from '@angular/router';


@Component({
  selector: 'page-notification-details',
  templateUrl: 'notification-details.html',
})
export class NotificationDetailsPage {

  public item: any;

  constructor(public router: Router, public navParams: NavParams, private badge: Badge,
    private fcm: FCM, private nativeAudio: NativeAudio, private storage: Storage,
    private alertCtrl: AlertController, public platform: Platform) {

    this.item = navParams.get('item');

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
  }

  ngOnInit() {
    console.log('ngOnInit NotificationDetailsPage');
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

}

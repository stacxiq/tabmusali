import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, AlertController } from 'ionic-angular';
import { StuffListPage } from '../stuff-list/stuff-list';
import { FCM } from '@ionic-native/fcm';
import { NativeAudio } from '@ionic-native/native-audio';
import { Storage } from '@ionic/storage';
import { Badge } from '@ionic-native/badge';

@IonicPage()
@Component({
  selector: 'page-stuff',
  templateUrl: 'stuff.html',
})
export class StuffPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public toastCtrl: ToastController, private fcm: FCM, private badge: Badge,
    private nativeAudio: NativeAudio, private storage: Storage,
    private alertCtrl: AlertController, public platform: Platform) {

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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StuffPage');
  }

  ionViewWillLeave() {
    this.storage.set('num', 3);
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

  viewStuff(flag) {
    this.navCtrl.push(StuffListPage, {
      flag: flag
    });
  }

}

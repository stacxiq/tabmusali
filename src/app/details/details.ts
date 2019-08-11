import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { NativeAudio } from '@ionic-native/native-audio';
import { Storage } from '@ionic/storage';
import { Badge } from '@ionic-native/badge';

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  public item:any;
  public images:any = [];
  public title : string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private badge: Badge,
    private fcm: FCM, private nativeAudio: NativeAudio, private storage: Storage,
    private alertCtrl: AlertController, public plt: Platform) {

    this.item = navParams.get('item');
    this.images = this.item.image;

    this.title = this.item.title;

    if (plt.is('cordova')) {

      if (this.title.length > 35) {
        this.title = this.title.substring(0, 35).concat(' ... ');
      } 

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
}

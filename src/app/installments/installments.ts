import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';
import { NativeAudio } from '@ionic-native/native-audio';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { Badge } from '@ionic-native/badge';

@IonicPage()
@Component({
  selector: 'page-installments',
  templateUrl: 'installments.html',
})
export class InstallmentsPage {

  public students:any[];
  public items:any[];
  public installments:any[];
  public icon:string = 'md-checkmark';
  username:string = '';
  password:string = '';
  delayed:boolean = false;
  public status:any = [];
  participant_id:string;
  student:any;
  isConnected:boolean = true;
  isLoggedIn:boolean = false;
  isDelayed:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private http: Http, private storage: Storage, private fcm: FCM, 
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
      if (val == 'true') {
        this.isLoggedIn = true;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InstallmentsPage');
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

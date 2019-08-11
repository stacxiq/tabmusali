import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';
import { NativeAudio } from '@ionic-native/native-audio';
import { Events } from 'ionic-angular';
import { InstallmentsPage } from '../installments/installments';
import { Network } from '@ionic-native/network';
import { Badge } from '@ionic-native/badge';

@IonicPage()
@Component({
  selector: 'page-exams',
  templateUrl: 'exams.html',
})
export class ExamsPage {

  public students:any[];
  public items:any[];
  username:string = '';
  password:string = '';
  participant_id:string;  
  isLoaded:boolean = false;
  value:string = '';
  public installments:any[];
  isLoggedIn:boolean = false;
  isDelayed:boolean = false;
  isConnected:boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private http: Http,  private storage: Storage, private fcm: FCM, private badge: Badge,
    private nativeAudio: NativeAudio, private alertCtrl: AlertController,
    public platform: Platform, public events: Events, private network: Network) {

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
      if (val == 'true') {
        this.isLoggedIn = true;
      }
    });
  }

  ionViewDidLoad() {
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
    this.items = data.student.exams;
    this.installments = data.student.installment; 
    
    for (var j = 0; j < this.installments.length; j++) {
      if (this.installments[j].status == 'غير مدفوع') {
        this.isDelayed = true;
        break;
      }
    }
  }

  goToInstallments() {
    this.storage.get('selected').then((val) => {
      this.navCtrl.push(InstallmentsPage, {
        student: val
      });
    });
  } 
}

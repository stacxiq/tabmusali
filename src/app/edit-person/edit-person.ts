import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { MyApp } from '../../app/app.component';
import { Platform, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { Storage } from '@ionic/storage';
import { Events } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@IonicPage()
@Component({
  selector: 'page-edit-person',
  templateUrl: 'edit-person.html',
})
export class EditPersonPage {

  isIos: boolean = false;
  public items: any[];
  public username: string;
  public password: string;
  public students: any[];
  user: string = '';
  pass: string = '';
  sName: string = '';
  stage: string = '';
  group: string = '';
  school: string = '';
  id: string = '';

  constructor(public router: Router, public navParams: NavParams, public plt: Platform, public toastCtrl: ToastController, private http: HttpClient, private storage: Storage, public events: Events, private fcm: FCM, private nativeAudio: NativeAudio, private alertCtrl: AlertController) {

    if (plt.is('cordova')) {
      nativeAudio.preloadSimple('uniqueId1', 'assets/sound/demo.mp3').then(() => {
        // alert('okay');
      }, (err) => {
        // alert(err);
      });

      this.fcm.getToken().then(token => {
        this.registerToken(token);
      });

      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          // alert("Received in background");
        } else {
          // alert("Received in foreground");
          // this.presentAlert(data.notification.title, data.notification.body);
        };
      });

      this.fcm.onTokenRefresh().subscribe(token => {
        this.registerToken(token);
      });
    }

    if (this.plt.is('ios')) {
      this.isIos = true;
    } else if (this.plt.is('android')) {
      this.isIos = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPersonPage');
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

  goBack() {
    this.router.navigate(TabsPage, {
      status: 'signedIn'
    });
  }

  submit() {
    if (this.user == '' && this.pass == '') {
      this.showToast('الرجاء ادخال المعلومات المطلوبة');
      return;
    }

    this.loadData(this.user, this.pass);
  }

  loadData(username, password) {
    this.http.get('http://alawaail.com/_mobile_data/api/retrieval.php?username=' + username + '&password=' + password)
      .map(res => res.json())
      .subscribe(data => {

        // alert(JSON.stringify(data));

        // this.sName = data.login[0].name;
        this.id = data.login[0].participant_id;

        if (data.login[0].status == 'true') {
          this.storage.set('isLoggedIn', 'true');
          this.storage.set('username', username);
          this.storage.set('password', password);
          this.storage.set('participant_id', this.id);

          this.saveInfo(username, password, this.id);
        } else {
          this.showToast('معلومات المستخدم غير صحيحة, حاول مرة اخرى');
        }
      });
  }

  saveInfo(username, password, id) {
    this.http.get('http://alawaail.com/_mobile_data/api/account_data.php?username=' + username + '&password=' + password + '&participant_id=' + id).map(res => res.text())
      .subscribe(data => {
        var s = data.replace(/\\n/g, "\\n")
          .replace(/\\'/g, "\\'")
          .replace(/\\"/g, '\\"')
          .replace(/\\&/g, "\\&")
          .replace(/\\r/g, "\\r")
          .replace(/\\t/g, "\\t")
          .replace(/\\b/g, "\\b")
          .replace(/\\f/g, "\\f");

        s = s.replace(/[\u0000-\u0019]+/g, "");
        var d = JSON.parse(s);
        //alert(d);

        this.students = d.accountData[0].students;
        this.sName = this.students[0].name;
        this.stage = this.students[0].class;
        this.group = this.students[0].class_group;
        this.school = this.students[0].school;


        this.storage.set('sname', this.sName);
        this.storage.set('stage', this.stage);
        this.storage.set('group', this.group);
        this.storage.set('school', this.school);

        this.events.publish('user:created', this.sName, this.stage, this.group, this.school, Date.now());
        this.router.navigate(TabsPage, {
          status: 'signedIn'
        });
      });
  }

  registerToken(token) {
    this.storage.set('fcm_token', token);
  }

  showToast(title) {
    let toast = this.toastCtrl.create({
      message: title,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
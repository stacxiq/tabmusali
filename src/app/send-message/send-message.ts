import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { TabsPage } from '../tabs/tabs'
import { Platform, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-send-message',
  templateUrl: 'send-message.html',
})
export class SendMessagePage {

  private title: string = '';
  private message: string = '';
  private studentName: string = '';
  private isIOS: boolean = false;

  constructor(public loadingCtrl: LoadingController, private alertCtrl: AlertController, public router: Router, public navParams: NavParams, public toastCtrl: ToastController, private http: HttpClient, private storage: Storage, public platform: Platform) {
  }

  ionViewDidLoad() {
    if (this.platform.is('ios')) {
      this.isIOS = true;
    } else if (this.platform.is('android')) {
      this.isIOS = false;
    }
  }

  goBack() {
    this.router.navigate(TabsPage, {
      status: 'signedIn'
    }); 
  }

  submit() {    
    if (!this.studentName && !this.title && !this.message) {
      this.showToast('الرجاء ادخال المعلومات المطلوبة');
      return;
    }

    if (!this.studentName) {
      this.showToast('الرجاء ادخال اسم الطالب');
      return;
    }

    if (!this.title) {
      this.showToast('الرجاء ادخال عنوان الرسالة');
      return;
    }

    if (!this.message) {
      this.showToast('الرجاء ادخال الرسالة');
      return;
    }

    this.postData(this.studentName, this.title, this.message);
  }

  postData(studentName: string, title: string, message: string) {
    let user = '';
    let id = '';

    this.storage.get('username').then((username) => {
      user = username;
    });

    this.storage.get('participant_id').then((participant_id) => {
      id = participant_id;

      let loading = this.loadingCtrl.create({
        content: 'جاري ارسال الرسالة'
      });
    
      loading.present();

      let link = `http://alawaail.com/_mobile_data/api/request.php?participant=${user}&participant_id=${id}&title=${title}&content=${message}&student=${studentName}`;
      this.http.get(link)
      .map(res => res.json())
      .subscribe(data => {

        setTimeout(() => {
          loading.dismiss();

          let request = data.request;

          let status = request[0].status;

          if (status === 'true') {
            this.presentAlertSuccess('نجاح', 'شكرا لتواصلكم معنا ... سيتم مراجعة الرسالة من قبل الادارة ... وإشعاركم بالرد.');
          } else {
            this.presentAlertFail('خطا', 'عذرا حصل خطأ اثناء عملية الارسال ... حاول مرة آخرى.');
          }

        }, 3000);
        
      }, err => {
        alert(err);
      });

    });

  }

  showToast(title) {
    let toast = this.toastCtrl.create({
      message: title, 
      duration: 3000,
      position: 'bottom',
      cssClass: 'toast'
    });
    toast.present();
  }

  presentAlertSuccess(title: string, message: string) {
    let alert = await this.alertCtrl.create({
      header: title,
      subTitle: message,
      buttons: [
        {
          text: 'رجوع',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    await alert.present();
  }

  presentAlertFail(title: string, message: string) {
    let alert = await this.alertCtrl.create({
      header: title,
      subTitle: message,
      buttons: ['رجوع']
    });
    await alert.present();
  }

}

import { Component } from '@angular/core';
import { NavParams, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { TabsPage } from '../tabs/tabs'
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'page-fix-chair',
  templateUrl: 'fix-chair.html',
})
export class FixChairPage {

  private studentName: string;
  private fatherName: string;
  private school: string;
  private lastClass: string;
  private newClass: string;
  private policy: boolean = false;

  public registrationIntroduction: any;

  constructor(public loadingCtrl: LoadingController, private alertCtrl: AlertController, public toastCtrl: ToastController, private http: HttpClient, private storage: Storage, public router: Router, public navParams: NavParams) {
  }

  ngOnInit() {
    this.getRegistrationInformation();

    this.storage.get('policy_fix').then((val) => {
      if (val != null || val != '') {
        this.policy = val;
      }
    });
  }

  goBack() {
    this.router.navigate(['tabs', {
      status: 'signedIn'
    }]);
  }

  onChangeSchool(school) {
    this.school = school;
  }

  onChangeLastClass(lastClass) {
    this.lastClass = lastClass;
  }

  onChangeNewClass(newClass) {
    this.newClass = newClass;
  }

  submit() {
    if (!this.studentName && !this.fatherName && !this.lastClass && !this.school && !this.newClass) {
      this.showToast('الرجاء ادخال المعلومات المطلوبة');
      return;
    }

    if (!this.studentName) {
      this.showToast('الرجاء ادخال اسم الطالب');
      return;
    }

    if (!this.fatherName) {
      this.showToast('الرجاء ادخال اسم ولي الامر او من ينوب عنه');
      return;
    }

    if (!this.school) {
      this.showToast('الرجاء ادخال المدرسة الحالية للطالب');
      return;
    }

    if (!this.lastClass) {
      this.showToast('الرجاء ادخال المرحلة الدراسية نجح منها الطالب');
      return;
    }

    if (!this.newClass) {
      this.showToast('الرجاء ادخال المرحلة الجديدة للطالب');
      return;
    }

    this.storage.get('policy_fix').then((val) => {
      if (val != null || val != '') {
        this.policy = val;

        if (!this.policy) {
          this.showToast('الرجاء قراءة الضوابط و التعليمات قبل استكمال التسجيل');
        } else {
          this.complete();
        }

        return;
      }
    });
  }

  async complete() {
    let loading = await this.loadingCtrl.create({
      message: 'جاري ارسال المعلومات'
    });

    loading.present();

    let url = 'http://alawaail.com/_mobile_data/api/seats.php';


    let data = new FormData();
    data.append('name', this.studentName);
    data.append('father', this.fatherName);
    data.append('school', this.school);
    data.append('new_class', this.newClass);
    data.append('class', this.lastClass);

    await this.http.post(url, data)

      .subscribe(data => {
        var s = data.toString().replace(/\\n/g, "\\n")
          .replace(/\\'/g, "\\'")
          .replace(/\\"/g, '\\"')
          .replace(/\\&/g, "\\&")
          .replace(/\\r/g, "\\r")
          .replace(/\\t/g, "\\t")
          .replace(/\\b/g, "\\b")
          .replace(/\\f/g, "\\f");

        s = s.replace(/[\u0000-\u0019]+/g, "");
        let jsonData = JSON.parse(s);

        let seats = jsonData.seats;
        let status = seats.status;

        if (status === 'true') {
          loading.dismiss();
          this.presentAlertSuccess('تم حجز المقعد');
        } else {
          loading.dismiss();
          this.presentAlertFail('خطا', 'عذرا حصل خطأ ... حاول مرة آخرى.');
        }
      });
  }

  async showToast(title) {
    let toast = await this.toastCtrl.create({
      message: title,
      duration: 3000,
      position: 'bottom',
      cssClass: 'toast'
    });
    toast.present();
  }

  async presentAlertSuccess(title: string) {
    let alert = await this.alertCtrl.create({
      header: title,
      buttons: [
        {
          text: 'انهاء الحجز',
          handler: () => {
            this.goBack();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertFail(title: string, message: string) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: ['رجوع']
    });
    await alert.present();
  }

  async getRegistrationInformation() {
    let loading = await this.loadingCtrl.create({
      message: 'يرجى الانتظار'
    });

    loading.present();

    let link = `http://alawaail.com/_mobile_data/api/registration_information.php`;
    this.http.get(link)
      .subscribe(data => {
        loading.dismiss();
        this.registrationIntroduction = data[0].registration_information[1].registration_introduction;
        this.storage.set('policy_fix', false);
      }, err => {
        alert(err);
      });
  }

  updatePolicy() {
    this.policy = !this.policy;
    this.storage.set('policy_fix', this.policy);
  }

  readInfo() {
    this.updatePolicy();
    this.router.navigate(['read-info']);
  }
}

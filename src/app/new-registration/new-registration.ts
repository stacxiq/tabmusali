import { Component, } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs'
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';


import { ReadInfoPage } from '../read-info/read-info';
import { StudentsFormPage } from '../students-form/students-form';

@IonicPage()
@Component({
  selector: 'page-new-registration',
  templateUrl: 'new-registration.html',
})
export class NewRegistrationPage {

  private studentName : string;
  private accom : string;
  private birthDate : string;
  private place : string;
  private brothersNumber : string;
  private brotherOrder: string;
  private brothersAlawail : string;
  private lastSchool : string;
  private lastClass : string;
  private average : string;
  private newSchool : string;
  private newClass : string;
  private notes : string;
  private fatherName : string;
  private fatherJob : string;
  private fatherCertification : string;
  private motherName : string;
  private motherJob : string;
  private motherCertification : string;
  private fatherMotherAive : string;
  private phone_1 : string;
  private phone_2 : string;
  private policy : boolean = false;

  public registrationIntroduction: any;

  public isPrimary : boolean = false;
  public isBoys: boolean = false;
  public isGirls: boolean = false;

  public items : any = [];

  constructor(private storage: Storage, public loadingCtrl: LoadingController, private alertCtrl: AlertController, public toastCtrl: ToastController, private http: HttpClient, public router: Router, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.getRegistrationInformation();

    this.storage.get('policy').then((val) => {
      if (val != null || val != '') {
        this.policy = val;
      }
    });
  }

  goBack() {
    this.router.navigate(TabsPage, {
      status: 'signedIn'
    }); 
  }

  onChangePlace(place) {
    this.place = place;
  }

  onChangeSchool(school) {
    this.newSchool = school;

    if (this.newSchool == 'الابتدائية') {
      this.isPrimary = true;
      this.isBoys = false;
      this.isGirls = false;
      this.loadClassess(this.isPrimary, this.isBoys, this.isGirls);
      return;
    } else if (this.newSchool == 'ثانوية البنين') {
      this.isBoys = true;
      this.isPrimary = false;
      this.isGirls = false;
      this.loadClassess(this.isPrimary, this.isBoys, this.isGirls);
      return;
    } else if (this.newSchool == 'ثانوية البنات') {
      this.isGirls = true;
      this.isPrimary = false;
      this.isBoys = false;
      this.loadClassess(this.isPrimary, this.isBoys, this.isGirls);
      return;
    } else {
      this.isPrimary = true;
      this.isBoys = false;
      this.isGirls = false;
      this.loadClassess(this.isPrimary, this.isBoys, this.isGirls);
    }
  }

  onChangeLastClass(lastClass) {
    this.lastClass = lastClass;
  }

  onChangeNewClass(newClass) {
    this.newClass = newClass;
  }

  submit() {    
    if (!this.studentName && !this.fatherName && !this.fatherJob && !this.fatherCertification && !this.motherName && !this.motherJob && !this.motherCertification && !this.fatherMotherAive && !this.birthDate && !this.place && !this.accom && !this.brothersNumber && !this.brotherOrder && !this.brothersAlawail && !this.lastSchool && !this.lastClass && !this.average && !this.newSchool && !this.newClass &&  !this.phone_1 && !this.phone_2 && !this.brothersNumber) {
      this.showToast('الرجاء ادخال المعلومات المطلوبة');
      return;
    }

    if (!this.studentName) {
      this.showToast('الرجاء ادخال اسم الطالب');
      return;
    }

    if (!this.fatherName) {
      this.showToast('الرجاء ادخال اسم ولي الامر');
      return;
    }

    if (!this.fatherCertification) {
      this.showToast('الرجاء ادخال التحصيل الدراسي لولي الامر');
      return;
    }

    if (!this.motherName) {
      this.showToast('الرجاء ادخال اسم الام');
      return;
    }

    if (!this.motherJob) {
      this.showToast('الرجاء ادخال مهنة الام');
      return;
    }

    if (!this.motherCertification) {
      this.showToast('الرجاء ادخال التحصيل الدراسي للام');
      return;
    }

    if (!this.fatherMotherAive) {
      this.showToast('الرجاء ادخال ما اذا كان الام او الاب على قيد الحياة');
      return;
    }

    if (!this.brothersNumber) {
      this.showToast('الرجاء ادخال عدد الاخوة و الاخوات');
      return;
    }

    if (!this.brothersAlawail) {
      this.showToast('الرجاء ادخابل عدد الاخوة من طلاب الاوائل');
      return;
    }

    if (!this.brotherOrder) {
      this.showToast('الرجاء ادخال تسلسل الطالب بين اخوته');
      return;
    }

    if (!this.birthDate) {
      this.showToast('الرجاء ادخال تاريخ ميلاد الطالب');
      return;
    }

    if (!this.place) {
      this.showToast('الرجاء ادخال محل الولادة');
      return;
    }

    if (!this.accom) {
      this.showToast('الرجاء ادخال عنوان سكن الطالب الحالي');
      return;
    }

    if (!this.lastSchool) {
      this.showToast('الرجاء ادخال اخر مدرسة كان فيها الطالب');
      return;
    }

    if (!this.lastClass) {
      this.showToast('الرجاء ادخال اخر المرحلة الدراسية نجح منها الطالب');
      return;
    }

    if (!this.average) {
      this.showToast('الرجاء ادخال معدل المرحلة الدراسية السابقة');
      return;
    }

    if (!this.newSchool) {
      this.showToast('الرجاء ادخال المدرسة');
      return;
    }

    if (!this.newClass) {
      this.showToast('الرجاء ادخال الصف الذي يرغب التسجيل به');
      return;
    }

    if (!this.phone_1) {
      this.showToast('الرجاء ادخال رقم  هاتف ولي الامر');
      return;
    }

    if (!this.phone_2) {
      this.showToast('الرجاء ادخال رقم الهانف البديل لولي الامر');
      return;
    }

    this.storage.get('policy').then((val) => {
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
    let loading = this.loadingCtrl.create({
      content: 'جاري ارسال المعلومات'
    });
  
    loading.present();

    let url = 'http://alawaail.com/_mobile_data/api/registration.php';

    let headers = new Headers();

    let options = new RequestOptions({ headers: headers });

    let data = new FormData();
    data.append('name', this.studentName);
    data.append('job', this.fatherJob);
    data.append('father', this.fatherName);
    data.append('father_certification', this.fatherCertification);
    data.append('mother', this.motherCertification);
    data.append('mother_workplace', this.motherJob);
    data.append('mother_certification', this.motherCertification);
    data.append('parents_status', this.fatherMotherAive);
    data.append('birthday', this.birthDate);
    data.append('province', this.place);
    data.append('residence', this.accom);
    data.append('school', this.lastSchool);
    data.append('class', this.lastClass);
    data.append('avrage', this.average);
    data.append('new_school', this.newSchool);
    data.append('new_class', this.newClass);
    data.append('phone_1', this.phone_1);
    data.append('phone_2', this.phone_2);
    data.append('brother', this.brothersNumber);
    data.append('brothers_order', this.brotherOrder);
    data.append('notes', this.notes);

    await this.http.post(url, data, options) 
    .map(res => res.text())
    .subscribe(data => {
      loading.dismiss();

      let result = JSON.stringify(data);

      if (result.includes('SQL')) {
        loading.dismiss();
        this.presentAlertFail('خطا', 'عذرا حصل خطأ ... حاول مرة آخرى.');
        return;
      }

      var s = data.replace(/\\n/g, "\\n")  
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f");

      s = s.replace(/[\u0000-\u0019]+/g,""); 
      let jsonData = JSON.parse(s);

      let registration = jsonData.registration;

      let status = registration.status;

      let regNumber = registration.registration_number;

      if (status === 'true') {
        loading.dismiss();
        this.presentAlertSuccess('تم التسجيل بنجاح', 'الرجاء حفظ رقم الاستمارة', regNumber);
        this.storage.set('policy', false);
      } else {
        loading.dismiss();
        this.presentAlertFail('خطا', 'عذرا حصل خطأ ... حاول مرة آخرى.');
        this.storage.set('policy', false);
      }
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

  presentAlertSuccess(title: string, message: string, regNumber) {
    let alert = await this.alertCtrl.create({
      header: title,
      subTitle: message + '<br><h1><center>' + regNumber + '</center></h1>',
      buttons: [
        {
          text: 'انهاء التسجيل',
          handler: () => {
            this.goBack();
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

  getRegistrationInformation() {
    let loading = this.loadingCtrl.create({
      content: 'يرجى الانتظار'
    });

    loading.present();

    let link = `http://alawaail.com/_mobile_data/api/registration_information.php`;
    this.http.get(link)
    .map(res => res.json())
    .subscribe(data => {
      loading.dismiss();
      this.registrationIntroduction = data.registration_information[1].registration_introduction; 
    }, err => {
      alert(err);
    });
  }

  loadClassess(p, b, g) {
    let loading = this.loadingCtrl.create({
      content: 'يرجى الانتظار'
    });

    loading.present();

    let link = `http://alawaail.com/_mobile_data/api/registration_classes.php`;
    this.http.get(link)
    .map(res => res.json())
    .subscribe(data => {
      loading.dismiss();

      this.items = [];

      if (p) {
        this.items = data.registration_classes[0].classes; 
      } else if (g) {
        this.items = data.registration_classes[1].classes; 
      } else  if (b) {
        this.items = data.registration_classes[2].classes; 
      }
    }, err => {
      alert(err);
    });
  }
 
  updatePolicy() {
    this.policy = !this.policy;
    this.storage.set('policy', this.policy);
  }

  readInfo() {
    this.updatePolicy();
    this.router.navigate(ReadInfoPage);
  }
}

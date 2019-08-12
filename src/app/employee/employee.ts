import { Component } from '@angular/core';
import {  ToastController, LoadingController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';



@Component({
  selector: 'page-employee',
  templateUrl: 'employee.html',
})
export class EmployeePage {

  private school: string;
  private name: string;
  private gender: string;
  private birthDate: string;
  private place: string;
  private study: string;
  private college: string;
  private dept: string;
  private year: string;
  private evaluation: string;
  private status: string;
  private children: string;
  private address: string;
  private phone_1: string;
  private phone_2: string;
  private question1: string;
  private expYears: string;
  private question2: string;
  private computerUse: string;
  private programming: string;
  private langs: string;
  private courses: string;
  private thanking: string;
  private hobbies: string;
  private question3: string;
  private policy: boolean = false;

  constructor(private http: HttpClient, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public router: Router) {
  }

  ngOnInit() {
    console.log('ngOnInit EmployeePage');
  }

  updatePolicy() {
    this.policy = !this.policy;
  }

  onChangePlace(place) {
    this.place = place;
  }

  onChangeSchool(school) {
    this.school = school;
  }

  onChangeGender(gender) {
    this.gender = gender;
  }

  onChangeStudy(study) {
    this.study = study;
  }

  onChangeEvaluation(evaluation) {
    this.evaluation = evaluation;
  }

  onChangeStatus(status) {
    this.status = status;
  }

  onChangeComputer(computerUse) {
    this.computerUse = computerUse;
  }

  async submit() {
    if (!this.school && !this.name && !this.gender && this.birthDate && !this.place && !this.study && !this.college && !this.dept && !this.year && !this.evaluation && !this.status && !this.children && !this.address && !this.phone_1 && !this.phone_2 && !this.question1 && !this.expYears && !this.question2 && !this.computerUse && !this.programming && !this.langs && !this.courses && !this.thanking && !this.hobbies && !this.question3) {
      this.showToast('الرجاء ادخال المعلومات المطلوبة');
      return;
    }

    if (!this.school) {
      this.showToast('الرجاء  تحديد المدرسة');
      return;
    }

    if (!this.name) {
      this.showToast('الرجاء ادخال  الاسم الثلاثي و اللقب');
      return;
    }

    if (!this.gender) {
      this.showToast('الرجاء تحديد الجنس');
      return;
    }

    if (!this.birthDate) {
      this.showToast('الرجاء  ادخال المواليد');
      return;
    }

    if (!this.place) {
      this.showToast('الرجاء  ادخال محل الولادة');
      return;
    }

    if (!this.study) {
      this.showToast('الرجاء  ادخال التحصيل الدراسي');
      return;
    }

    if (!this.college) {
      this.showToast('الرجاء  ادخال  الكلية');
      return;
    }

    if (!this.dept) {
      this.showToast('الرجاء  ادخال  القسم');
      return;
    }

    if (!this.evaluation) {
      this.showToast('الرجاء  تحديد التقدير');
      return;
    }

    if (!this.status) {
      this.showToast('الرجاء الحالة الاجتماعية');
      return;
    }

    if (!this.children) {
      this.showToast('الرجاء ادخال عدد الاولاد');
      return;
    }

    if (!this.address) {
      this.showToast('الرجاء ادخال العنوان الكامل');
      return;
    }

    if (!this.phone_1) {
      this.showToast('الرجاء ادخال رقم موبايل الاول');
      return;
    }

    if (!this.phone_2) {
      this.showToast('الرجاء ادخال رقم موبايل الثاني');
      return;
    }

    if (!this.question1) {
      this.showToast('الرجاء الاجابة على السؤال');
      return;
    }

    if (!this.expYears) {
      this.showToast('الرجاء ادخال عدد سنوات الخبرة');
      return;
    }

    if (!this.question2) {
      this.showToast('الرجاء الاجابة على السؤال');
      return;
    }

    if (!this.computerUse) {
      this.showToast('الرجاء  تحديد اجادة استخدام الحاسوب');
      return;
    }

    if (!this.programming) {
      this.showToast('الرجاء ادخال اللغات التي تجيدها في الحاسوب');
      return;
    }

    if (!this.langs) {
      this.showToast('الرجاء ادخال اللغات التي تجيدها');
      return;
    }

    if (!this.courses) {
      this.showToast('الرجاء ادخال الدورات التي شاركت بها');
      return;
    }

    if (!this.thanking) {
      this.showToast('الرجاء ادخال كتب الشكر و التقدير التي حصلت عليها');
      return;
    }

    if (!this.hobbies) {
      this.showToast('الرجاء ادخال ابرز الهوايات و القدرات الشخصية');
      return;
    }

    if (!this.question3) {
      this.showToast('الرجاء الاجابة على السؤال');
      return;
    }

    if (!this.policy) {
      this.showToast('الرجاء الموافقة على الشروط');
      return;
    }

    let loading = await this.loadingCtrl.create({
      message: 'جاري ارسال المعلومات'
    });

    await loading.present();

    let link = `http://alawaail.com/_mobile_data/api/job.php?school=${this.school}&name=${this.name}&gender=${this.gender}&birthdate=${this.birthDate}&province=${this.place}&graduate=${this.year}&college=${this.college}&department=${this.dept}&year=${this.year}&grade=${this.study}&social_status=${this.status}&kids=${this.children}&address=${this.address}&phone_1=${this.phone_1}&phone_2=${this.phone_2}&experience=${this.question1}&experience_years=${this.expYears}&experience_location=${this.question2}&computer_skills=${this.computerUse}&computer_programs=${this.programming}&languages=${this.langs}&training_courses=${this.courses}&letter_of_thanks=${this.thanking}&hobbies=${this.hobbies}&reasons=${this.question3}`;
    this.http.get(link)
      .subscribe(data => {

        setTimeout(() => {
          loading.dismiss();

          let job = data[0].job;

          let status = job[0].status;

          if (status === 'true') {
            this.presentAlertSuccess('نجاح', 'تم تسجيل المعلومات');
          } else {
            this.presentAlertFail('خطا', 'عذرا حصل خطأ ... حاول مرة آخرى.');
          }

        }, 3000);

      }, err => {
        alert(err);
      });
  }

  async showToast(title) {
    let toast = await this.toastCtrl.create({
      message: title,
      duration: 3000,
      position: 'bottom',
      cssClass: 'toast'
    });
    await toast.present();
  }

  async presentAlertSuccess(title: string, message: string) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'انهاء التسجيل',
          handler: () => {
            this.router.navigate(['tabs']);
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

  goBack() {
    this.router.navigate(['tabs', {
      status: 'signedIn'
    }]);
  }

}

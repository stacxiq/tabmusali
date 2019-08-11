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
  selector: 'page-absence',
  templateUrl: 'absence.html',
})
export class AbsencePage {

  public installments:any[];
  isLoggedIn:boolean = false;
  isDelayed:boolean = false;
  public promise;
  isLoaded:boolean = false;
  value:string = '';
  selectedDay = new Date();
  eventSource;
  viewTitle;

  calendar = {
    mode: 'month',
    dateFormatter: {
      formatMonthViewDay: function(date:Date) {
          return date.getDate().toString();
      },
      formatMonthViewDayHeader: function(date:Date) {
          return 'testMDH';
      },
      formatMonthViewTitle: function(date:Date) {
          return 'testMT';
      },
      formatWeekViewDayHeader: function(date:Date) {
          return 'testWDH';
      },
      formatWeekViewTitle: function(date:Date) {
          return 'testWT';
      },
      formatWeekViewHourColumn: function(date:Date) {
          return 'testWH';
      },
      formatDayViewHourColumn: function(date:Date) {
          return 'testDH';
      },
      formatDayViewTitle: function(date:Date) {
          return 'testDT';
      }
    },
    locale: 'ar-GB'
  };        

  public absences:any[];
  public excuses:any[];
  isConnected:boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private http: Http, private storage: Storage, private fcm: FCM, private badge: Badge,
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
    this.absences = data.student.absences;
    this.excuses = data.student.excuses;
    this.getEvents(this.absences, this.excuses);
    this.installments = data.student.installment;
    
    for (var j = 0; j < this.installments.length; j++) {
      if (this.installments[j].status == 'غير مدفوع') {
        this.isDelayed = true;
        break;
      }
    }
  }

  onCurrentDateChanged($event) {}

  reloadSource(startTime, endTime) {}

  onEventSelected($event) {}

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected($event) {}

  getEvents(absences, excuses) {
    var events = [];
    let colors: string[] = ['danger', 'success'];

    events.push({
      title: 'غياب',
      startTime: new Date(absences[0].absences_1),
      endTime: new Date(absences[0].absences_1),
      allDay: false,
      color: colors[0]
    }, 
    {
      title: 'غياب',
      startTime: new Date(absences[0].absences_2),
      endTime: new Date(absences[0].absences_2),
      allDay: false,
      color: colors[0]
    },
    {
      title: 'غياب',
      startTime: new Date(absences[0].absences_3),
      endTime: new Date(absences[0].absences_3),
      allDay: false,
      color: colors[0]
    },
    {
      title: 'غياب',
      startTime: new Date(absences[0].absences_4),
      endTime: new Date(absences[0].absences_4),
      allDay: false,
      color: colors[0]
    },
    {
      title: 'غياب',
      startTime: new Date(absences[0].absences_5),
      endTime: new Date(absences[0].absences_5),
      allDay: false,
      color: colors[0]
    },
    {
      title: 'غياب',
      startTime: new Date(absences[0].absences_6),
      endTime: new Date(absences[0].absences_6),
      allDay: false,
      color: colors[0]
    },
    {
      title: 'غياب',
      startTime: new Date(absences[0].absences_7),
      endTime: new Date(absences[0].absences_7),
      allDay: false,
      color: colors[0]
    },
    {
      title: 'اجازة',
      startTime: new Date(excuses[0].excuses_1),
      endTime: new Date(excuses[0].excuses_1),
      allDay: false,
      color: colors[1]
    },
    {
      title: 'اجازة',
      startTime: new Date(absences[0].excuses_2),
      endTime: new Date(absences[0].excuses_2),
      allDay: false,
      color: colors[1]
    },
    {
      title: 'اجازة',
      startTime: new Date(excuses[0].excuses_3),
      endTime: new Date(excuses[0].excuses_3),
      allDay: false,
      color: colors[1]
    },
    {
      title: 'اجازة',
      startTime: new Date(excuses[0].excuses_4),
      endTime: new Date(excuses[0].excuses_4),
      allDay: false,
      color: colors[1]
    },
    {
      title: 'اجازة',
      startTime: new Date(excuses[0].excuses_5),
      endTime: new Date(excuses[0].excuses_5),
      allDay: false,
      color: colors[1]
    },
    {
      title: 'اجازة',
      startTime: new Date(excuses[0].excuses_6),
      endTime: new Date(excuses[0].excuses_6),
      allDay: false,
      color: colors[1]
    },
   );

    this.eventSource = events;

    // this.calendar.createCalendar('MyCalendar').then(
    //   (msg) => { alert(msg); },
    //   (err) => { alert(err); }
    // );

    // this.calendar.openCalendar(this.selectedDay);
  }

  goToInstallments() {
    this.storage.get('selected').then((val) => {
      this.navCtrl.push(InstallmentsPage, {
        student: val
      });
    });
  } 
}

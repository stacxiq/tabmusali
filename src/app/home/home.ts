import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, ToastController, AlertController, LoadingController, NavParams, Content } from 'ionic-angular';
import { EditPersonPage } from '../edit-person/edit-person';
import { DetailsPage } from '../details/details';
import { InstallmentsPage } from '../installments/installments';
import { NotificationPage } from '../notification/notification';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';

import { Events } from '@ionic/angular';	
import 'rxjs/add/operator/catch';
import { FCM } from '@ionic-native/fcm/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { isNumber } from 'ionic-angular/util/util';
import { SendMessagePage } from '../send-message/send-message';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Content) content: Content;

  isIos: boolean = false;
  isLoggedIn:boolean = false;
  isDelayed:boolean = false;
  username:string = '';
  password:string = '';
  participant_id:string;
  public items:any[];
  public students:any[];
  public installments:any[];
  isLoaded:boolean = false;
  value:any = [];
  isConnected:boolean = true;
  isRefreshed:boolean = false;
  counter:number = 0;
  loader:any = this.loadingCtrl.create();

  constructor(public router: Router, private fcm: FCM, private nativeAudio: NativeAudio, 
    public toastCtrl: ToastController, public events: Events, public plt: Platform, private http: HttpClient, 
    private storage: Storage, private alertCtrl: AlertController, private badge: Badge,
    public loadingCtrl: LoadingController, public navParams: NavParams) {

    if (plt.is('cordova')) {
    
      plt.ready().then(() => {

        this.nativeAudio.preloadSimple('uniqueId1', 'assets/sound/demo.mp3');

        this.fcm.onNotification().subscribe(data => {
          if(data.wasTapped){
            this.storage.get('username').then((val) => {
              this.username = val;
            });
    
            this.storage.get('password').then((val) => {
              this.password = val;
            });
    
            this.storage.get('participant_id').then((val) => {
              this.participant_id = val;
              this.updateInfo(this.username, this.password, this.participant_id);
            });
          } else {
            // alert("Received in foreground");  
          }

          // this.goToNotifications();
          this.increaseBadges(1);
          this.playSound();

          this.storage.get('username').then((val) => {
            this.username = val;
          });
  
          this.storage.get('password').then((val) => {
            this.password = val;
          });
  
          this.storage.get('participant_id').then((val) => {
            this.participant_id = val;
            this.updateInfo(this.username, this.password, this.participant_id);
          });
        });
      });
    } else {
      this.loadData();
    }

    storage.get('isLoggedIn').then((val) => {
      console.log('val is', val);
      
      if (val == 'true') {
        this.isLoggedIn = true;

        this.storage.get('username').then((val) => {
          this.username = val;
        });

        this.storage.get('password').then((val) => {
          this.password = val;
        });

        this.storage.get('participant_id').then((val) => {
          this.participant_id = val;
          this.loadStudentData(this.username, this.password, this.participant_id);
        });

        setInterval(() => {
          this.refreshInfo();

          this.storage.get('selected').then((val) => {
            if (val != '' && val != null) {
              this.value = val;      
            } 
          });

          this.storage.get('num').then((val) => {
            if (val != '' && val != null) {
              if (isNumber(val)) {
                this.setSubscribe();
              }     
            } 
          });
  
          this.getBadges();
        }, 1000);

      } else {
        this.isLoggedIn = false;
      }
    });

    if (this.plt.is('ios')) {
      this.isIos = true;
    } else if (this.plt.is('android')) {
      this.isIos = false;
    }

    events.subscribe('user:created', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.isLoggedIn = true;
    });

    events.subscribe('user:removed', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.isLoggedIn = false;
    });

    events.subscribe('scroll', val => {
      if (val) {
        this.content.scrollToTop();
      }
    });
  }

  ionViewDidLoad() {
    this.checkNetwork();
    this.getBadges();
  }

  ionViewDidEnter() {
    this.setSubscribe();
    this.getBadges();
  }

  // scrollToTop() {
  //   this.content.scrollToTop(400);
  // }

  setSubscribe() {
    this.fcm.onNotification().subscribe(data => {
      //alert(JSON.stringify(data));
      if(data.wasTapped){
        // alert("Received in background");
        this.storage.get('selected').then((val) => {
          this.router.navigate(NotificationPage, {
            student: val,
            push: 'background'
          }).catch(e => console.log(e));
        });
      } else {
        //alert("Received in foreground");
        this.playSound();
      }

      this.increaseBadges(1);

      this.storage.get('username').then((val) => {
        this.username = val;
      });

      this.storage.get('password').then((val) => {
        this.password = val;
      });

      this.storage.get('participant_id').then((val) => {
        this.participant_id = val;
        this.updateInfo(this.username, this.password, this.participant_id);
      });
    });
  }

  checkNetwork() {
    var obj = this.navParams.data;

    if (obj.status == 'signedIn') {
      this.setToken();
      this.loadData();
    }

    document.addEventListener('online', () => {
      // alert('متصل بالشبكة');
      this.loadData();
      this.isConnected = true;
      this.storage.set('isConnected', this.isConnected);
    }, false);

    document.addEventListener('offline', () => {
      alert('غير متصل بالشبكة');
      this.getFromCache();
      this.isConnected = false;
      this.storage.set('isConnected', this.isConnected);
    }, false);
  }

  setToken() {
    this.storage.get('fcm_token').then((val2) => {
      this.storage.get('participant_id').then((participant_id) => {
        let url = 'http://alawaail.com/_mobile_data/api/pick.php?participant_id=' + participant_id + '&token=' + val2;
        this.http.get(url).map(res => res.text())
        .subscribe(data => {
          // alert(data);
          // console.log('res', data);
        });
      });
    });
  }

  playSound() {
    this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing'));
  }

  async presentAlert(title, body) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: '<div dir="rtl">' + body + '</div>',
      buttons: ['رجوع']
    });
    await alert.present();
    this.nativeAudio.play('uniqueId1').then(() => {}, () => {});
  }

  goBack() {
    this.navCtrl.pop();
  }

  signin() {
    this.router.navigate(EditPersonPage);
  }

  loadData() {
    this.storage.get('participant_id').then((val) => {
      this.checkStatus(val);
    });

    this.loader.present();

    if (!this.isConnected) {
      this.loader.dismiss();
    }

    this.http.get('http://alawaail.com/_mobile_data/api/retrieval.php?operation=news').map(res => res.text())
    .subscribe(data => {
      
      if (data != null && data != '') {
        var s = data.replace(/\\n/g, "\\n")  
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
        // remove non-printable and other non-valid JSON chars
        // s = s.replace(/[\u0000-\u0019]+/g,""); 
        s = s.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        var d = JSON.parse(s);
  
        this.items = [];
        this.items = d.news;
        this.storage.set('news_list', this.items);

        // alert(JSON.stringify(this.items));

        this.loader.dismiss();
      } 

    }, error => {
      console.log('xxx', error);
    });
  }

  doRefresh(refresher) {
    this.isRefreshed = true;
    console.log('Begin async operation', refresher);
    this.loadData(); 

    setTimeout(() => {
      this.isRefreshed = false;
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  loadStudentData(username, password, participant_id) {
    this.http.get('http://alawaail.com/_mobile_data/api/account_data.php?username=' + username + '&password=' + password + '&participant_id=' + participant_id).map(res => res.text())
    .subscribe(data => {
      if (data != null && data != '') {
        var s = data.replace(/\\n/g, "\\n")  
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
        // remove non-printable and other non-valid JSON chars
        s = s.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        s = s.replace(/[\u0000-\u0019]+/g,""); 
        var d = JSON.parse(s);
      
        this.students = d.accountData[0].students;
        this.storage.set('st_data', this.students);
        
        this.installments = this.students[0].installment;
  
        this.storage.get('installs').then((val) => {
          if (val == null) {
            this.storage.set('installs', this.installments);
          }
        });
      }
    });
  }

  getFromCache() {
    this.storage.get('news_list').then((val) => {
      if (val != null && val != '') {
        this.loader.dismiss();
        this.items = [];
        this.items = val;
      }
    });
  }

  refreshInfo() {
    this.storage.get('installs').then((val) => {
      if (val != null && val != '') {
        this.setInstallments(val);
      } else {
        this.storage.get('st_data').then((val) => {
          if (val != null && val != '') {
            this.setInstallments(val[0].installment);
          }
        });
      }
    });
  }

  updateInfo(username, password, participant_id) {
    this.http.get('http://alawaail.com/_mobile_data/api/account_data.php?username=' + username + '&password=' + password + '&participant_id=' + participant_id).map(res => res.text())
    .subscribe(data => {
      if (data != null && data != '') {
        var s = data.replace(/\\n/g, "\\n")  
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
        // remove non-printable and other non-valid JSON chars
        s = s.replace(/[\u0000-\u0019]+/g,""); 
        var d = JSON.parse(s);
      
        this.students = d.accountData[0].students;

        this.storage.get('selected').then((val) => {
          if (val != null && val != '') {
            for (var i = 0; i < this.students.length; i++) {
              if (this.students[i].name == val.name) {
                this.storage.set('selected', this.students[i]);
                break;
              }
            }
          } else {
            for (i = 0; i < this.students.length; i++) {
              if (this.students[i].name == this.students[0].name) {
                this.storage.set('selected', this.students[i]);
                break;
              }
            }
          }
        }); 
      }
    });
  }

  setInstallments(value) {
    if (value != '') {
      for (var j = 0; j < value.length; j++) {
        if (value[j].status == 'غير مدفوع') {
          this.isDelayed = true;
          break;
        } else {
          this.isDelayed = false;
        }
      }
    }
  }

  viewMore(item) {
    this.router.navigate(DetailsPage, {
      item: item,
    }).then().catch((e) => alert(e));
  }

  goToNotifications() {
    if (this.isConnected) {
      this.storage.get('selected').then((val) => {
        if (val != null && val != '') {
          this.router.navigate(NotificationPage, {
            student: val,
            push: 'bb'
          });
        } else {
          this.router.navigate(NotificationPage, {
            student: this.students[0],
            push: 'bb'
          });
        }
      });
    } else {
      this.storage.get('selected').then((val) => {
        this.router.navigate(NotificationPage, {
          student: val,
          push: 'bb'
        });
      });
    }
  }

  goToInstallments() {
    if (this.isConnected) {
      this.storage.get('selected').then((val) => {
        if (val != null && val != '') {
          this.router.navigate(InstallmentsPage, {
            student: val
          });
        } else {
          this.router.navigate(InstallmentsPage, {
            student: this.students[0]
          });
        }
      }); 
    } else {
      this.storage.get('selected').then((val) => {
        this.router.navigate(InstallmentsPage, {
          student: val
        });
      });
    }
  } 

  async setBadges(counter: number) {
    try {
      let badges = await this.badge.set(Number(counter));
      console.log(badges);
    } catch (error) {
      console.log(error);
    }
  }

  async getBadges() {
    try {
      let badges = await this.badge.get();
      this.counter = badges;
      console.log(badges);
    } catch (error) {
      console.log(error);
    }
  }

  async increaseBadges(counter: number) {
    try {
      let badges = await this.badge.increase(Number(counter));
      this.counter = badges;
      console.log(badges);
    } catch (error) {
      console.log(error);
    }
  }

  goToMessage() {
    this.router.navigate(SendMessagePage);
  }

  async checkStatus(userId) {
    let url = 'http://alawaail.com/_mobile_data/api/login_status.php';

    let headers = new Headers();

    let options = new RequestOptions({ headers: headers });

    let data = new FormData();
    data.append('operation', 'check');
    data.append('id', userId);

    await this.http.post(url, data, options) 
    .map(res => res.text())
    .subscribe(data => {
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

      let response = jsonData.login_status[0].status;

      if (response == 'logged_in') {
        //alert('here1');
        return;
      } else if (response == 'logged_out') {
        //alert('here2');
        this.events.publish('user:removed', '', Date.now());
        // this.storage.set('st_data', '');
        this.storage.set('selected', '');
        this.storage.set('installs', '');
        this.storage.set('news', '');
        this.storage.set('events', '');

        this.storage.set('isLoggedIn', 'false');
        this.isLoggedIn = false; 
      }

    }, error => {
      // this.loader.dismiss();
    });
  }
}
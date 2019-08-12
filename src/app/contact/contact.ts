import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Platform, AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Events } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage implements OnInit, AfterViewInit {

  isIos: boolean = false;
  isLoggedIn: boolean = false;
  isDelayed: boolean = false;
  public items: any[];
  public students: any[];
  public installments: any[];
  participant_id: string;
  username: string = '';
  password: string = '';
  isLoaded: boolean = false;
  value: string = '';
  isConnected: boolean = true;
  isConnected2: boolean = false;
  isRefreshed: boolean = false;
  counter: number = 0;
  loader: any = this.loadingCtrl.create();
  isLoading: boolean;

  constructor(public router: Router, public events: Events, public plt: Platform, private http: HttpClient,
    private storage: Storage, private fcm: FCM, private nativeAudio: NativeAudio, private alertCtrl: AlertController,
    public loadingCtrl: LoadingController, private badge: Badge) {

    if (plt.is('cordova')) {
      this.nativeAudio.preloadSimple('uniqueId1', 'assets/sound/demo.mp3');

      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          console.log("Received in background");
        } else {
          // alert("Received in foreground");
        }

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
    } else {
      this.loadData();
    }

    storage.get('isLoggedIn').then((val) => {
      console.log('val is', val);

      setTimeout(() => {
        this.storage.get('isConnected').then((val) => {
          if (val) {
            this.isConnected = true;
          } else {
            this.isConnected = false;
          }

          if (this.isConnected) {
            this.loadData();
          } else {
            this.getFromCache();
          }
        });

        this.isConnected2 = this.isConnected;

      }, 1000);

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
          this.storage.get('selected').then((val) => {
            if (val != '' && val != null) {
              this.value = val;
            }
          });

          this.storage.get('num').then((val) => {
            if (val != '' && val != null) {
              if (this.isNumber(val)) {
                this.setSubscribe();
              }
            }
          });
          this.getBadges();
          this.refreshInfo();

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
      // this.content.scrollToTop();
    });
  }

  ngOnInit() {
    this.checkNetwork();
    this.getBadges();
  }

  ngAfterViewInit() {
    this.setSubscribe();
    this.getBadges();
  }

  setSubscribe() {
    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        console.log("Received in background");
        this.storage.get('selected').then((val) => {
          this.router.navigate(['notification', {
            student: val,
            push: 'background'
          }]).catch(e => console.log(e));
        });
      } else {
        // alert("Received in foreground");
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
    document.addEventListener('online', () => {
      this.storage.set('isConnected', true);
    }, false);

    document.addEventListener('offline', () => {
      this.storage.set('isConnected', false);
    }, false);
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

  playSound() {
    this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing'));
  }

  signin() {
    this.router.navigate(['']).then(
      response => {
        console.log('Response ' + response);
      },
      error => {
        console.log('Error: ' + error);
      }
    ).catch(exception => {
      console.log('Exception ' + exception);
    });
  }

  loadData() {
    this.storage.get('participant_id').then((val) => {
      this.checkStatus(val);
    });

    this.present();

    if (!this.isConnected) {
      this.dismiss();

    }

    this.http.get('http://alawaail.com/_mobile_data/api/retrieval.php?operation=events',{responseType: 'text'})
      .subscribe(data => {
        this.items = [];
        var s = data.toString().replace(/\\n/g, "\\n")
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

        if (s != null && s != '') {
          var d = JSON.parse(s);

          this.items = [];
          this.items = d.events;
          this.storage.set('events_list', this.items);
          this.dismiss();
        }
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
    this.http.get('http://alawaail.com/_mobile_data/api/account_data.php?username=' + username + '&password=' + password + '&participant_id=' + participant_id)
      .subscribe(data => {
        if (data != null && data != null) {
          var s = data.toString().replace(/\\n/g, "\\n")
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
          s = s.replace(/[\u0000-\u0019]+/g, "");
          var d = JSON.parse(s);

          this.students = d.accountData[0].students;

          this.installments = this.students[0].installment;
        }
      });
  }

  getFromCache() {
    this.storage.get('events_list').then((val) => {
      if (val != null && val != '') {
        this.dismiss();
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
    this.http.get('http://alawaail.com/_mobile_data/api/account_data.php?username=' + username + '&password=' + password + '&participant_id=' + participant_id)
      .subscribe(data => {
        if (data != null && data != '') {
          var s = data.toString().replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");
          // remove non-printable and other non-valid JSON chars
          s = s.replace(/[\u0000-\u0019]+/g, "");
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
    this.router.navigate(['details', {
      item: item,
    }]).then().catch((e) => alert(e));
  }

  goToNotifications() {
    if (this.isConnected2) {
      this.storage.get('selected').then((val) => {
        if (val != null && val != '') {
          this.router.navigate(['notification', {
            student: val
          }]);
        } else {
          this.router.navigate(['notification', {
            student: this.students[0]
          }]);
        }
      });
    } else {
      this.storage.get('selected').then((val) => {
        this.router.navigate(['notification', {
          student: val
        }]);
      });
    }
  }

  goToInstallments() {
    if (this.isConnected2) {
      this.storage.get('selected').then((val) => {
        if (val != null && val != '') {
          this.router.navigate(['installments', {
            student: val
          }]);
        } else {
          this.router.navigate(['installments', {
            student: this.students[0]
          }]);
        }
      });
    } else {
      this.storage.get('selected').then((val) => {
        if (val != null) {
          this.router.navigate(['installments', {
            student: val
          }]);
        }
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
    this.router.navigate(['send-message']);
  }

  async checkStatus(userId) {
    let url = 'http://alawaail.com/_mobile_data/api/login_status.php';

    let data = new FormData();
    data.append('operation', 'check');
    data.append('id', userId);

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
  isNumber(value: string | number): boolean {
    return ((value != null) && !isNaN(Number(value.toString())));
  }
  async present() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      duration: 5000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }
}

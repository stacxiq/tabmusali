import { Component, OnInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular'
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Events } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'page-about',
  templateUrl: './about.html',
  styleUrls: ['./about.scss'],
})
export class AboutPage implements OnInit {

  isIos: boolean = false;
  isLoggedIn: boolean = false;
  isDelayed: boolean = false;
  username: string = '';
  password: string = '';
  participant_id: string;
  public students: any[];
  public installments: any[];
  instagram;
  facebook;
  youtube;
  isConnected: boolean = true;
  isConnected2: boolean = false;
  value: string = '';
  counter: number = 0;

  constructor(public router: Router, public events: Events, public platform: Platform,
    private http: HttpClient, private callNumber: CallNumber, private iab: InAppBrowser, private badge: Badge,
    private storage: Storage, private fcm: FCM, private nativeAudio: NativeAudio,
    private alertCtrl: AlertController, public appAvailability: AppAvailability) {

    if (this.platform.is('ios')) {
      this.isIos = true;
      this.instagram = 'instagram://app';
      this.facebook = 'fb://';
      this.youtube = 'youtube://';
    } else if (this.platform.is('android')) {
      this.isIos = false;
      this.instagram = 'com.instagram.android';
      this.facebook = 'com.facebook.katana';
      this.youtube = 'com.youtube';
    }

    setTimeout(() => {
      this.storage.get('isConnected').then((val) => {
        if (val) {
          this.isConnected = true;
        } else {
          this.isConnected = false;
        }
      });
    }, 1000);

    this.isConnected2 = this.isConnected;

    if (platform.is('cordova')) {
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

    document.addEventListener('online', () => {
      this.storage.set('isConnected', true);
    }, false);

    document.addEventListener('offline', () => {
      this.storage.set('isConnected', false);
    }, false);

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
  }

  ngOnInit() {
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

  async presentAlert(title, body) {
    let alert = await await this.alertCtrl.create({
      header: title,
      message: '<div dir="rtl">' + body + '</div>',
      buttons: ['رجوع']
    });
    await await alert.present();
    this.nativeAudio.play('uniqueId1').then(() => { }, () => { });
  }

  playSound() {
    this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing'));
  }

  signin() {
    this.router.navigate(['edit-person']).then(
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

  callPhoneNumber(number) {
    console.log(number);
    this.callNumber.callNumber("+964" + number, false)
      .then(() => console.log('Launched dialer!'))
      .catch((err) => alert('Error launching dialer' + err));
  }

  browseLink(link) {
    const browser = this.iab.create(link);
    browser.close();
  }

  openInstagramApp() {
    this.appAvailability.check(this.instagram)
      .then((yes) => {
        window.open(this.instagram + '/awaail.schools/', '_system', 'location=no');
      },
        (no) => {
          window.open('https://www.instagram.com/awaail.schools/', '_system', 'location=no');
        }
      );
  }

  openFacebookApp() {
    this.appAvailability.check(this.facebook)
      .then((yes) => {
        window.open('fb://page/awaail.schools/', '_system', 'location=no');
      },
        (no) => {
          window.open('https://www.facebook.com/awaail.schools/?ref=page_internal', '_system', 'location=no');
        }
      );
  }

  openYouTubeApp() {
    this.appAvailability.check(this.youtube)
      .then((yes) => {
        window.open('youtube://channel/UCiLQWFy4WdlLE27Co17Io-Q', '_system', 'location=no');
      },
        (no) => {
          window.open('https://www.youtube.com/channel/UCiLQWFy4WdlLE27Co17Io-Q', '_system', 'location=no');
        }
      );
  }

  openMailApp() {
    window.open('mailto:awaail.schools@gmail.com');
  }

  loadStudentData(username, password, participant_id) {
    this.http.get('http://alawaail.com/_mobile_data/api/account_data.php?username=' + username + '&password=' + password + '&participant_id=' + participant_id)
      .subscribe(data => {
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

        if (s != null && s != '') {
          var d = JSON.parse(s);
          this.students = d.accountData[0].students;

          this.installments = this.students[0].installment;
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
              for (var i = 0; i < this.students.length; i++) {
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

  isNumber(value: string | number): boolean {
    return ((value != null) && !isNaN(Number(value.toString())));
  }
}

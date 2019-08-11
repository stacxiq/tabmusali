import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'page-about-app',
  templateUrl: './about-app.html',
  styleUrls: ['./about-app.scss'],
})
export class AboutAppPage {

  isLoggedIn: boolean = false;
  isDelayed: boolean = false;
  username: string = '';
  password: string = '';
  participant_id: string;
  value: string = '';
  isIos: boolean = false;
  isConnected: boolean = true;

  constructor(public router: Router, private storage: Storage, public platform: Platform) {

    storage.get('isLoggedIn').then((val) => {
      console.log('val is', val);

      setTimeout(() => {
        this.storage.get('isConnected').then((val) => {
          if (val) {
            this.isConnected = true;
          } else {
            this.isConnected = false;
          }
        });
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
        });

        setInterval(() => {
          this.storage.get('selected').then((val) => {
            if (val != '' && val != null) {
              this.value = val;
            }
          });

          this.refreshInfo();
        }, 1000);

      } else {
        this.isLoggedIn = false;
      }
    });

    if (this.platform.is('ios')) {
      this.isIos = true;
    } else if (this.platform.is('android')) {
      this.isIos = false;
    }
  }

  ionViewWillLeave() {
    this.storage.set('num', 6);
  }

  refreshInfo() {
    this.storage.get('installs').then((val) => {
      if (val != null) {
        this.setInstallments(this.value);
      } else {
        this.storage.get('st_data').then((val) => {
          if (val != null) {
            this.setInstallments(val[0].installment);
          }
        });
      }
    });
  }

  openWebsite() {
    window.open('http://manaratech.com/', '_system', 'location=no');
  }

  setInstallments(value) {
    if (value != '') {
      for (var j = 0; j < value.installment.length; j++) {
        if (value.installment[j].status == 'غير مدفوع') {
          this.isDelayed = true;
          break;
        } else {
          this.isDelayed = false;
        }
      }
    }
  }

  goToInstallments() {
    if (this.isConnected) {
      this.storage.get('selected').then((val) => {
        if (val != null && val != '') {
          this.router.navigate(['installments', {
            student: val
          }]);
        } else {
          this.storage.get('st_data').then((val) => {
            if (val != null) {
              this.router.navigate(['installments', {
                student: val[0]
              }]);
            }
          });
        }
      });
    } else {
      this.storage.get('selected').then((val) => {
        this.router.navigate(['installments', {
          student: val
        }]);
      });
    }
  }
}

import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Events } from '@ionic/angular';
import { Badge } from '@ionic-native/badge/ngx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  isLoggedIn: boolean = false;
  sName: string = '';
  stage: string = '';
  group: string = '';
  school: string = '';
  public items: any[];
  public students: any[];
  participant_id: string;
  username: string = '';
  password: string = '';
  counter: number = 0;

  constructor(platform: Platform, public events: Events, splashScreen: SplashScreen, private http: HttpClient,
    private storage: Storage,
    private badge: Badge, private statusBar: StatusBar) {

    platform.ready().then(() => {
      this.storage.get('participant_id').then((val) => {
        this.participant_id = val;
        this.checkStatus(val);
      });
      this.statusBar.styleBlackTranslucent();
      splashScreen.hide();
    });

    events.subscribe('user:created', (user, stage, group, school, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      this.isLoggedIn = true;
      this.sName = user;
      this.stage = stage;
      this.group = group;
      this.school = school;
    });

    this.storage.get('isLoggedIn').then((val2) => {
      // console.log('val is', val);

      setInterval(() => {
        this.getInfo();
      }, 1000);

      if (val2 == 'true') {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  getInfo() {
    this.storage.get('sname').then((val) => {
      this.sName = val;
    });

    this.storage.get('username').then((val) => {
      this.username = val;
    });

    this.storage.get('password').then((val) => {
      this.password = val;
    });

    this.storage.get('stage').then((val) => {
      this.stage = val;
    });

    this.storage.get('group').then((val) => {
      this.group = val;
    });

    this.storage.get('school').then((val) => {
      this.school = val;
    });

    this.storage.get('participant_id').then((val) => {
      this.participant_id = val;
    });
  }

  signOut() {
    this.storage.set('isLoggedIn', 'false');
    this.isLoggedIn = false;

    this.storage.get('participant_id').then((val) => {
      this.participant_id = val;
      this.changeStatus(val);
    });
  }

  async changeStatus(userId) {
    let url = 'http://alawaail.com/_mobile_data/api/login_status.php';

    let data = new FormData();
    data.append('operation', 'logged_out');
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

        if (response == 'logout') {
          this.events.publish('user:removed', this.sName, Date.now());
          // this.storage.set('st_data', '');
          this.storage.set('selected', '');
          this.storage.set('installs', '');
          this.storage.set('news', '');
          this.storage.set('events', '');
        }

      }, error => {
        // this.loader.dismiss();
      });
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
          this.events.publish('user:removed', this.sName, Date.now());
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

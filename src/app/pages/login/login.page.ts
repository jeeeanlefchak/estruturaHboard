import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit, Inject, ViewChildren } from '@angular/core';
import { User } from 'src/app/models/user';
import { LoadingController, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  signinForm: FormGroup;

  public typePassword = 'password';
  public iconPassword = 'eye-off';
  @ViewChildren('password') myInputPassword;
  authenticationState = new BehaviorSubject(false);

  constructor(
    private auth: AuthenticationService,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController,
    @Inject('configurations') private storgeConfigurations: Storage,
    private tokenService: TokenService,
    private modalCtrl: ModalController,
    private router: Router
  ) {

    //let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.signinForm = this.formBuilder.group({
      //login: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      login: ['', Validators.compose([Validators.required])],
      password: [''],
    });
  }

  ngOnInit() {
  }

  async onSubmit() {
    let user: User;
    let formUser = this.signinForm.value as User;

    formUser.login = formUser.login.trim().toLowerCase();
    formUser.password = formUser.password.trim();

    /* const loading = await this.loadingController.create({
      message: 'Login...'
    });

    await loading.present(); */

    await this.auth.login(formUser).then(r => {
      console.log(r);
      this.storgeConfigurations.get('accessToken').then(res => {
        console.log(res);
      })
    });

  }

  click() {
    this.auth.checkToken();
  }

  public viewerSenha = function () {
    if (this.typePassword == 'password') {
      this.typePassword = 'text';
      this.iconPassword = 'eye'
    } else {
      this.typePassword = 'password';
      this.iconPassword = 'eye-off'
    }
    setTimeout(() => {
      this.myInputPassword.setFocus();
    }, 0);
  }


  public pressEnter(event) {
    if (event.keyCode == 13) {
      this.onSubmit();
    }
  }

}

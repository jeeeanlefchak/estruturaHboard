import { Component, OnInit, NgModule } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MenuController, IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthenticateUser } from 'src/app/models/authenticate-user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from 'src/app/services/shared/EventsService';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  userLogged: AuthenticateUser;

  constructor(private authenticationService: AuthenticationService, private menu: MenuController,
    public domSanitizer: DomSanitizer, private router: Router, private auth: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.loggedUser.subscribe((user) => {
      this.userLogged = user;
      // console.log("user", user)
    })
  }

  public navigate(url: string) {
    this.router.navigateByUrl(url);
  }

  logout() {
    this.auth.logout();
  }
  closeMenu() {
    this.menu.close();
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [
    MenuComponent
  ],
  exports: [
    MenuComponent
  ]
})
export class MenuComponentModule { }

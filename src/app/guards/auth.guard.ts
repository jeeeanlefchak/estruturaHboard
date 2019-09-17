import { AuthenticationService } from './../services/authentication.service';
import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';


@Injectable()

export class AuthGuard implements CanActivate{
    public constructor (private router: Router, private auth: AuthenticationService){

    }

    public canActivate(){
        return this.auth.isAuthenticated();
    }
}
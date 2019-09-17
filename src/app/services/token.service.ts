import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  token: any;

  constructor(@Inject('configurations') private storgeConfigurations: Storage,
              private jwtHelper: JwtHelperService) {
    this.storgeConfigurations.get('accessToken').then((res)=>{
      this.token = res
    });
  }
  
  getDecodeToken(token?: string){
    let decodedToken: any = undefined;    
    if(token){
      decodedToken = this.jwtHelper.decodeToken(token)
    }else{
      if(this.token !== 'null'){
        decodedToken = this.jwtHelper.decodeToken(this.token)
      }
    }
    
    return decodedToken;
  }
}

import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataStoreService } from '../../data-store.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private dss: DataStoreService, private http: HttpClient, private router: Router) { }
  response: string = '';
  emailInput = '';
  passwordInput = '';
  rememberMe = false;
  site = "appliance";
  payload: any;
  receivedData: any;
  loggedIn = 'none';
  loading = false;
  submit() {
    this.loading = true;
    this.payload = {
      "username": this.emailInput,
      "password": this.passwordInput,
      "site": this.site
    };
    this.http.post("/v2/login/", this.payload)
      .subscribe(
        (response) => {
          this.receivedData = JSON.parse(this.dss.getPayload());
          this.loggedIn = 'true';
          setTimeout(() => {}, 1000);
          const token = (response as any).refresh_token;
          sessionStorage.setItem('token', token);
          this.receivedData["user-tenants"] = (response as any).user.tenants;
          this.receivedData["site"] = this.site;
          this.dss.setPayload(JSON.stringify(this.receivedData));
          this.dss.setSite(this.site);
          this.dss.setemail(this.emailInput);
          
          this.dss.settenants(JSON.stringify((response as any).user.tenants));
          this.router.navigate(['/dashboard']);
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          console.error('Failed to retrieve token:', error);
          this.loggedIn = 'false'; 

        }
      );
  }
}
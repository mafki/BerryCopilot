import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule,HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DataStoreService } from '../../../data-store.service';

@Component({
  selector: 'app-vault',
  standalone: true,
  imports: [HttpClientModule,FormsModule],
  templateUrl: './vault.component.html',
  styleUrl: './vault.component.css'
})
export class VaultComponent implements OnInit {
  @Output() dataEvent = new EventEmitter<any>();



constructor(private router: Router,private dss:DataStoreService,private http: HttpClient) { }

  role: string = 'dev';
  vault:boolean = false;
  Email:string="";
  Password:string="";
  fullpath:string="";
  islogin: boolean = false;
  response: string = '';
  loading: boolean = false;
  trylogin: any ;
  keys: string[] = [];

  


  ngOnInit(): void {
    if (sessionStorage.getItem('vault_token')) {
      this.vault = true;
      this.fetch('/');
      
    }
  }



  login(){
    this.loading = true;
    let roleValue = this.role.trim() === '' ? 'dev' : this.role;
    let data = `roleValue=${roleValue}&emailValue=${this.Email}&passwordValue=${this.Password}`;
    console.log(data)
    this.http.post<any>('/v2/vault_login/', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      .subscribe(
        (response) => {
          this.response = response;
          if (response && response.login_status === 'success') {
            const token=(this.response as any)['client_token']
            sessionStorage.setItem('vault_token', token);
            this.trylogin = true;
            this.loading=false;
            this.islogin = true;
            
          } else {
            this.loading = false;
            this.trylogin = false;
          
          }
        },
        (error) => {
          console.error('Request failed:', error);
          
        }
      );
  }
  fetch(path: string, retryCount: number = 1) {
    this.loading = true;
    this.vault = true;
    let headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
    });
    let clientToken = sessionStorage.getItem('vault_token');
    var tmp = this.fullpath;
    this.fullpath = this.fullpath + path;
    let payload = "client_token=" + clientToken + "&&path=" + this.fullpath;
    this.http.post("/v2/fetch_folders_list/", payload, { headers: headers })
        .subscribe(
            (response) => {
                const responseData = response as any;
                if (responseData && responseData.data) {
                    if (responseData.data.keys) {
                        this.keys = responseData.data.keys;
                    } else {
                        this.dss.setPayload(JSON.stringify(responseData.data));
                        this.dataEvent.emit('Data from child');
                        this.fullpath = tmp;
                        console.log(this.fullpath);
                    }
                    this.loading = false;
                } else {
                    console.error('Keys not found in the response');
                }
            },
            (error) => {
                console.error('Failed to retrieve data:', error);
                const result = JSON.parse(error.error.response).errors.find((item: any) => item === "permission denied");
                if (result) {
                    this.vault = false;
                    this.islogin = false;
                }
                if (retryCount > 0) {
                    console.log(`Retrying... (${retryCount} attempts left)`);
                    this.fetch(path, 0); 
                }
            }
        );

}

  back(){
    this.loading = true;
    this.vault = true;
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let clientToken = sessionStorage.getItem('vault_token');
    this.fullpath= this.removeLastSegment(this.fullpath);
    let payload = "client_token=" + clientToken+"&&path="+this.fullpath;
    this.http.post("/v2/fetch_folders_list/", payload, { headers: headers })
      .subscribe(
        (response) => {
          const responseData = response as any; 
          if (responseData && responseData.data ) {
            if(responseData.data.keys){
              this.keys = responseData.data.keys;
            }
            this.loading = false;
            
          } else {
            console.error('Keys not found in the response');
          }
        },
        (error) => {
          console.error('Failed to retrieve data:', error);
          const result = JSON.parse(error.error.response).errors.find((item:any ) => item === "permission denied");
          if(result){
            this.vault = false;
            this.islogin = false;
          }
        }
      );
  }
  


  removeLastSegment(url: string): string {
    if (!url) return '/';
    const segments = url.split('/').filter(Boolean); 
    if (segments.length === 1) return '/';
    segments.pop();
    const updatedUrl = `/${segments.join('/')}`; 
    return updatedUrl.endsWith('/') ? updatedUrl : updatedUrl + '/'; 
  }

}

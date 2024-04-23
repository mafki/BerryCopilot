import { Component,OnInit } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { DataStoreService } from '../../data-store.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  name: string = '';
  site: string = '';
  loading = true;
  payload: any ;
  pkis: any = [
    { id: 5846 ,name: "BerryCopilot-pki-1713765514889",engine:"MICROSOFT", status: "Active", is_shared: true },
    { id: 5846 ,name: "BerryCopilot-pki-1713765514889",engine:"MICROSOFT", status: "Active", is_shared: true },
    { id: 5846 ,name: "BerryCopilot-pki-1713765514889",engine:"MICROSOFT", status: "Active", is_shared: true },
    { id: 5846 ,name: "BerryCopilot-pki-1713765514889",engine:"MICROSOFT", status: "Active", is_shared: true },
    // Add more items as needed
  ];
  server: any = [
    { id: 5846 ,name: "BerryCopilot-pki-1713765514889",engine:"MICROSOFT", status: "Active", is_shared: true },
    { id: 5846 ,name: "BerryCopilot-pki-1713765514889",engine:"MICROSOFT", status: "Active", is_shared: true },
    { id: 5846 ,name: "BerryCopilot-pki-1713765514889",engine:"MICROSOFT", status: "Active", is_shared: true },
    { id: 5846 ,name: "BerryCopilot-pki-1713765514889",engine:"MICROSOFT", status: "Active", is_shared: true },
    // Add more items as needed
  ];
  x: number = 1;
  x1: number = 1;
  clientToken = sessionStorage.getItem('token');
  tenants =  Object.keys(JSON.parse((JSON.parse(sessionStorage.getItem('data') as any)['tenant'])));

  constructor(private http: HttpClient,private router:Router ,private dss: DataStoreService) { }
  ngOnInit(): void {
    this.name = (JSON.parse(sessionStorage.getItem('data') as any)['email']);
    this.site = (JSON.parse(sessionStorage.getItem('data') as any)['site']);
    this.payload = JSON.parse(this.dss.getPayload());
    this.payload["site"] = this.site
    //this.getpkis();
    //this.getserver();
  }
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  getpkis() {
      var data = {
        "client_token": this.clientToken,
        "data": this.payload
      };
      
      this.payload["tenant"] = this.tenants[this.x]
      this.http.post("/v2/get_pkis_list/", data)
        .subscribe(
          (response: any) => {
            this.pkis.push(...response);
            console.log(this.pkis);
            if(this.pkis.length >=3){
              this.pkis= this.pkis.slice(0,3);
              this.loading = false;
            }else{
            this.loading = false;
            this.x++;
            this.getpkis();
          }
          },
          (error) => {
            console.error('Failed to retrieve data:', error.error);
          }
        );
    
  }
  truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) {
      return str;
    } else {
      return str.substring(0, maxLength) + '...';
    }
  }
  getserver() {
    var data = {
      "client_token": this.clientToken,
      "data": this.payload
    };
    
    this.payload["tenant"] = this.tenants[this.x1]
    this.http.post("/v2/get_servers_list/", data)
      .subscribe(
        (response: any) => {
          this.server.push(...response);
          console.log(this.server);
          if(this.server.length >=3){
            this.server= this.server.slice(0,3);
            this.loading = false;
          }else{
          this.loading = true;
          this.x1++;
          this.getserver();
        }
        },
        (error) => {
          console.error('Failed to retrieve data:', error.error);
        }
      );
  
}
}

import { Component, OnInit } from '@angular/core';
import { DataStoreService } from '../../../data-store.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pki-result',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './pki-result.component.html',
  styleUrl: './pki-result.component.css'
})
export class PkiResultComponent implements OnInit {
  status: any;
  progress = '90%';
  clientToken = sessionStorage.getItem('token');
  receivedData: any;
  payload: any;
  response: any;
  error: boolean = false;


  constructor(private http: HttpClient, private dss: DataStoreService, private router: Router) { }

  ngOnInit(): void {
    var nav=(JSON.parse(sessionStorage.getItem('data') as any)['nav'])
    this.receivedData = JSON.parse(this.dss.getPayload());
    this.receivedData["tenant"] = (JSON.parse(sessionStorage.getItem('data') as any)['tenantid']);
    this.receivedData["site"] = (JSON.parse(sessionStorage.getItem('data') as any)['site'])
    try {
      this.progress = "20%";
      this.payload = {
        "client_token": this.clientToken,
        "data": this.receivedData
      };
      this.http.post("/v2/create_credentials/", this.payload)
        .subscribe(
          (response: any) => {
            this.progress = "40%";
            this.receivedData["cred-id"] = response.id;
            this.http.post("/v2/create_pki/", this.payload)
              .subscribe(
                (response: any) => {
                  this.progress = "60%";
                  this.receivedData["pki-id"] = response.id;
                  this.dss.setPayload(JSON.stringify(this.receivedData));
                  this.http.post("/v2/sync_pki/", this.payload).subscribe(
                    (response) => {
                      this.progress = "80%";
                      if(nav=="2"){
                        setTimeout(() => {
                        this.router.navigate(['/create-usage-form']);
                        }, 2000);
                      }else if(nav=="1"){
                      setTimeout(() => {
                        this.progress = "100%";
                        this.status = true;
                      }, 2000);
                    }
                    },
                    (error) => {
                      console.error('Failed to retrieve data:', error);
                      this.status = false
                      this.error = true
                      this.response = JSON.stringify(error.error);
                    }
                  );

                },
                (error) => {
                  console.error('Failed to retrieve data:', error);
                  this.status = false
                  this.error = true;
                  this.response = JSON.stringify(error.error);
                }
              );

          },
          (error) => {
            console.error('Failed to retrieve data:', error.error.error);
            this.status = false
            this.error = true;
            this.response = JSON.stringify(error.error);

          }
        );
    }
    catch (e) {
    }
  }

}

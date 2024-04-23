import { Component, OnInit } from '@angular/core';
import { DataStoreService } from '../../../data-store.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-scan-result',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './scan-result.component.html',
  styleUrl: './scan-result.component.css'
})
export class ScanResultComponent implements OnInit {
  status: any;
  progress = '60%';
  clientToken = sessionStorage.getItem('token');
  receivedData: any;
  payload: any;
  response: any;
  error: boolean = false;


  constructor(private http: HttpClient, private dss: DataStoreService) { }

  ngOnInit(): void {
    this.receivedData = JSON.parse(this.dss.getPayload());
    this.receivedData["tenant"] = (JSON.parse(sessionStorage.getItem('data') as any)['tenantid']);
    this.receivedData["site"] = (JSON.parse(sessionStorage.getItem('data') as any)['site'])
    console.log(this.receivedData);
    try {
      this.payload = {
        "client_token": this.clientToken,
        "data": this.receivedData
      };
      
      this.http.post("/v2/create_scan/", this.payload)
          .subscribe(
            (response: any) => {
              this.progress = "80%";
              setTimeout(() => {
                this.progress = "100%";
                this.status=true;
              }, 1000);
            },
            (error) => {
              console.error('Failed to retrieve data:', error);
              this.status=false;
              this.error=true;
              this.response=JSON.stringify(error.error);
            }
          );

    } catch (error) {}
  }
}
import { Component, OnInit } from '@angular/core';
import { DataStoreService } from '../../../data-store.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-usage-result',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './usage-result.component.html',
  styleUrl: './usage-result.component.css'
})
export class UsageResultComponent implements OnInit {
  status: any;
  progress = '80%';
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
      this.http.post("/v2/create_usage/", this.payload)
        .subscribe(
          (response: any) => {
            this.progress = "100%";
            this.status = true;
          },
          (error) => {
            console.error('Failed to retrieve data:', error);
            this.status = false
            this.error = true;
            this.response = JSON.stringify(error.error);
          }
        );

    } catch (error) { }
  }
}
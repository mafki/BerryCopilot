import { Component, OnInit} from '@angular/core';
import { DataStoreService } from '../../../data-store.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-create-scan-form',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './create-scan-form.component.html',
  styleUrl: './create-scan-form.component.css'
})
export class CreateScanFormComponent implements OnInit {
  receivedData: any;
  types: any;
  response = '';
  name = '';
  currentDate: any;
  sst="";
  fsp=["/etc/ssl/"];
  cpd="pwd";
  clientToken = sessionStorage.getItem('token');
  payload = {};
  listac: any;
  servertype: any;
  listpro: any;
  servers: any;
  restartcommand="service apache2 reload";
  configpath="/etc/apache2/apache2.conf"
  type: any;
  loading = false;
  constructor(private dss: DataStoreService, private router: Router, private http: HttpClient) { }
  ngOnInit(): void {
    this.currentDate = new Date();
    this.receivedData = JSON.parse(this.dss.getPayload());
    console.log(this.receivedData);
    this.receivedData["tenant"] = (JSON.parse(sessionStorage.getItem('data') as any)['tenantid']);
    this.receivedData["site"] = (JSON.parse(sessionStorage.getItem('data') as any)['site'])
    this.name = "BerryCopilot-scan-" + this.currentDate.getTime();
    this.gettypes()
    this.servers =this.receivedData["server-name"];
    
  }

  
  

  save(): void {
    this.receivedData['scan-name'] = this.name;
    this.receivedData['type'] = this.type;
    this.receivedData['cpd'] = this.cpd;
    this.receivedData['fsp'] = this.fsp;
    this.receivedData['restartcommand'] = this.restartcommand;
    this.receivedData['configpath'] = this.configpath;
    this.receivedData['servertype']=this.servertype;
    this.dss.setPayload(JSON.stringify(this.receivedData));
  }



  gettypes() {
    this.payload = {
      "client_token": this.clientToken,
      "data": this.receivedData
    }
    this.http.post("/v2/get_types/", this.payload)
      .subscribe(
        (response: any) => {
          this.response = response;
          this.types = (this.response as any)["pki_types"];
          this.defaulttype();
          this.loading = true;
          
          
        }
      );
    (error: any) => {
      console.error('Failed to retrieve data:', error);
      
      this.response = JSON.stringify(error.error);
    }
  }

  defaulttype() {
    for (let i = 0; i < (this.types as any).length; i++) {
      if (this.types[i]["value"] == this.receivedData["type"]) {
        this.type= this.types[i]["value"]
        
        break
      }
    }
  }
  next(){
    this.save();
    this.router.navigate(['/scan-result']);
  }

}

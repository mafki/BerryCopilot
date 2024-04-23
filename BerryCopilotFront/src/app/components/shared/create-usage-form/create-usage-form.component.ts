import { Component, OnInit} from '@angular/core';
import { DataStoreService } from '../../../data-store.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-create-usage-form',
  standalone: true,
  imports: [FormsModule,HttpClientModule],
  templateUrl: './create-usage-form.component.html',
  styleUrl: './create-usage-form.component.css'
})
export class CreateUsageFormComponent implements OnInit {

  receivedData: any;
  types: any;
  response = '';
  name = '';
  currentDate: any;
  eep="";
  key_t: any; 
  key_s: any;
  dcsr: any;
  csrn = true;
  csry = false;
  cp: any;
  cpr: any;
  ca: any;
  pki: any;
  clientToken = sessionStorage.getItem('token');
  payload = {};
  listac: any;
  listpro: any;
  listeep: any;
  actrue = false;
  type: any;
  loading = false;

  constructor(private router:Router,private dss: DataStoreService,private http:HttpClient) {}
  ngOnInit(): void {
    this.currentDate = new Date();
    this.receivedData = JSON.parse(this.dss.getPayload());
    this.receivedData["tenant"] = (JSON.parse(sessionStorage.getItem('data') as any)['tenantid']);
    this.receivedData["site"] = (JSON.parse(sessionStorage.getItem('data') as any)['site'])
    this.name = "BerryCopilot-usage-" + this.currentDate.getTime();
    this.pki = this.receivedData['pki-name'];
    this.gettypes()
    this.getca();
    this.cp = '1'
    this.key_t = 'RSA'
    this.key_s = '2048'
    this.dcsr = 'BERRYCERT_GENERATION_KEYPAIRS'
  }
  check(){}
  next(){
    this.save();
    this.router.navigate(['/usage-result']);
  }
  getca() {
    this.payload = {
      "client_token": this.clientToken,
      "data": this.receivedData
    }
    this.http.post("/v2/get_certificate_authorities/", this.payload)
      .subscribe(
        (response: any) => {
          this.response = response;
          this.listac = this.response;
          this.defaultca();
          this.getpro();
        }
      );
    (error: any) => {
      console.error('Failed to retrieve data:', error);
      this.csry = false;
      this.csrn = true;
      this.response = JSON.stringify(error.error);
    }
  }
  getpro() {
    this.payload = {
      "client_token": this.clientToken,
      "data": this.receivedData
    }
    this.http.post("/v2/get_certificate_profiles/", this.payload)
      .subscribe(
        (response: any) => {
          this.response = response;
          this.listpro = this.response;
          this.defaultpro()
        }
      );
    (error: any) => {
      console.error('Failed to retrieve data:', error);
      this.csry = false;
      this.csrn = true;
      this.response = JSON.stringify(error.error);
    }
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
          this.geteep();
          
          
        }
      );
    (error: any) => {
      console.error('Failed to retrieve data:', error);
      this.csry = false;
      this.csrn = true;
      this.response = JSON.stringify(error.error);
    }
  }
  geteep() {
    this.payload = {
      "client_token": this.clientToken,
      "data": this.receivedData
    }
    this.http.post("/v2/get_end_entity_profiles/", this.payload)
      .subscribe(
        (response: any) => {
          this.response = response;
          this.listeep = this.response;
          this.check();
          this.loading=true;

          
        }
      );
    (error: any) => {
      console.error('Failed to retrieve data:', error);
      this.csry = false;
      this.csrn = true;
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

  defaultpro() {
    if ("MICROSOFT" == this.receivedData["type"] && this.actrue == true) {
      for (let i = 0; i < (this.listpro as any).length; i++) {
        if (this.listpro[i]["name"] == "WebServer") {
          this.cpr = this.listpro[i]["id"]
          break
        }
      }
    }else if("EJBCACE" == this.receivedData["type"] && this.actrue == true)
    {
      for (let i = 0; i < (this.listpro as any).length; i++) {
        if (this.listpro[i]["name"] == "ENDUSER") {
          this.cpr = this.listpro[i]["id"]
          break
        }
      }
    }
  }
  defaultca() {
    if ("MICROSOFT" == this.receivedData["type"] ) {
      for (let i = 0; i < (this.listac as any).length; i++) {
        if (this.listac[i]["name"] == "dby-TEST-CA") {
          this.ca = this.listac[i]["id"]
          this.actrue = true;
          break
        }
      }
    }else if("EJBCACE" == this.receivedData["type"] )
    {
      for (let i = 0; i < (this.listac as any).length; i++) {
        if (this.listac[i]["name"] == "ManagementCA") {
          this.ca = this.listac[i]["id"]
          this.actrue = true;
          break
        }
      }
    
    }
  }

  save(): void {
    this.receivedData['usage-name'] = this.name;
    this.receivedData['ca'] = this.ca;
    this.receivedData['cp'] = this.cp;
    this.receivedData['cpr'] = this.cpr;
    this.receivedData['key_t'] = this.key_t;
    this.receivedData['key_s'] = this.key_s;
    this.receivedData['dcsr'] = this.dcsr;
    this.receivedData['type'] = this.type;
    this.receivedData['eep'] = this.eep ;
    this.dss.setPayload(JSON.stringify(this.receivedData));
  }

}

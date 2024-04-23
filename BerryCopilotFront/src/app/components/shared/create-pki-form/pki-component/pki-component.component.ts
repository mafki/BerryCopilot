import { Component,OnInit,OnChanges,Input,SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataStoreService } from '../../../../data-store.service';
import { HttpClient,HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-pki-component',
  standalone: true,
  imports: [FormsModule,HttpClientModule],
  templateUrl: './pki-component.component.html',
  styleUrl: './pki-component.component.css'
})
export class PkiComponentComponent implements OnInit,OnChanges{
  @Input() parentData!: string;

  name: string = '';
  type: any;
  types: any;
  ip: string = '';
  port: string = '';
  receivedData: any;
  clientToken = sessionStorage.getItem('token');


  tosync = 10;

  constructor(private dss: DataStoreService,private http:HttpClient) { }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['parentData']) {
      setTimeout(() => {
      this.save()
      }, 700);
      // Perform any necessary actions here
    }
  }

  ngOnInit() {
    let currentDate = new Date();
    this.receivedData = JSON.parse(this.dss.getPayload());
    this.receivedData["tenant"] = (JSON.parse(sessionStorage.getItem('data') as any)['tenantid']);
    this.receivedData["site"] = (JSON.parse(sessionStorage.getItem('data') as any)['site'])
    this.gettypes()
    this.setType();
    this.name = "BerryCopilot-pki-" + currentDate.getTime();
    this.ip = this.receivedData["FQDN"];
    this.port = this.receivedData["port"];
  }
  gettypes() {
    var payload = {
      "client_token": this.clientToken,
      "data": this.receivedData
    }
    console.log(payload)
    this.http.post("/v2/get_types/", payload)
      .subscribe(
        (response: any) => {
          this.types= (response as any)["pki_types"];
          console.log(this.types);
          
        }
      );
    (error: any) => {
      console.error('Failed to retrieve data:', error);
    }
  }
  setType(): void {
    this.type = this.receivedData["protocol"] === 'WINRM' ? 'MICROSOFT' : '';
    if (this.receivedData['protocol'] === 'WINRM') {
      this.type = 'MICROSOFT';
    } else if (this.receivedData['protocol'] === 'TLS' && this.receivedData['description'].indexOf("EE") !== -1) {
      this.type = 'EJBCA';
    }
    else if (this.receivedData['protocol'] === 'TLS' ) {
      this.type = 'EJBCACE';
    }
    else {
      this.type = 'none';
    }

  }
  save() {
    this.receivedData["tosync"] = this.tosync;
    this.receivedData["type"] = this.type;
    this.receivedData["pki-name"] = this.name;
    this.receivedData["ip"] = this.ip;
    this.receivedData["port"] = this.port;
    this.receivedData["syncstatus"] = true;
    this.dss.setPayload(JSON.stringify(this.receivedData));
  }
}

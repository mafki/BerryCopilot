import { Component,OnInit,OnChanges,Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataStoreService } from '../../../data-store.service';
@Component({
  selector: 'app-create-credentials-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-credentials-form.component.html',
  styleUrl: './create-credentials-form.component.css'
})
export class CreateCredentialsFormComponent implements OnInit,OnChanges{
  @Input() parentData2!: string;
  password: string = '';
  username: string = '';
  name: string = '';
  atype:any;
  receivedData: any;
  constructor(private dss: DataStoreService) { }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['parentData2']) {
      setTimeout(() => {
        this.save()
      }, 500);
      
    }
  }
  ngOnInit(): void {
    var currentDate = new Date();
    this.receivedData = JSON.parse(this.dss.getPayload());
    console.log(this.receivedData);
    this.setatype();
    this.username = this.receivedData["login"];
    this.password= this.receivedData["password"];
    this.name = "BerryCopilot-cred-" + currentDate.getTime();


  }

  setatype() {
    if (this.receivedData["protocol"] == "ssh" || this.receivedData["protocol"] == "SSH_PASSWORD" || this.receivedData["protocol"] == "SSH") {
      this.atype = "SSH_PASSWORD";
      this.receivedData["protocol"] = "SSH";
    } else if (this.receivedData["protocol"] == "WINRM") {
      this.atype = "WINRM_PASSWORD";
      this.receivedData["protocol"] = "WINRM";
    } else if (this.receivedData["protocol"] == "TLS_PLAIN_KEY") {
      this.atype = "TLS_PLAIN_KEY";
      this.receivedData["protocol"] = "TLS";
      //this.extractRSACertificates()
    }
  }
  save(): void {
    this.receivedData["login"] = this.username;
    this.receivedData["atype"] = this.atype;
    this.receivedData["password"] = this.password;
    this.receivedData["cred-name"] = this.name;
    this.dss.setPayload(JSON.stringify(this.receivedData));
  }

}

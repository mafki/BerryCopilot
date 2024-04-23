import { Component,OnInit,OnChanges,Input,SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataStoreService } from '../../../../data-store.service';


@Component({
  selector: 'app-server-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './server-component.component.html',
  styleUrl: './server-component.component.css'
})
export class ServerComponentComponent implements OnInit,OnChanges{
  @Input() parentData!: string;

  name: string = '';
  Protocol: any;
  fq: string = '';
  path: string = '/tmp';
  port: string = '';
  receivedData: any;
  clientToken = sessionStorage.getItem('token');



  constructor(private dss: DataStoreService) { }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['parentData']) {
      setTimeout(() => {
        console.log("zad")
        this.save();
      }, 700);
    }
  }

  ngOnInit() {
    var currentDate = new Date();
    this.receivedData = JSON.parse(this.dss.getPayload());
    this.name = "BerryCopilot-server-" + currentDate.getTime();
    this.fq = this.receivedData["FQDN"];
    this.port = this.receivedData["port"];
    this.Protocol = this.receivedData["protocol"];
    console.log(this.receivedData);
  }
  

  save() {
    this.receivedData["server-name"]=this.name;
    this.receivedData["protocol"]=this.Protocol;
    this.receivedData["FQDN"]=this.fq;
    this.receivedData["port"]=this.port;
    this.receivedData["path"]=this.path;
    this.dss.setPayload(JSON.stringify(this.receivedData));
  }
  
}

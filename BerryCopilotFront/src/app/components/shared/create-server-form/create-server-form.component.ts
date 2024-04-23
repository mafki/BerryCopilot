import { Component, OnInit} from '@angular/core';
import { VaultComponent } from '../vault/vault.component';
import { CreateCredentialsFormComponent } from '../create-credentials-form/create-credentials-form.component';
import { TenantsPickerComponent } from '../tenants-picker/tenants-picker.component';
import { ServerComponentComponent } from './server-component/server-component.component';
import { DataStoreService } from '../../../data-store.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-server-form',
  standalone: true,
  imports: [VaultComponent, CreateCredentialsFormComponent, TenantsPickerComponent,ServerComponentComponent],
  templateUrl: './create-server-form.component.html',
  styleUrl: './create-server-form.component.css'
})
export class CreateServerFormComponent implements OnInit{

  parentData: string = 'Data from parent';
  parentData2: string = 'Data from parent';

  receivedData: any;
  tenanton: boolean = false;
  loading: boolean = false;


  constructor(private router:Router,private dss: DataStoreService) {}

  ngOnInit(): void {
    
  }
  next(){
    this.parentData="start create"
    this.parentData2="start create"
    setTimeout(() => {
    this.router.navigate(['/server-result'])
    },1000);
  }
  tenanttrigger() {
    this.tenanton = true;
  }
  vaulttrigger(){
    this.loading = true;
  }
}
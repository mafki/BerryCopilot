import { Component, OnInit} from '@angular/core';
import { VaultComponent } from '../vault/vault.component';
import { CreateCredentialsFormComponent } from '../create-credentials-form/create-credentials-form.component';
import { TenantsPickerComponent } from '../tenants-picker/tenants-picker.component';
import { DataStoreService } from '../../../data-store.service';
import { PkiComponentComponent } from './pki-component/pki-component.component';
import { Router } from '@angular/router';





@Component({
  selector: 'app-create-pki-form',
  standalone: true,
  imports: [VaultComponent,CreateCredentialsFormComponent,PkiComponentComponent,TenantsPickerComponent],
  templateUrl: './create-pki-form.component.html',
  styleUrl: './create-pki-form.component.css'
})
export class CreatePkiFormComponent implements OnInit{

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
    this.router.navigate(['/pki-result'])
  }
  tenanttrigger() {
    this.tenanton = true;
  }
  vaulttrigger(){
    this.loading = true;
  }
}
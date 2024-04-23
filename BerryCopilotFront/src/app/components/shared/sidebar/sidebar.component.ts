import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataStoreService } from '../../../data-store.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
constructor(private router: Router,private dss:DataStoreService) { }
pkiauto(){
  this.dss.setnav("1");
  this.router.navigate(['/create-pki-form']);
}
usageauto(){
  this.dss.setnav("2");
  this.router.navigate(['/create-pki-form']);
}
serverauto(){
  this.dss.setnav("3");
  this.router.navigate(['/create-server-form']);
}
scansauto(){
  this.dss.setnav("4");
  this.router.navigate(['/create-server-form']);
}
dash(){
  this.router.navigate(['/dashboard']);
}
}

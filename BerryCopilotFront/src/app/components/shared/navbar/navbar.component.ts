import { Component,OnInit,HostListener } from '@angular/core';
import { Router, NavigationEnd, Event as NavigationEvent } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  currentUrl: string= '/dashboard';
//under the constructor
  constructor(private router: Router) { }

  ngOnInit() {
  }
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  @HostListener('window:storage', ['$event'])
  onStorageChange(event: StorageEvent) {
    if (event.key === 'data') {
      // React to session storage change here
      console.log('Session storage changed');
      if((JSON.parse(sessionStorage.getItem('data') as any)['nav'])=1){
        this.currentUrl = '/create-pki-form';
      }
      else if((JSON.parse(sessionStorage.getItem('data') as any)['nav'])=2){
        this.currentUrl = '/create-usage-form';
      }
      else if((JSON.parse(sessionStorage.getItem('data') as any)['nav'])=3){
        this.currentUrl = '/create-server-form';
      }
      else if((JSON.parse(sessionStorage.getItem('data') as any)['nav'])=4){
        this.currentUrl = '/create-usage-form';
      }else if(event.url === '/dashborad') {
        this.currentUrl = '/dashboard';
      
      }
      // You may want to update the currentUrl or perform other actions
    }
  }
}
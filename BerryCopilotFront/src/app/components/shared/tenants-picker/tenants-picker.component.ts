import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataStoreService } from '../../../data-store.service';

@Component({
  selector: 'app-tenants-picker',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tenants-picker.component.html',
  styleUrl: './tenants-picker.component.css',
})
export class TenantsPickerComponent implements OnInit {
  @Output() dataEvent = new EventEmitter<any>();

  keys: string[] = [];
  keys1: string[] = [];
  searchTerm: any;
  tenants: any;
  searchon: string = 'false';
  payload: any;

  constructor(private dss: DataStoreService) {}

  ngOnInit(): void {
    this.tenants = JSON.parse(
      JSON.parse(sessionStorage.getItem('data') as any)['tenant']
    );
    this.keys = Object.keys(this.tenants);
    this.payload = JSON.parse(this.dss.getPayload());
    this.dss.setPayload(JSON.stringify(this.tenants));
  }

  pick(item: any) {
    this.payload['tenant'] = item;
    this.dss.settenant(item);
    this.searchTerm=item;
    this.dataEvent.emit('Data from child');
  }

  search() {
    if (this.searchTerm != '') {
      this.searchon = 'true';
      this.keys1 = this.searchInArray(this.searchTerm, this.keys);
    } else {
      this.searchon = 'false';
    }
  }

  searchInArray(searchTerm: string, array: string[]): string[] {
    const searchTermLowerCase = searchTerm.toLowerCase();

    return array.filter((item) =>
      item.toLowerCase().includes(searchTermLowerCase)
    );
  }
}

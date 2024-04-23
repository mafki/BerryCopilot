import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantsPickerComponent } from './tenants-picker.component';

describe('TenantsPickerComponent', () => {
  let component: TenantsPickerComponent;
  let fixture: ComponentFixture<TenantsPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantsPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TenantsPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

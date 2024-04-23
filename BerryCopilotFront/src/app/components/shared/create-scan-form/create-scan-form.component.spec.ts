import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScanFormComponent } from './create-scan-form.component';

describe('CreateScanFormComponent', () => {
  let component: CreateScanFormComponent;
  let fixture: ComponentFixture<CreateScanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateScanFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateScanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

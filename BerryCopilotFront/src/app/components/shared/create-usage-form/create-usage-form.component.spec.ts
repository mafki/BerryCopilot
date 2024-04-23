import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUsageFormComponent } from './create-usage-form.component';

describe('CreateUsageFormComponent', () => {
  let component: CreateUsageFormComponent;
  let fixture: ComponentFixture<CreateUsageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUsageFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUsageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

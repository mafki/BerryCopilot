import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePkiFormComponent } from './create-pki-form.component';

describe('CreatePkiFormComponent', () => {
  let component: CreatePkiFormComponent;
  let fixture: ComponentFixture<CreatePkiFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePkiFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatePkiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

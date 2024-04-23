import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCredentialsFormComponent } from './create-credentials-form.component';

describe('CreateCredentialsFormComponent', () => {
  let component: CreateCredentialsFormComponent;
  let fixture: ComponentFixture<CreateCredentialsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCredentialsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCredentialsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServerFormComponent } from './create-server-form.component';

describe('CreateServerFormComponent', () => {
  let component: CreateServerFormComponent;
  let fixture: ComponentFixture<CreateServerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateServerFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateServerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

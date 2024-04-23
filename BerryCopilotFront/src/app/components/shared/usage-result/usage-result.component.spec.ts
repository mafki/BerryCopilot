import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageResultComponent } from './usage-result.component';

describe('UsageResultComponent', () => {
  let component: UsageResultComponent;
  let fixture: ComponentFixture<UsageResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsageResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

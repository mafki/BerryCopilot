import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PkiResultComponent } from './pki-result.component';

describe('PkiResultComponent', () => {
  let component: PkiResultComponent;
  let fixture: ComponentFixture<PkiResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PkiResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PkiResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

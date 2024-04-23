import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PkiComponentComponent } from './pki-component.component';

describe('PkiComponentComponent', () => {
  let component: PkiComponentComponent;
  let fixture: ComponentFixture<PkiComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PkiComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PkiComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

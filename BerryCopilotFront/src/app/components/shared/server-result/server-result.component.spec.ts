import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerResultComponent } from './server-result.component';

describe('ServerResultComponent', () => {
  let component: ServerResultComponent;
  let fixture: ComponentFixture<ServerResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServerResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

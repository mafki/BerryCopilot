import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerComponentComponent } from './server-component.component';

describe('ServerComponentComponent', () => {
  let component: ServerComponentComponent;
  let fixture: ComponentFixture<ServerComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

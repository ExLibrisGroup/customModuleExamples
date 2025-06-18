import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeOnlineAvailabilityCustomComponent } from './nde-online-availability-custom.component';

describe('NdeOnlineAvailabilityCustomComponent', () => {
  let component: NdeOnlineAvailabilityCustomComponent;
  let fixture: ComponentFixture<NdeOnlineAvailabilityCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeOnlineAvailabilityCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeOnlineAvailabilityCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

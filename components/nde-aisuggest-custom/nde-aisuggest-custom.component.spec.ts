import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeAISuggestCustomComponent } from './nde-aisuggest-custom.component';

describe('NdeAISuggestCustomComponent', () => {
  let component: NdeAISuggestCustomComponent;
  let fixture: ComponentFixture<NdeAISuggestCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeAISuggestCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeAISuggestCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

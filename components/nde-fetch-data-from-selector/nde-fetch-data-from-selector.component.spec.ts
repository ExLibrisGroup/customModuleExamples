import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeFetchDataFromSelectorComponent } from './nde-fetch-data-from-selector.component';

describe('NdeFetchDataFromSelectorComponent', () => {
  let component: NdeFetchDataFromSelectorComponent;
  let fixture: ComponentFixture<NdeFetchDataFromSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeFetchDataFromSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeFetchDataFromSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

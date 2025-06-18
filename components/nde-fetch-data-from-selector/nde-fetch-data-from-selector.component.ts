import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectFullDisplayRecord } from '../utils/fullDisplayRecordSelector';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'custom-nde-fetch-data-from-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nde-fetch-data-from-selector.component.html',
  styleUrl: './nde-fetch-data-from-selector.component.scss'
})
export class NdeFetchDataFromSelectorComponent {
record$ : Observable<any> |undefined;

  //this.store.select(selectFullDisplayRecord);
  public store = inject(Store);
  displaySection: { [key: string]: any } = {};

    ngOnInit() {
        console.log('NdeFetchDataFromSelectorComponent ngOnInit:');
        this.record$ = this.store.select(selectFullDisplayRecord);
        this.record$.subscribe((record) => {
            console.log('Record:', record);
            if (!record || !record.pnx || !record.pnx.display) {
                console.error('Invalid record structure:', record);
                return;
            }
            Object.keys(record.pnx.display).forEach(key => {
                this.displaySection[key] = record.pnx.display[key];
            });
        });
    }

}

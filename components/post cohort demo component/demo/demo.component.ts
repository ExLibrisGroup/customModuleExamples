import {Component, computed, inject, Input, OnInit, Signal} from '@angular/core';
import {createFeatureSelector, createSelector, Store} from "@ngrx/store";
import {Dictionary} from "@ngrx/entity";
import {toSignal} from "@angular/core/rxjs-interop";
import {AsyncPipe} from "@angular/common";
import {switchMap} from "rxjs";
import {TranslateService} from "@ngx-translate/core";


const selectFullDisplayFeature = createFeatureSelector<{ selectedRecordId: string }>('full-display');
const selectRecordId = createSelector(selectFullDisplayFeature, state => state.selectedRecordId);

const selectSearchFeature = createFeatureSelector<{ entities: Dictionary<any> }>('Search');
const selectSearchEntities = createSelector(selectSearchFeature, state => state?.entities);

const selectFullDisplayRecord = createSelector(selectRecordId, selectSearchEntities,
  (recordId, searchEntities) => searchEntities[recordId]);

const selectLanguageFeature = createFeatureSelector<{ lang: string }>('language');
const selectLanguageCode = createSelector(selectLanguageFeature, state => state.lang);

@Component({
  selector: 'custom-demo',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss'
})
export class DemoComponent implements OnInit {
  @Input() private hostComponent!: any;
  private store = inject(Store);
  private translate = inject(TranslateService);

  //store.toSignal created a signal which didn't update(bug?) use toSignal to convert the observable to a signal instead or use observable
  private recordFromStore = toSignal(this.store.select(selectFullDisplayRecord));
  recordTitleFromStore = computed(() => this.recordFromStore()?.pnx?.display?.title[0]);

  languageCode$ = this.store.select(selectLanguageCode);

  language$ = this.languageCode$.pipe(switchMap(langCode => {
    return this.translate.stream(`mypref.language.option.${langCode}`);
  }));




  ngOnInit() {
    console.log(this.hostComponent);
  }
  recordTitleFromHost() {
    return this.hostComponent.searchResult?.pnx?.display?.title[0];
  }


}

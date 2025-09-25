import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';

type UserState = { decodedJwt: { userName: string, userGroup: string } };
type DecodedJwt = UserState['decodedJwt'];
export const selectUserState = createFeatureSelector<UserState>('user');

export const selectDecodedJwt = createSelector(
  selectUserState,
  (UserState) => UserState.decodedJwt
);

@Component({
  selector: 'custom-nde-user-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nde-user-data.component.html',
  styleUrl: './nde-user-data.component.scss'
})
  
export class NdeUserDataComponent implements OnInit {
  @Input() private hostComponent!: any;
  public store = inject(Store);
  decodedJwt$!: Observable<DecodedJwt>;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    console.log('NdeUserDataComponent ngOnInit:');
    console.log(this.hostComponent);
    this.decodedJwt$ = this.store.select(selectDecodedJwt);


    this.store.select(selectDecodedJwt)
      .pipe(takeUntil(this.destroy$))
      .subscribe(decodedJwt => {
        console.log('Decoded JWT:', decodedJwt);
      });
  }

ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

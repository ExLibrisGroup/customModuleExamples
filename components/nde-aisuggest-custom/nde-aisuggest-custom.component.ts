import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { createFeatureSelector, Store } from '@ngrx/store';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs/operators';
import { ImageGeneratorService } from '../services/image-generator.service';
import { AI_TRIGGER_WORDS } from './ai-triggers';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

type SearchState = { searchParams: { q: string } };
export const selectSearchState = createFeatureSelector<SearchState>('Search');

@Component({
  selector: 'custom-nde-aisuggest-custom',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule,CommonModule],
  templateUrl: './nde-aisuggest-custom.component.html',
  styleUrls: ['./nde-aisuggest-custom.component.scss'],
})
export class NdeAISuggestCustomComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private sub!: Subscription;

  public store = inject(Store);
  private chatService = inject(ImageGeneratorService);

  searchState$!: Observable<SearchState>;
  searchTerm$!: Observable<string>;

  answer = '';
  loading = false;
  visible = false;

  expanded = false;
  isExpandable = false;
  maxLines = 7;

  @ViewChild('answerText') answerText!: ElementRef<HTMLDivElement>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.searchState$ = this.store.select(selectSearchState);
    this.searchTerm$ = this.searchState$.pipe(
      map((state) => state.searchParams.q)
    );

    this.sub = this.searchTerm$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap((term) => {
          if (!this.isAiQuery(term)) {
            this.reset();
          }
        }),
        filter((term) => this.isAiQuery(term)),
        tap(() => {
          this.loading = true;
          this.visible = true;
          this.answer = '';
          this.isExpandable = false;
        }),
        switchMap((term) => this.chatService.askQuestion(term))
      )
      .subscribe({
        next: (res) => {
          this.answer =
            res.choices?.[0]?.message?.content?.trim?.() ?? res.answer ?? '';
          this.loading = false;

          if (!this.answer) {
            this.visible = false;
          } else {
            setTimeout(() => this.checkExpandable());
          }
        },
        error: (err) => {
          console.error('GPT request failed:', err);
          this.reset();
        },
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.checkExpandable());
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  private checkExpandable() {
    if (!this.answerText) return;
    const el = this.answerText.nativeElement;

    const fullHeight = el.scrollHeight;
    const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10) || 20;
    const collapsedHeight = lineHeight * this.maxLines;

    this.isExpandable = fullHeight > collapsedHeight + 4;
    this.cdr.detectChanges();
  }

  private isAiQuery(term: string): boolean {
    if (!term) return false;
    const lower = term.toLowerCase();
    return (
      term.endsWith('?') ||
      AI_TRIGGER_WORDS.some((trigger) => lower.startsWith(trigger))
    );
  }

  private reset() {
    this.visible = false;
    this.answer = '';
    this.loading = false;
    this.isExpandable = false;
    this.expanded = false;
  }
}

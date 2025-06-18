import { Component, Input, input } from '@angular/core';
import { tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Uncomment if you need common directives like ngIf, ngFor


@Component({
  selector: 'custom-nde-online-availability-custom',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './nde-online-availability-custom.component.html',
  styleUrl: './nde-online-availability-custom.component.scss'
})
export class NdeOnlineAvailabilityCustomComponent {
  showDropdown = false;
  selectedServiceIndex = 0;
  @Input() private hostComponent!: any;
  onlineServices: any[] = [];
  issn: string | undefined;
  isbn: string | undefined;
  oclc: string | undefined;
  title: string = '';
// <a href="https://www.amazon.com/s?k=9781338878929" target="_blank">Search for this book on Amazon</a>



ngOnInit() {
  console.log('NdeOnlineAvailabilityCustomComponent ngOnInit:');
  console.log(this.hostComponent);
  this.hostComponent.viewModel$.pipe(
    tap((viewModel: any) => {
      console.log('ViewModel:', JSON.stringify(viewModel));

      this.onlineServices = [];

      // Handle directLink (string) and ariaLabel
      if (viewModel.directLink) {
        this.onlineServices.push({
          type: 'directLink',
          url: viewModel.directLink,
          ariaLabel: viewModel.ariaLabel || ''
        });
      }

      // Handle onlineLinks array
      if (Array.isArray(viewModel.onlineLinks)) {
        this.onlineServices.push(
          ...viewModel.onlineLinks.map((link: { source: string; type: string; url: string }) => ({
            ...link,
            type: 'onlineLink'
          }))
        );
      }
      // Set identifiers
      this.setIdentifiers();
      // Add custom link based on identifiers
      if (this.isbn) {
        this.onlineServices.push({
          type: 'custom',
          source: 'Amazon',
          url: `https://www.amazon.com/s?k=${this.isbn}`,
          label: 'Search on Amazon'
        });
        this.onlineServices.push({
          type: 'custom',
          source: 'WorldCat',
          url: `https://www.worldcat.org/search?q=${this.isbn}`,
          label: 'Search ISBN on WorldCat'
        });
      } else if (this.oclc) {
        this.onlineServices.push({
          type: 'custom',
          source: 'WorldCat',
          url: `https://www.worldcat.org/search?q=${this.oclc}`,
          label: 'Search OCLC on WorldCat'
        });
      }else if (this.issn) {
        this.onlineServices.push({
          type: 'custom',
          source: 'WorldCat',
          url: `https://www.worldcat.org/search?q=${this.issn}`,
          label: 'Search ISSN on WorldCat'
        });
      } else {
        this.onlineServices.push({
          type: 'custom',
          source: 'Amazon',
          url: `https://www.worldcat.org/search?q=${encodeURIComponent(this.title)}`,
          label: 'Search Title on WorldCat'
        });
      }

      console.log('Online Services:', this.onlineServices);
    })
  ).subscribe();
}

private setIdentifiers() {
  this.title = this.hostComponent.searchResult?.pnx?.display?.title?.[0] || '';
  console.log('Title:', this.title);
  this.issn = this.hostComponent.searchResult?.pnx?.addata?.issn?.[0];
  console.log('ISSN:', this.issn);
  this.isbn = this.hostComponent.searchResult?.pnx?.addata?.isbn?.[0];
console.log('ISBN:', this.isbn);
  this.oclc = this.hostComponent.searchResult?.pnx?.addata?.oclcid?.[0];
  if (this.oclc) {
    this.oclc = this.oclc.replace(/^\D+/g, ''); // Remove non-digit characters
  }
  console.log('OCLC:', this.oclc);
}

openService(service: any) {
  if (service && service.url) {
    window.open(service.url, '_blank');
  }
}


}

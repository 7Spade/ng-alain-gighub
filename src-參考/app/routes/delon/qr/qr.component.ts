import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-qr',
  standalone: true,
  templateUrl: './qr.component.html',
  imports: [SHARED_IMPORTS]
})
export class QRComponent {
  value = 'https://ng-alain.com/';
  background = '#ffffff';
  foreground = '#000000';
  level: 'L' | 'M' | 'Q' | 'H' = 'L';
  mime = 'image/png';
  padding = 10;
  size = 220;
}

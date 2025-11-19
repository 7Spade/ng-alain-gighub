import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-down-file',
  standalone: true,
  templateUrl: './downfile.component.html',
  imports: [SHARED_IMPORTS]
})
export class DownFileComponent {
  fileTypes = ['.xlsx', '.docx', '.pptx', '.pdf'];

  data = {
    otherdata: 1,
    time: new Date()
  };
}

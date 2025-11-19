import { Routes } from '@angular/router';

import { ColorService } from './color.service';
import { ColorsComponent } from './colors/colors.component';
import { GridMasonryComponent } from './gridmasonry/gridmasonry.component';
import { TypographyComponent } from './typography/typography.component';

export const routes: Routes = [
  {
    path: '',
    providers: [ColorService],
    children: [
      { path: 'gridmasonry', component: GridMasonryComponent, data: { title: '瀑布流佈局' } },
      { path: 'typography', component: TypographyComponent, data: { title: '文字排版' } },
      { path: 'colors', component: ColorsComponent, data: { title: '調色板' } }
    ]
  }
];

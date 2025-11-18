import { Component, OnInit, inject } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { SHARED_IMPORTS } from '@shared';

import { HeaderI18nComponent } from '../basic/widgets/i18n.component';

@Component({
  selector: 'layout-passport',
  template: `
    <div class="container">
      <header-i18n showLangText="false" class="langs" />
      <div class="wrap">
        <div class="top">
          <div class="head">
            <img class="logo" src="./assets/logo-color.svg" />
            <span class="title">NG-ALAIN</span>
          </div>
          <div class="desc">武林中最有影響力的《葵花寶典》；欲練神功，揮刀自宮</div>
        </div>
        <router-outlet />
        <global-footer [links]="links">
          Copyright
          <i nz-icon nzType="copyright"></i> 2023 <a href="//github.com/cipchk" target="_blank">卡色</a>出品
        </global-footer>
      </div>
    </div>
    <theme-btn />
  `,
  styleUrls: ['./passport.component.less'],
  imports: [SHARED_IMPORTS, HeaderI18nComponent]
})
export class LayoutPassportComponent implements OnInit {
  private tokenService = inject(DA_SERVICE_TOKEN);

  links = [
    {
      title: '幫助',
      href: ''
    },
    {
      title: '隱私',
      href: ''
    },
    {
      title: '條款',
      href: ''
    }
  ];

  ngOnInit(): void {
    this.tokenService.clear();
  }
}

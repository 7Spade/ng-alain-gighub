import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

/**
 * Under Development Page Component
 *
 * 企業級「開發中」頁面組件，用於展示尚未完成的功能頁面
 *
 * @example 最小化使用
 * ```html
 * <app-under-development />
 * ```
 *
 * @example 標準使用
 * ```html
 * <app-under-development
 *   [title]="'任務管理系統'"
 *   [description]="'此功能正在積極開發中，敬請期待'"
 *   [variant]="'standard'"
 * />
 * ```
 *
 * @example 詳細展示（含功能列表）
 * ```html
 * <app-under-development
 *   [title]="'藍圖協作系統'"
 *   [description]="'全新的 Git-like 分支協作模型即將上線'"
 *   [variant]="'detailed'"
 *   [features]="[
 *     '分支管理與合併',
 *     'Pull Request 審查流程',
 *     '權限分離機制',
 *     '即時數據同步'
 *   ]"
 *   [contactEmail]="'support@example.com'"
 * />
 * ```
 */
@Component({
  selector: 'app-under-development',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="under-development-container">
      <nz-card [nzBordered]="false" class="under-development-card">
        <div class="content-wrapper">
          <!-- Icon -->
          <div class="icon-container">
            <span nz-icon [nzType]="icon()" [nzTheme]="iconTheme()" class="main-icon"></span>
          </div>

          <!-- Title -->
          <h1 class="title">{{ displayTitle() }}</h1>

          <!-- Description -->
          <p class="description">{{ displayDescription() }}</p>

          <!-- Progress Indicator (for standard and detailed variants) -->
          @if (variant() !== 'minimal') {
            <div class="progress-section">
              <nz-progress
                [nzPercent]="progressPercent()"
                [nzStatus]="'active'"
                [nzStrokeColor]="{ '0%': '#108ee9', '100%': '#87d068' }"
              ></nz-progress>
              <p class="progress-text">開發進度</p>
            </div>
          }

          <!-- Features List (for detailed variant) -->
          @if (variant() === 'detailed' && features().length > 0) {
            <div class="features-section">
              <nz-divider></nz-divider>
              <h3 class="features-title">
                <span nz-icon nzType="check-circle" nzTheme="outline"></span>
                即將推出的功能
              </h3>
              <ul class="features-list">
                @for (feature of features(); track feature) {
                  <li class="feature-item">
                    <span nz-icon nzType="check" nzTheme="outline" class="feature-icon"></span>
                    {{ feature }}
                  </li>
                }
              </ul>
            </div>
          }

          <!-- Timeline (for detailed variant) -->
          @if (variant() === 'detailed' && estimatedCompletion()) {
            <div class="timeline-section">
              <nz-divider></nz-divider>
              <nz-alert nzType="info" [nzMessage]="'預計完成時間'" [nzDescription]="estimatedCompletion()" nzShowIcon></nz-alert>
            </div>
          }

          <!-- Contact Section (for detailed variant) -->
          @if (variant() === 'detailed' && (contactEmail() || showFeedback())) {
            <div class="contact-section">
              <nz-divider></nz-divider>
              <div class="contact-content">
                <h4 class="contact-title">
                  <span nz-icon nzType="mail" nzTheme="outline"></span>
                  需要此功能？
                </h4>
                <p class="contact-text"> 如果您對此功能有建議或需求，歡迎與我們聯繫 </p>
                @if (contactEmail()) {
                  <a [href]="'mailto:' + contactEmail()" class="contact-link">
                    <button nz-button nzType="primary" nzSize="large">
                      <span nz-icon nzType="mail"></span>
                      聯繫開發團隊
                    </button>
                  </a>
                }
                @if (showFeedback()) {
                  <button nz-button nzType="default" nzSize="large" class="feedback-button">
                    <span nz-icon nzType="message"></span>
                    提供反饋
                  </button>
                }
              </div>
            </div>
          }

          <!-- Back Button -->
          @if (showBackButton()) {
            <div class="action-section">
              <button nz-button nzType="default" nzSize="large" (click)="goBack()">
                <span nz-icon nzType="arrow-left"></span>
                返回
              </button>
            </div>
          }
        </div>
      </nz-card>
    </div>
  `,
  styles: [
    `
      .under-development-container {
        min-height: 500px;
        height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      }

      .under-development-card {
        max-width: 800px;
        width: 100%;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }

      .content-wrapper {
        text-align: center;
        padding: 32px 24px;
      }

      .icon-container {
        margin-bottom: 24px;
      }

      .main-icon {
        font-size: 80px;
        color: #1890ff;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.05);
          opacity: 0.8;
        }
      }

      .title {
        font-size: 28px;
        font-weight: 600;
        color: #262626;
        margin-bottom: 16px;
      }

      .description {
        font-size: 16px;
        color: #595959;
        margin-bottom: 32px;
        line-height: 1.6;
      }

      .progress-section {
        max-width: 400px;
        margin: 0 auto 32px;
      }

      .progress-text {
        margin-top: 8px;
        font-size: 14px;
        color: #8c8c8c;
      }

      .features-section {
        margin-top: 32px;
        text-align: left;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
      }

      .features-title {
        font-size: 18px;
        font-weight: 500;
        color: #262626;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .features-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .feature-item {
        padding: 8px 0;
        font-size: 15px;
        color: #595959;
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }

      .feature-icon {
        color: #52c41a;
        margin-top: 4px;
        flex-shrink: 0;
      }

      .timeline-section {
        margin-top: 32px;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
      }

      .contact-section {
        margin-top: 32px;
      }

      .contact-content {
        max-width: 500px;
        margin: 0 auto;
      }

      .contact-title {
        font-size: 16px;
        font-weight: 500;
        color: #262626;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: center;
      }

      .contact-text {
        font-size: 14px;
        color: #8c8c8c;
        margin-bottom: 16px;
      }

      .contact-link {
        display: inline-block;
        margin-right: 8px;
      }

      .feedback-button {
        margin-left: 8px;
      }

      .action-section {
        margin-top: 32px;
      }

      @media (max-width: 768px) {
        .under-development-container {
          padding: 16px;
          height: auto;
          min-height: 100vh;
        }

        .main-icon {
          font-size: 60px;
        }

        .title {
          font-size: 24px;
        }

        .description {
          font-size: 14px;
        }

        .features-section {
          padding: 0 16px;
        }

        .contact-link,
        .feedback-button {
          display: block;
          width: 100%;
          margin: 8px 0;
        }
      }
    `
  ]
})
export class UnderDevelopmentComponent {
  // Input signals
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly icon = input<string>('build');
  readonly iconTheme = input<'fill' | 'outline' | 'twotone'>('outline');
  readonly variant = input<'minimal' | 'standard' | 'detailed'>('standard');
  readonly progressPercent = input<number>(35);
  readonly features = input<string[]>([]);
  readonly estimatedCompletion = input<string>('');
  readonly contactEmail = input<string>('');
  readonly showFeedback = input<boolean>(false);
  readonly showBackButton = input<boolean>(true);

  // Computed signals for display text
  readonly displayTitle = computed(() => {
    return this.title() || '功能開發中';
  });

  readonly displayDescription = computed(() => {
    return this.description() || '此功能正在積極開發中，我們將盡快為您提供完整的功能體驗';
  });

  /**
   * Navigate back in browser history
   */
  goBack(): void {
    window.history.back();
  }
}

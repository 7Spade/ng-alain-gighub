import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface QualityInspection {
  readonly id: string;
  readonly task_name: string;
  readonly inspector: string;
  readonly inspection_date: string;
  readonly status: 'pending' | 'passed' | 'failed' | 'conditional_pass';
  readonly score: number;
  readonly location: string;
  readonly weather: string;
  readonly temperature: string;
}

interface InspectionItem {
  readonly id: string;
  readonly category: string;
  readonly item_name: string;
  readonly standard: string;
  readonly result: 'pass' | 'fail' | 'na';
  readonly measured_value?: string;
  readonly notes?: string;
}

interface InspectionPhoto {
  readonly id: string;
  readonly url: string;
  readonly description: string;
  readonly timestamp: string;
}

interface InspectionHistory {
  readonly id: string;
  readonly action: string;
  readonly operator: string;
  readonly timestamp: string;
  readonly notes: string;
}

@Component({
  selector: 'app-quality-inspection-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './quality-inspection-detail.html',
  styleUrl: './quality-inspection-detail.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QualityInspectionDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(NzMessageService);

  // Signals for state management
  loading = signal<boolean>(true);
  inspection = signal<QualityInspection | null>(null);
  inspectionItems = signal<InspectionItem[]>([]);
  photos = signal<InspectionPhoto[]>([]);
  history = signal<InspectionHistory[]>([]);
  error = signal<string | null>(null);

  // Computed properties
  statusColor = computed(() => {
    const insp = this.inspection();
    if (!insp) return 'default';
    switch (insp.status) {
      case 'passed':
        return 'success';
      case 'failed':
        return 'error';
      case 'conditional_pass':
        return 'warning';
      case 'pending':
        return 'processing';
      default:
        return 'default';
    }
  });

  statusText = computed(() => {
    const insp = this.inspection();
    if (!insp) return '';
    switch (insp.status) {
      case 'passed':
        return '合格';
      case 'failed':
        return '不合格';
      case 'conditional_pass':
        return '條件性通過';
      case 'pending':
        return '待審查';
      default:
        return insp.status;
    }
  });

  passRate = computed(() => {
    const items = this.inspectionItems();
    if (items.length === 0) return '0%';
    const passCount = items.filter(item => item.result === 'pass').length;
    return `${Math.round((passCount / items.length) * 100)}%`;
  });

  totalItems = computed(() => this.inspectionItems().length);
  passedItems = computed(() => this.inspectionItems().filter(item => item.result === 'pass').length);
  failedItems = computed(() => this.inspectionItems().filter(item => item.result === 'fail').length);

  ngOnInit(): void {
    const inspectionId = this.route.snapshot.paramMap.get('id');
    if (inspectionId) {
      this.loadInspection(inspectionId);
    } else {
      // Load with mock data for demonstration
      this.loadMockData();
    }
  }

  private loadMockData(): void {
    // Simulate API call delay
    setTimeout(() => {
      this.inspection.set({
        id: 'qc-001',
        task_name: '二樓結構混凝土澆置',
        inspector: '品管工程師 張三',
        inspection_date: '2025-11-16 14:30:00',
        status: 'passed',
        score: 92,
        location: 'XX 商業大樓 2F',
        weather: '晴天',
        temperature: '22°C'
      });

      this.inspectionItems.set([
        {
          id: 'item-1',
          category: '混凝土品質',
          item_name: '抗壓強度',
          standard: '≥ 30 MPa',
          result: 'pass',
          measured_value: '32.5 MPa',
          notes: '符合規範要求'
        },
        {
          id: 'item-2',
          category: '混凝土品質',
          item_name: '坍度測試',
          standard: '180 ± 20 mm',
          result: 'pass',
          measured_value: '175 mm'
        },
        {
          id: 'item-3',
          category: '施工品質',
          item_name: '鋼筋綁紮',
          standard: '符合設計圖說',
          result: 'pass',
          notes: '綁紮牢固，間距符合要求'
        },
        {
          id: 'item-4',
          category: '施工品質',
          item_name: '模板支撐',
          standard: '穩固無晃動',
          result: 'pass'
        },
        {
          id: 'item-5',
          category: '安全檢查',
          item_name: '作業人員防護',
          standard: '完整配戴安全裝備',
          result: 'pass',
          notes: '全員配戴安全帽與安全帶'
        },
        {
          id: 'item-6',
          category: '環境檢查',
          item_name: '施工環境整潔',
          standard: '無雜物堆積',
          result: 'fail',
          notes: '局部區域有材料散落，需立即清理'
        }
      ]);

      this.photos.set([
        {
          id: 'photo-1',
          url: 'https://via.placeholder.com/400x300?text=混凝土澆置全景',
          description: '混凝土澆置全景照片',
          timestamp: '2025-11-16 14:35:00'
        },
        {
          id: 'photo-2',
          url: 'https://via.placeholder.com/400x300?text=鋼筋綁紮細部',
          description: '鋼筋綁紮細部照片',
          timestamp: '2025-11-16 14:40:00'
        },
        {
          id: 'photo-3',
          url: 'https://via.placeholder.com/400x300?text=坍度測試',
          description: '坍度測試現場照片',
          timestamp: '2025-11-16 14:45:00'
        }
      ]);

      this.history.set([
        {
          id: 'hist-1',
          action: '建立檢查單',
          operator: '品管工程師 張三',
          timestamp: '2025-11-16 14:00:00',
          notes: '開始進行品質檢查'
        },
        {
          id: 'hist-2',
          action: '完成現場檢查',
          operator: '品管工程師 張三',
          timestamp: '2025-11-16 15:30:00',
          notes: '完成所有項目檢查'
        },
        {
          id: 'hist-3',
          action: '判定結果',
          operator: '品管工程師 張三',
          timestamp: '2025-11-16 15:45:00',
          notes: '判定為合格，環境整潔項目需改善'
        }
      ]);

      this.loading.set(false);
    }, 800);
  }

  private async loadInspection(id: string): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);

      // TODO: Replace with actual API call
      // const data = await this.inspectionService.getById(id);
      // this.inspection.set(data);

      // For now, load mock data
      this.loadMockData();
    } catch (err) {
      this.error.set('載入檢查詳情失敗');
      this.message.error('載入失敗');
      this.loading.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/quality/inspections']);
  }

  approve(): void {
    this.message.info('核准功能待實作');
  }

  reject(): void {
    this.message.info('退回功能待實作');
  }

  exportReport(): void {
    this.message.info('匯出報表功能待實作');
  }

  getResultColor(result: string): string {
    switch (result) {
      case 'pass':
        return 'success';
      case 'fail':
        return 'error';
      case 'na':
        return 'default';
      default:
        return 'default';
    }
  }

  getResultText(result: string): string {
    switch (result) {
      case 'pass':
        return '合格';
      case 'fail':
        return '不合格';
      case 'na':
        return '不適用';
      default:
        return result;
    }
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SettingsService } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';
import { CollaborationService } from '@shared';
import { CollaborationListComponent } from './collaboration-list.component';
import { OrganizationCollaboration } from '@shared';
import { CollaborationType, CollaborationStatus } from '@core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

describe('CollaborationListComponent', () => {
  let component: CollaborationListComponent;
  let fixture: ComponentFixture<CollaborationListComponent>;
  let collaborationService: jasmine.SpyObj<CollaborationService>;
  let router: jasmine.SpyObj<Router>;
  let messageService: jasmine.SpyObj<NzMessageService>;

  const mockCollaborations: OrganizationCollaboration[] = [
    {
      id: 'collab-1',
      blueprint_id: 'blueprint-1',
      owner_org_id: 'org-1',
      collaborator_org_id: 'org-2',
      collaboration_type: CollaborationType.CONTRACTOR,
      status: CollaborationStatus.ACTIVE,
      contract_start_date: '2025-01-01',
      contract_end_date: '2025-12-31',
      notes: 'Test collaboration',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    } as OrganizationCollaboration
  ];

  beforeEach(async () => {
    const collaborationServiceSpy = jasmine.createSpyObj('CollaborationService', [
      'loadCollaborations',
      'createCollaboration',
      'deleteCollaboration'
    ], {
      collaborations: jasmine.createSpy('collaborations').and.returnValue(mockCollaborations),
      loading: jasmine.createSpy('loading').and.returnValue(false),
      error: jasmine.createSpy('error').and.returnValue(null)
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const messageServiceSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error']);
    const mockSettingsService: NzSafeAny = {
      layout: {
        lang: null
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        CollaborationListComponent,
        SHARED_IMPORTS
      ],
      providers: [
        { provide: CollaborationService, useValue: collaborationServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NzMessageService, useValue: messageServiceSpy },
        { provide: SettingsService, useValue: mockSettingsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CollaborationListComponent);
    component = fixture.componentInstance;
    collaborationService = TestBed.inject(CollaborationService) as jasmine.SpyObj<CollaborationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    messageService = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load collaborations on init', async () => {
    collaborationService.loadCollaborations.and.returnValue(Promise.resolve());

    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(collaborationService.loadCollaborations).toHaveBeenCalled();
  });

  it('should navigate to create page when create button clicked', () => {
    component.createCollaboration();

    expect(router.navigate).toHaveBeenCalledWith(['/collaboration/form']);
  });

  it('should display collaborations in table', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('st')).toBeTruthy();
  });
});


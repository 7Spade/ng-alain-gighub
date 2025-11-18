import { TestBed } from '@angular/core/testing';
import {
  BlueprintRepository,
  BlueprintBranchRepository,
  BranchForkRepository,
  type Blueprint,
  type BlueprintInsert,
  type BlueprintUpdate
} from '@core';
import { BlueprintService, BlueprintActivityService, BranchService } from '@shared';
import { of } from 'rxjs';

import { BlueprintFacade } from './blueprint.facade';

describe('BlueprintFacade', () => {
  let facade: BlueprintFacade;
  let blueprintService: jasmine.SpyObj<BlueprintService>;
  let activityService: jasmine.SpyObj<BlueprintActivityService>;
  let blueprintRepository: jasmine.SpyObj<BlueprintRepository>;
  let blueprintBranchRepository: jasmine.SpyObj<BlueprintBranchRepository>;
  let branchForkRepository: jasmine.SpyObj<BranchForkRepository>;

  const mockBlueprint: Blueprint = {
    id: 'blueprint-1',
    name: 'Test Blueprint',
    project_code: 'PRJ-001',
    owner_id: 'user-1',
    status: 'active',
    created_at: '2025-01-01',
    updated_at: '2025-01-01'
  };

  const mockBlueprints: Blueprint[] = [
    mockBlueprint,
    {
      id: 'blueprint-2',
      name: 'Planning Blueprint',
      project_code: 'PRJ-002',
      owner_id: 'user-1',
      status: 'planning',
      created_at: '2025-01-01',
      updated_at: '2025-01-01'
    }
  ];

  beforeEach(() => {
    const blueprintServiceSpy = jasmine.createSpyObj(
      'BlueprintService',
      [
        'loadBlueprints',
        'loadBlueprintsByOwnerId',
        'loadBlueprintsByStatus',
        'loadBlueprintById',
        'loadBlueprintByProjectCode',
        'createBlueprint',
        'updateBlueprint',
        'deleteBlueprint',
        'selectBlueprint'
      ],
      {
        blueprints: jasmine.createSpy('blueprints').and.returnValue([]),
        selectedBlueprint: jasmine.createSpy('selectedBlueprint').and.returnValue(null),
        configs: jasmine.createSpy('configs').and.returnValue([]),
        loading: jasmine.createSpy('loading').and.returnValue(false),
        error: jasmine.createSpy('error').and.returnValue(null),
        activeBlueprints: jasmine.createSpy('activeBlueprints').and.returnValue([]),
        planningBlueprints: jasmine.createSpy('planningBlueprints').and.returnValue([]),
        completedBlueprints: jasmine.createSpy('completedBlueprints').and.returnValue([])
      }
    );

    const activityServiceSpy = jasmine.createSpyObj('BlueprintActivityService', ['logActivity']);

    const blueprintRepoSpy = jasmine.createSpyObj('BlueprintRepository', ['findAll', 'findById', 'create', 'update', 'delete']);

    const blueprintBranchRepoSpy = jasmine.createSpyObj('BlueprintBranchRepository', ['create', 'findByBlueprintId']);

    const branchForkRepoSpy = jasmine.createSpyObj('BranchForkRepository', ['create']);

    const branchServiceSpy = jasmine.createSpyObj('BranchService', []);

    TestBed.configureTestingModule({
      providers: [
        BlueprintFacade,
        { provide: BlueprintService, useValue: blueprintServiceSpy },
        { provide: BlueprintActivityService, useValue: activityServiceSpy },
        { provide: BlueprintRepository, useValue: blueprintRepoSpy },
        { provide: BlueprintBranchRepository, useValue: blueprintBranchRepoSpy },
        { provide: BranchForkRepository, useValue: branchForkRepoSpy },
        { provide: BranchService, useValue: branchServiceSpy }
      ]
    });

    facade = TestBed.inject(BlueprintFacade);
    blueprintService = TestBed.inject(BlueprintService) as jasmine.SpyObj<BlueprintService>;
    activityService = TestBed.inject(BlueprintActivityService) as jasmine.SpyObj<BlueprintActivityService>;
    blueprintRepository = TestBed.inject(BlueprintRepository) as jasmine.SpyObj<BlueprintRepository>;
    blueprintBranchRepository = TestBed.inject(BlueprintBranchRepository) as jasmine.SpyObj<BlueprintBranchRepository>;
    branchForkRepository = TestBed.inject(BranchForkRepository) as jasmine.SpyObj<BranchForkRepository>;
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('Signal State', () => {
    it('should have readonly signal properties', () => {
      expect(facade.currentBlueprintId).toBeDefined();
      expect(facade.selectedBranchId).toBeDefined();
      expect(facade.operationInProgress).toBeDefined();
      expect(facade.lastOperation).toBeDefined();
      expect(facade.blueprints).toBeDefined();
      expect(facade.loading).toBeDefined();
      expect(facade.error).toBeDefined();
    });

    it('should expose computed signals', () => {
      expect(facade.activeBlueprints).toBeDefined();
      expect(facade.planningBlueprints).toBeDefined();
      expect(facade.completedBlueprints).toBeDefined();
      expect(facade.currentBlueprint).toBeDefined();
      expect(facade.blueprintStats).toBeDefined();
    });
  });

  describe('loadBlueprints', () => {
    it('should load blueprints successfully', async () => {
      blueprintService.loadBlueprints.and.returnValue(Promise.resolve());

      await facade.loadBlueprints();

      expect(blueprintService.loadBlueprints).toHaveBeenCalled();
    });

    it('should handle load error', async () => {
      const error = new Error('Load failed');
      blueprintService.loadBlueprints.and.returnValue(Promise.reject(error));

      await expectAsync(facade.loadBlueprints()).toBeRejectedWith(error);
    });
  });

  describe('loadBlueprintsByOwnerId', () => {
    it('should load blueprints by owner ID', async () => {
      blueprintService.loadBlueprintsByOwnerId.and.returnValue(Promise.resolve(mockBlueprints));

      const result = await facade.loadBlueprintsByOwnerId('user-1');

      expect(result).toEqual(mockBlueprints);
      expect(blueprintService.loadBlueprintsByOwnerId).toHaveBeenCalledWith('user-1');
    });
  });

  describe('loadBlueprintById', () => {
    it('should load blueprint by ID', async () => {
      blueprintService.loadBlueprintById.and.returnValue(Promise.resolve(mockBlueprint));

      const result = await facade.loadBlueprintById('blueprint-1');

      expect(result).toEqual(mockBlueprint);
      expect(blueprintService.loadBlueprintById).toHaveBeenCalledWith('blueprint-1');
      expect(facade.currentBlueprintId()).toBe('blueprint-1');
    });
  });

  describe('createBlueprint', () => {
    const insertData: BlueprintInsert = {
      name: 'New Blueprint',
      project_code: 'PRJ-003',
      owner_id: 'user-1',
      status: 'planning'
    };

    it('should create blueprint successfully', async () => {
      const createdBlueprint = { ...mockBlueprint, ...insertData, id: 'blueprint-3' };
      blueprintService.createBlueprint.and.returnValue(Promise.resolve(createdBlueprint));
      activityService.logActivity.and.returnValue(Promise.resolve());

      const result = await facade.createBlueprint(insertData);

      expect(result).toEqual(createdBlueprint);
      expect(blueprintService.createBlueprint).toHaveBeenCalledWith(insertData);
      expect(facade.currentBlueprintId()).toBe('blueprint-3');
    });

    it('should log activity after creation', async () => {
      const createdBlueprint = { ...mockBlueprint, ...insertData, id: 'blueprint-3' };
      blueprintService.createBlueprint.and.returnValue(Promise.resolve(createdBlueprint));
      activityService.logActivity.and.returnValue(Promise.resolve());

      await facade.createBlueprint(insertData);

      expect(activityService.logActivity).toHaveBeenCalledWith(
        'blueprint-3',
        'blueprint',
        'blueprint-3',
        'created',
        jasmine.any(Array),
        jasmine.objectContaining({
          blueprintName: 'New Blueprint',
          projectCode: 'PRJ-003'
        })
      );
    });

    it('should not fail if activity logging fails', async () => {
      const createdBlueprint = { ...mockBlueprint, ...insertData, id: 'blueprint-3' };
      blueprintService.createBlueprint.and.returnValue(Promise.resolve(createdBlueprint));
      activityService.logActivity.and.returnValue(Promise.reject(new Error('Log failed')));

      const result = await facade.createBlueprint(insertData);

      expect(result).toEqual(createdBlueprint);
    });
  });

  describe('updateBlueprint', () => {
    const updateData: BlueprintUpdate = {
      name: 'Updated Blueprint',
      status: 'completed'
    };

    beforeEach(() => {
      // Mock blueprints() signal to return array with mockBlueprint
      Object.defineProperty(blueprintService, 'blueprints', {
        get: () => () => [mockBlueprint]
      });
    });

    it('should update blueprint successfully', async () => {
      const updatedBlueprint = { ...mockBlueprint, ...updateData };
      blueprintService.updateBlueprint.and.returnValue(Promise.resolve(updatedBlueprint));
      activityService.logActivity.and.returnValue(Promise.resolve());

      const result = await facade.updateBlueprint('blueprint-1', updateData);

      expect(result).toEqual(updatedBlueprint);
      expect(blueprintService.updateBlueprint).toHaveBeenCalledWith('blueprint-1', updateData);
    });

    it('should log changes after update', async () => {
      const updatedBlueprint = { ...mockBlueprint, ...updateData };
      blueprintService.updateBlueprint.and.returnValue(Promise.resolve(updatedBlueprint));
      activityService.logActivity.and.returnValue(Promise.resolve());

      await facade.updateBlueprint('blueprint-1', updateData);

      expect(activityService.logActivity).toHaveBeenCalled();
    });
  });

  describe('deleteBlueprint', () => {
    beforeEach(() => {
      Object.defineProperty(blueprintService, 'blueprints', {
        get: () => () => [mockBlueprint]
      });
    });

    it('should delete blueprint successfully', async () => {
      blueprintService.deleteBlueprint.and.returnValue(Promise.resolve());
      activityService.logActivity.and.returnValue(Promise.resolve());

      await facade.deleteBlueprint('blueprint-1');

      expect(blueprintService.deleteBlueprint).toHaveBeenCalledWith('blueprint-1');
    });

    it('should clear currentBlueprintId if deleted blueprint is current', async () => {
      facade.setCurrentBlueprint('blueprint-1');
      blueprintService.deleteBlueprint.and.returnValue(Promise.resolve());
      activityService.logActivity.and.returnValue(Promise.resolve());

      await facade.deleteBlueprint('blueprint-1');

      expect(facade.currentBlueprintId()).toBeNull();
    });
  });

  describe('createBranch', () => {
    const branchData = {
      org_id: 'org-1',
      branch_name: 'branch-1',
      notes: 'Test branch'
    };

    it('should create branch successfully', async () => {
      const mockBranch = {
        id: 'branch-1',
        blueprint_id: 'blueprint-1',
        organization_id: 'org-1',
        branch_name: 'branch-1',
        notes: 'Test branch',
        status: 'active'
      };
      blueprintBranchRepository.create.and.returnValue(of(mockBranch));
      activityService.logActivity.and.returnValue(Promise.resolve());

      const result = await facade.createBranch('blueprint-1', branchData);

      expect(result).toEqual(mockBranch);
      expect(blueprintBranchRepository.create).toHaveBeenCalledWith({
        blueprint_id: 'blueprint-1',
        organization_id: 'org-1',
        branch_name: 'branch-1',
        notes: 'Test branch',
        status: 'active'
      });
      expect(facade.selectedBranchId()).toBe('branch-1');
    });
  });

  describe('forkBlueprint', () => {
    const forkData = {
      name: 'Forked Blueprint',
      project_code: 'PRJ-FORK',
      owner_id: 'user-2'
    };

    it('should fork blueprint successfully', async () => {
      const newBlueprint = { ...mockBlueprint, ...forkData, id: 'blueprint-fork' };
      const mockFork = {
        id: 'fork-1',
        blueprint_id: 'blueprint-1',
        branch_id: 'branch-1',
        forked_by: 'user-2'
      };

      blueprintService.createBlueprint.and.returnValue(Promise.resolve(newBlueprint));
      branchForkRepository.create.and.returnValue(of(mockFork));
      activityService.logActivity.and.returnValue(Promise.resolve());

      const result = await facade.forkBlueprint('blueprint-1', 'branch-1', forkData, 'user-2');

      expect(result.newBlueprint).toEqual(newBlueprint);
      expect(result.fork).toEqual(mockFork);
    });
  });

  describe('Selection & Navigation', () => {
    it('should set current blueprint', () => {
      facade.setCurrentBlueprint('blueprint-1');
      expect(facade.currentBlueprintId()).toBe('blueprint-1');
    });

    it('should clear current blueprint', () => {
      facade.setCurrentBlueprint('blueprint-1');
      facade.setCurrentBlueprint(null);
      expect(facade.currentBlueprintId()).toBeNull();
    });

    it('should select blueprint', () => {
      facade.selectBlueprint(mockBlueprint);
      expect(blueprintService.selectBlueprint).toHaveBeenCalledWith(mockBlueprint);
      expect(facade.currentBlueprintId()).toBe('blueprint-1');
    });

    it('should set selected branch', () => {
      facade.setSelectedBranch('branch-1');
      expect(facade.selectedBranchId()).toBe('branch-1');
    });
  });
});

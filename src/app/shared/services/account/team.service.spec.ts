import { TestBed } from '@angular/core/testing';
import { TeamRepository, TeamMemberRepository, TeamMemberRole } from '@core';
import { Team, TeamMember } from '@shared';
import { of, throwError } from 'rxjs';

import { TeamService } from './team.service';

describe('TeamService', () => {
  let service: TeamService;
  let teamRepository: jasmine.SpyObj<TeamRepository>;
  let teamMemberRepository: jasmine.SpyObj<TeamMemberRepository>;

  const mockTeam: Team = {
    id: 'team-1',
    organization_id: 'org-1',
    name: 'Test Team',
    description: 'Test team description',
    avatar_url: null,
    created_by: 'account-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  } as Team;

  const mockTeams: Team[] = [
    mockTeam,
    {
      ...mockTeam,
      id: 'team-2',
      name: 'Test Team 2'
    }
  ];

  const mockTeamMember: TeamMember = {
    id: 'member-1',
    team_id: 'team-1',
    account_id: 'account-1',
    role: TeamMemberRole.MEMBER,
    joined_at: '2025-01-01T00:00:00Z'
  } as TeamMember;

  const mockTeamMembers: TeamMember[] = [
    mockTeamMember,
    {
      ...mockTeamMember,
      id: 'member-2',
      account_id: 'account-2',
      role: TeamMemberRole.LEADER
    }
  ];

  beforeEach(() => {
    const teamRepositorySpy = jasmine.createSpyObj('TeamRepository', [
      'findAll',
      'findById',
      'findByOrganizationId',
      'create',
      'update',
      'delete'
    ]);

    const teamMemberRepositorySpy = jasmine.createSpyObj('TeamMemberRepository', ['findByTeamId', 'create', 'update', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        TeamService,
        { provide: TeamRepository, useValue: teamRepositorySpy },
        { provide: TeamMemberRepository, useValue: teamMemberRepositorySpy }
      ]
    });

    service = TestBed.inject(TeamService);
    teamRepository = TestBed.inject(TeamRepository) as jasmine.SpyObj<TeamRepository>;
    teamMemberRepository = TestBed.inject(TeamMemberRepository) as jasmine.SpyObj<TeamMemberRepository>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should have empty teams', () => {
      expect(service.teams().length).toBe(0);
    });

    it('should have null selected team', () => {
      expect(service.selectedTeam()).toBeNull();
    });

    it('should have empty team members', () => {
      expect(service.teamMembers().length).toBe(0);
    });

    it('should have false loading state', () => {
      expect(service.loading()).toBe(false);
    });

    it('should have null error state', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('loadTeams', () => {
    it('should load teams successfully', async () => {
      teamRepository.findAll.and.returnValue(of(mockTeams));

      await service.loadTeams();

      expect(service.teams().length).toBe(2);
      expect(service.teams()[0].id).toBe('team-1');
      expect(service.loading()).toBe(false);
    });

    it('should handle error when loading fails', async () => {
      const error = new Error('Load failed');
      teamRepository.findAll.and.returnValue(throwError(() => error));

      try {
        await service.loadTeams();
        fail('should have thrown error');
      } catch (e) {
        expect(service.error()).toBe('Load failed');
      }
    });
  });

  describe('loadTeamsByOrganizationId', () => {
    it('should load teams by organization id', async () => {
      teamRepository.findByOrganizationId.and.returnValue(of(mockTeams));

      const result = await service.loadTeamsByOrganizationId('org-1');

      expect(result.length).toBe(2);
      expect(teamRepository.findByOrganizationId).toHaveBeenCalledWith('org-1');
    });
  });

  describe('loadTeamById', () => {
    it('should load team by id and members', async () => {
      teamRepository.findById.and.returnValue(of(mockTeam));
      teamMemberRepository.findByTeamId.and.returnValue(of(mockTeamMembers));

      const result = await service.loadTeamById('team-1');

      expect(result).toEqual(mockTeam);
      expect(service.selectedTeam()).toEqual(mockTeam);
      expect(service.teamMembers().length).toBe(2);
    });
  });

  describe('createTeam', () => {
    it('should create team successfully', async () => {
      const newTeam = { ...mockTeam, id: 'team-new' };
      teamRepository.create.and.returnValue(of(newTeam));

      const result = await service.createTeam({
        organization_id: 'org-1',
        name: 'New Team',
        created_by: 'account-1'
      });

      expect(result).toEqual(newTeam);
      expect(service.teams().length).toBe(1);
    });
  });

  describe('updateTeam', () => {
    beforeEach(() => {
      service['teamsState'].set(mockTeams);
    });

    it('should update team successfully', async () => {
      const updated = { ...mockTeam, name: 'Updated Name' };
      teamRepository.update.and.returnValue(of(updated));

      const result = await service.updateTeam('team-1', { name: 'Updated Name' });

      expect(result).toEqual(updated);
      expect(service.teams()[0].name).toBe('Updated Name');
    });
  });

  describe('deleteTeam', () => {
    beforeEach(() => {
      service['teamsState'].set(mockTeams);
    });

    it('should delete team successfully', async () => {
      teamRepository.delete.and.returnValue(of(undefined));

      await service.deleteTeam('team-1');

      expect(service.teams().length).toBe(1);
      expect(service.teams()[0].id).toBe('team-2');
    });

    it('should clear selected team and members if deleted', async () => {
      teamMemberRepository.findByTeamId.and.returnValue(of(mockTeamMembers));
      service.selectTeam(mockTeam);
      await new Promise(resolve => setTimeout(resolve, 0)); // Wait for async loadTeamMembers
      service['teamMembersState'].set(mockTeamMembers);
      teamRepository.delete.and.returnValue(of(undefined));

      await service.deleteTeam('team-1');

      expect(service.selectedTeam()).toBeNull();
      expect(service.teamMembers().length).toBe(0);
    });
  });

  describe('selectTeam', () => {
    it('should select team and load members', async () => {
      teamMemberRepository.findByTeamId.and.returnValue(of(mockTeamMembers));

      service.selectTeam(mockTeam);
      await new Promise(resolve => setTimeout(resolve, 0)); // Wait for async loadTeamMembers

      expect(service.selectedTeam()).toEqual(mockTeam);
      expect(teamMemberRepository.findByTeamId).toHaveBeenCalledWith('team-1');
    });

    it('should clear selection when null', () => {
      teamMemberRepository.findByTeamId.and.returnValue(of(mockTeamMembers));
      service.selectTeam(mockTeam);
      service.selectTeam(null);

      expect(service.selectedTeam()).toBeNull();
      expect(service.teamMembers().length).toBe(0);
    });
  });

  describe('loadTeamMembers', () => {
    it('should load team members successfully', async () => {
      teamMemberRepository.findByTeamId.and.returnValue(of(mockTeamMembers));

      const result = await service.loadTeamMembers('team-1');

      expect(result.length).toBe(2);
      expect(service.teamMembers().length).toBe(2);
    });
  });

  describe('addTeamMember', () => {
    it('should add team member successfully', async () => {
      const newMember = { ...mockTeamMember, id: 'member-new' };
      teamMemberRepository.create.and.returnValue(of(newMember));

      const result = await service.addTeamMember('team-1', 'account-3', TeamMemberRole.MEMBER);

      expect(result).toEqual(newMember);
      expect(service.teamMembers().length).toBe(1);
    });
  });

  describe('removeTeamMember', () => {
    beforeEach(() => {
      service['teamMembersState'].set(mockTeamMembers);
    });

    it('should remove team member successfully', async () => {
      teamMemberRepository.delete.and.returnValue(of(undefined));

      await service.removeTeamMember('member-1');

      expect(service.teamMembers().length).toBe(1);
      expect(service.teamMembers()[0].id).toBe('member-2');
    });
  });

  describe('updateTeamMemberRole', () => {
    beforeEach(() => {
      service['teamMembersState'].set(mockTeamMembers);
    });

    it('should update team member role successfully', async () => {
      const updated = { ...mockTeamMember, role: TeamMemberRole.LEADER };
      teamMemberRepository.update.and.returnValue(of(updated));

      const result = await service.updateTeamMemberRole('member-1', TeamMemberRole.LEADER);

      expect(result.role).toBe(TeamMemberRole.LEADER);
      expect(service.teamMembers()[0].role).toBe(TeamMemberRole.LEADER);
    });
  });

  describe('reset', () => {
    it('should reset all state', () => {
      service['teamsState'].set(mockTeams);
      service.selectTeam(mockTeam);
      service['teamMembersState'].set(mockTeamMembers);
      service['errorState'].set('Some error');

      service.reset();

      expect(service.teams().length).toBe(0);
      expect(service.selectedTeam()).toBeNull();
      expect(service.teamMembers().length).toBe(0);
      expect(service.error()).toBeNull();
    });
  });
});

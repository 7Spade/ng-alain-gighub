export type SafetyRiskLevel = 'low' | 'medium' | 'high' | 'extreme';

export type ControlType = 'elimination' | 'substitution' | 'engineering' | 'administrative' | 'ppe';

export type HazardStatus = 'identified' | 'controlled' | 'monitored';

export type PermitType = 'hot-work' | 'confined-space' | 'high-work' | 'electrical' | 'excavation' | 'lifting';

export interface ControlMeasure {
  type: ControlType;
  description: string;
  responsible: string;
  effectiveness: number;
}

export interface Hazard {
  id: string;
  type: string;
  description: string;
  location: string;
  severity: number;
  likelihood: number;
  riskLevel: number;
  riskCategory: SafetyRiskLevel;
  controls: ControlMeasure[];
  residualRisk: number;
  status: HazardStatus;
}

export interface Permit {
  id: string;
  permitNumber: string;
  type: PermitType;
  issuedDate: Date;
  validUntil: Date;
  issuedBy: string;
  approvedBy: string;
  status: 'pending' | 'approved' | 'active' | 'expired' | 'cancelled';
}

export interface SafetyPPERequirement {
  id: string;
  name: string;
  description?: string;
  mandatory: boolean;
}

export interface SafetyTrainingRequirement {
  id: string;
  courseName: string;
  provider?: string;
  validUntil?: Date;
  status: 'scheduled' | 'completed' | 'expired';
}

export interface TaskSafetySummary {
  taskId: string;
  hazards: Hazard[];
  permits: Permit[];
  ppeRequirements: SafetyPPERequirement[];
  trainingRequirements: SafetyTrainingRequirement[];
  management?: Record<string, unknown> | null;
  updatedAt: Date;
  updatedBy?: string | null;
}

export type SafetyIncidentType = 'accident' | 'near-miss' | 'incident' | 'unsafe-act' | 'unsafe-condition';

export type SafetyIncidentStatus = 'reported' | 'investigating' | 'resolved' | 'closed';

export interface SafetyIncident {
  id: string;
  taskId: string;
  type: SafetyIncidentType;
  description: string;
  occurredAt: Date;
  severity?: number;
  reportedBy?: string | null;
  reportedAt?: Date | null;
  status: SafetyIncidentStatus;
  correctiveActions: string[];
  resolvedAt?: Date | null;
  relatedHazardId?: string;
  attachments?: string[];
}

export interface TaskSafety {
  summary?: TaskSafetySummary;
  incidents?: SafetyIncident[];
}

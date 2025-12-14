// Prostor Build OS - Core Types

export type StageId = 
  | 'lead' 
  | 'measurement' 
  | 'estimate' 
  | 'contract' 
  | 'procurement' 
  | 'rough' 
  | 'finishing' 
  | 'handover' 
  | 'warranty';

export type RoleId = 
  | 'admin' 
  | 'pm' 
  | 'designer' 
  | 'foreman' 
  | 'procurement' 
  | 'finance' 
  | 'driver' 
  | 'expeditor' 
  | 'loader' 
  | 'worker' 
  | 'client';

export type RiskType = 'ok' | 'idle' | 'blocked' | 'overdue';

export interface Stage {
  id: StageId;
  name: string;
  color: string;
  required: StageRequirement[];
}

export interface StageRequirement {
  field: string;
  label: string;
  type: 'boolean' | 'threshold' | 'file' | 'text';
  threshold?: number;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  stage: StageId;
  budget: number;
  deadline: Date;
  assignees: string[];
  tags: string[];
  lastActivity: Date;
  fields: ProjectFields;
}

export interface ProjectFields {
  // Lead
  contactInfo?: boolean;
  initialRequest?: boolean;
  // Measurement
  measurementDone?: boolean;
  floorPlan?: boolean;
  // Estimate
  estimateReady?: boolean;
  estimateApproved?: boolean;
  // Contract
  contractSigned?: boolean;
  prepaymentReceived?: boolean;
  // Procurement
  materialsOrdered?: boolean;
  deliveryScheduled?: boolean;
  // Rough
  roughDonePct?: number;
  inspectionPassed?: boolean;
  // Finishing
  finishingDonePct?: number;
  qualityCheck?: boolean;
  // Handover
  clientAccepted?: boolean;
  finalPayment?: boolean;
  // Warranty
  warrantyIssued?: boolean;
  // Common
  notes?: string;
}

export interface Role {
  id: RoleId;
  name: string;
  views: string[];
  permissions: {
    moveStage: boolean;
    finance: boolean;
    procurement: boolean;
    editFields: string[] | '*';
  };
}

export interface AutoRule {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  conditions: RuleCondition[];
  actions: RuleAction[];
  scope: {
    stages?: StageId[];
    roles?: RoleId[];
  };
  stopOnMatch: boolean;
}

export interface RuleCondition {
  type: 'stageIs' | 'fieldTrue' | 'fieldFalse' | 'inactivityGte' | 'deadlineLte' | 'tagIncludes' | 'assigneeIncludes' | 'percentAtLeast';
  value: string | number | StageId;
}

export interface RuleAction {
  type: 'setField' | 'addChecklist' | 'notify' | 'log' | 'moveNext';
  field?: string;
  value?: any;
  message?: string;
}

export interface Alert {
  id: string;
  projectId: string;
  type: 'deadline_overdue' | 'deadline_soon' | 'inactivity' | 'blocked';
  message: string;
  severity: 'warning' | 'error' | 'info';
  createdAt: Date;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  projectId?: string;
  userId?: string;
  action: string;
  details: string;
  type: 'stage_change' | 'rule_triggered' | 'quick_fix' | 'user_action' | 'system';
}

export interface EstimateItem {
  id: string;
  type: 'material' | 'work' | 'service';
  name: string;
  unit: string;
  quantity: number;
  price: number;
  vatRate: number;
  total: number;
}

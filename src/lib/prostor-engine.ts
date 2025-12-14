import { Project, StageRequirement, Alert, LogEntry, AutoRule, StageId } from '@/types/prostor';
import { STAGES, getStageIndex, getNextStage } from '@/data/prostor-data';

// Get missing requirements for a stage
export function getMissingRequirements(project: Project, stageId?: StageId): StageRequirement[] {
  const targetStage = stageId || project.stage;
  const stage = STAGES.find(s => s.id === targetStage);
  if (!stage) return [];

  return stage.required.filter(req => {
    const value = project.fields[req.field as keyof typeof project.fields];
    if (req.type === 'boolean') {
      return value !== true;
    }
    if (req.type === 'threshold' && req.threshold !== undefined) {
      return typeof value !== 'number' || value < req.threshold;
    }
    if (req.type === 'file' || req.type === 'text') {
      return !value;
    }
    return false;
  });
}

// Check if project can move to next stage
export function canMoveToNextStage(project: Project): boolean {
  const missing = getMissingRequirements(project);
  return missing.length === 0;
}

// Calculate days until deadline (negative = overdue)
export function getDaysToDeadline(project: Project): number {
  const now = new Date();
  const deadline = new Date(project.deadline);
  const diff = deadline.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Calculate days since last activity
export function getDaysIdle(project: Project): number {
  const now = new Date();
  const lastActivity = new Date(project.lastActivity);
  const diff = now.getTime() - lastActivity.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Get project risk status
export function getProjectRisk(project: Project): { type: 'ok' | 'idle' | 'blocked' | 'overdue'; label: string } {
  const daysToDeadline = getDaysToDeadline(project);
  const daysIdle = getDaysIdle(project);
  const missing = getMissingRequirements(project);

  if (daysToDeadline <= 0) {
    return { type: 'overdue', label: 'Просрочен' };
  }
  if (missing.length > 0 && daysIdle >= 2) {
    return { type: 'blocked', label: 'Заблокирован' };
  }
  if (daysIdle >= 3) {
    return { type: 'idle', label: 'Простой' };
  }
  if (daysToDeadline <= 2) {
    return { type: 'idle', label: 'Срочно' };
  }
  return { type: 'ok', label: 'В работе' };
}

// Generate alerts from projects
export function generateAlerts(projects: Project[]): Alert[] {
  const alerts: Alert[] = [];
  
  projects.forEach(project => {
    const daysToDeadline = getDaysToDeadline(project);
    const daysIdle = getDaysIdle(project);
    const missing = getMissingRequirements(project);

    if (daysToDeadline <= 0) {
      alerts.push({
        id: `${project.id}-overdue`,
        projectId: project.id,
        type: 'deadline_overdue',
        message: `Проект "${project.name}" просрочен на ${Math.abs(daysToDeadline)} дн.`,
        severity: 'error',
        createdAt: new Date(),
      });
    } else if (daysToDeadline <= 2) {
      alerts.push({
        id: `${project.id}-soon`,
        projectId: project.id,
        type: 'deadline_soon',
        message: `Проект "${project.name}": до дедлайна ${daysToDeadline} дн.`,
        severity: 'warning',
        createdAt: new Date(),
      });
    }

    if (daysIdle >= 3) {
      alerts.push({
        id: `${project.id}-idle`,
        projectId: project.id,
        type: 'inactivity',
        message: `Проект "${project.name}" без активности ${daysIdle} дн.`,
        severity: 'warning',
        createdAt: new Date(),
      });
    }

    if (missing.length > 0) {
      alerts.push({
        id: `${project.id}-blocked`,
        projectId: project.id,
        type: 'blocked',
        message: `Проект "${project.name}": не выполнено ${missing.length} требований этапа`,
        severity: 'info',
        createdAt: new Date(),
      });
    }
  });

  return alerts.sort((a, b) => {
    const severityOrder = { error: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

// Check if rule conditions are met
export function checkRuleConditions(project: Project, rule: AutoRule): boolean {
  return rule.conditions.every(condition => {
    switch (condition.type) {
      case 'stageIs':
        return project.stage === condition.value;
      case 'fieldTrue':
        return project.fields[condition.value as keyof typeof project.fields] === true;
      case 'fieldFalse':
        return project.fields[condition.value as keyof typeof project.fields] !== true;
      case 'inactivityGte':
        return getDaysIdle(project) >= (condition.value as number);
      case 'deadlineLte':
        return getDaysToDeadline(project) <= (condition.value as number);
      case 'tagIncludes':
        return project.tags.includes(condition.value as string);
      case 'assigneeIncludes':
        return project.assignees.some(a => a.toLowerCase().includes((condition.value as string).toLowerCase()));
      case 'percentAtLeast':
        const roughPct = project.fields.roughDonePct || 0;
        const finishPct = project.fields.finishingDonePct || 0;
        const maxPct = Math.max(roughPct, finishPct);
        return maxPct >= (condition.value as number);
      default:
        return false;
    }
  });
}

// Execute rule actions (dry run returns logs without modifying)
export function executeRuleActions(
  project: Project, 
  rule: AutoRule, 
  dryRun: boolean = false
): { project: Project; logs: LogEntry[] } {
  const logs: LogEntry[] = [];
  let updatedProject = { ...project, fields: { ...project.fields } };

  rule.actions.forEach(action => {
    switch (action.type) {
      case 'setField':
        if (!dryRun && action.field) {
          (updatedProject.fields as any)[action.field] = action.value;
        }
        logs.push({
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          projectId: project.id,
          action: 'rule_triggered',
          details: `Правило ${rule.id}: установлено поле ${action.field} = ${action.value}`,
          type: 'rule_triggered',
        });
        break;
      case 'moveNext':
        const nextStage = getNextStage(project.stage);
        if (!dryRun && nextStage && canMoveToNextStage(project)) {
          updatedProject.stage = nextStage;
        }
        logs.push({
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          projectId: project.id,
          action: 'stage_change',
          details: `Правило ${rule.id}: переход на этап ${nextStage}`,
          type: 'rule_triggered',
        });
        break;
      case 'notify':
        logs.push({
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          projectId: project.id,
          action: 'notification',
          details: `Уведомление: ${action.message}`,
          type: 'rule_triggered',
        });
        break;
      case 'log':
        logs.push({
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          projectId: project.id,
          action: 'log',
          details: action.message || 'Действие зафиксировано',
          type: 'rule_triggered',
        });
        break;
    }
  });

  return { project: updatedProject, logs };
}

// Fill minimum requirements for stage transition
export function fillMinimumRequirements(project: Project): Project {
  const missing = getMissingRequirements(project);
  const updated = { ...project, fields: { ...project.fields } };

  missing.forEach(req => {
    if (req.type === 'boolean') {
      (updated.fields as any)[req.field] = true;
    } else if (req.type === 'threshold' && req.threshold) {
      (updated.fields as any)[req.field] = req.threshold;
    }
  });

  return updated;
}

// Search/filter projects
export function searchProjects(projects: Project[], query: string): Project[] {
  if (!query.trim()) return projects;

  const tokens = query.toLowerCase().split(/\s+/);
  
  return projects.filter(project => {
    return tokens.every(token => {
      // ID token
      if (token.startsWith('id:')) {
        const idQuery = token.slice(3);
        return project.id.toLowerCase().includes(idQuery);
      }
      // Tag token
      if (token.startsWith('#') || token.startsWith('tag:')) {
        const tagQuery = token.startsWith('#') ? token.slice(1) : token.slice(4);
        return project.tags.some(t => t.toLowerCase().includes(tagQuery));
      }
      // Assignee token
      if (token.startsWith('@') || token.startsWith('assignee:')) {
        const assigneeQuery = token.startsWith('@') ? token.slice(1) : token.slice(9);
        return project.assignees.some(a => a.toLowerCase().includes(assigneeQuery));
      }
      // Stage token
      if (token.startsWith('stage:')) {
        const stageQuery = token.slice(6);
        return project.stage.toLowerCase().includes(stageQuery);
      }
      // Client token
      if (token.startsWith('client:')) {
        const clientQuery = token.slice(7);
        return project.client.toLowerCase().includes(clientQuery);
      }
      // General search
      return (
        project.id.toLowerCase().includes(token) ||
        project.name.toLowerCase().includes(token) ||
        project.client.toLowerCase().includes(token) ||
        project.tags.some(t => t.toLowerCase().includes(token)) ||
        project.assignees.some(a => a.toLowerCase().includes(token))
      );
    });
  });
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date));
}

// Run tests
export function runTests(): { name: string; passed: boolean; message: string }[] {
  const results: { name: string; passed: boolean; message: string }[] = [];
  
  // T1: getMissing for estimate stage
  const testProject1: Project = {
    id: 'TEST-1',
    name: 'Test',
    client: 'Test Client',
    stage: 'estimate',
    budget: 100000,
    deadline: new Date(),
    assignees: [],
    tags: [],
    lastActivity: new Date(),
    fields: { estimateReady: true, estimateApproved: false },
  };
  const missing = getMissingRequirements(testProject1);
  results.push({
    name: 'T1: getMissing для этапа сметы',
    passed: missing.length === 1 && missing[0].field === 'estimateApproved',
    message: missing.length === 1 ? 'Найдено 1 недостающее требование' : `Ожидалось 1, найдено ${missing.length}`,
  });

  // T2: stageIs condition
  const stageIsResult = checkRuleConditions(testProject1, {
    id: 'test',
    name: 'test',
    enabled: true,
    priority: 1,
    conditions: [{ type: 'stageIs', value: 'estimate' }],
    actions: [],
    scope: {},
    stopOnMatch: false,
  });
  results.push({
    name: 'T2: stageIs условие',
    passed: stageIsResult === true,
    message: stageIsResult ? 'Условие выполнено' : 'Условие не выполнено',
  });

  // T3: dryRun R3
  const testProject2: Project = {
    id: 'TEST-2',
    name: 'Test Rough',
    client: 'Test Client',
    stage: 'rough',
    budget: 100000,
    deadline: new Date(),
    assignees: [],
    tags: [],
    lastActivity: new Date(),
    fields: { roughDonePct: 85, inspectionPassed: true },
  };
  const rule3Result = checkRuleConditions(testProject2, {
    id: 'R3',
    name: 'Test R3',
    enabled: true,
    priority: 3,
    conditions: [
      { type: 'stageIs', value: 'rough' },
      { type: 'percentAtLeast', value: 80 },
      { type: 'fieldTrue', value: 'inspectionPassed' },
    ],
    actions: [{ type: 'moveNext' }],
    scope: {},
    stopOnMatch: true,
  });
  results.push({
    name: 'T3: dryRun R3 (автопереход)',
    passed: rule3Result === true,
    message: rule3Result ? 'Правило R3 сработало бы' : 'Условия R3 не выполнены',
  });

  // T4: Search by id:
  const testProjects = [testProject1, testProject2];
  const searchResult = searchProjects(testProjects, 'id:TEST-1');
  results.push({
    name: 'T4: Поиск по id:',
    passed: searchResult.length === 1 && searchResult[0].id === 'TEST-1',
    message: searchResult.length === 1 ? 'Найден 1 проект' : `Найдено ${searchResult.length}`,
  });

  return results;
}

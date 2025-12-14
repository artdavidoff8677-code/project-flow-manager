import { create } from 'zustand';
import { Project, RoleId, Alert, LogEntry, AutoRule } from '@/types/prostor';
import { DEMO_PROJECTS, DEFAULT_RULES, ROLES, getNextStage } from '@/data/prostor-data';
import { generateAlerts, canMoveToNextStage, executeRuleActions, checkRuleConditions, fillMinimumRequirements } from '@/lib/prostor-engine';

interface ProstorState {
  // Core data
  projects: Project[];
  rules: AutoRule[];
  alerts: Alert[];
  logs: LogEntry[];
  
  // UI state
  currentRole: RoleId;
  selectedProject: Project | null;
  searchQuery: string;
  activeView: string;
  
  // Actions
  setCurrentRole: (role: RoleId) => void;
  setSelectedProject: (project: Project | null) => void;
  setSearchQuery: (query: string) => void;
  setActiveView: (view: string) => void;
  
  // Project actions
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  updateProjectField: (projectId: string, field: string, value: any) => void;
  moveProjectToStage: (projectId: string, newStage: string) => void;
  
  // Rule actions
  applyRules: (projectId?: string) => void;
  fillMinimum: (projectId: string) => void;
  
  // System actions
  refreshAlerts: () => void;
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

export const useProstorStore = create<ProstorState>((set, get) => ({
  // Initial state
  projects: DEMO_PROJECTS,
  rules: DEFAULT_RULES,
  alerts: generateAlerts(DEMO_PROJECTS),
  logs: [],
  
  currentRole: 'pm',
  selectedProject: null,
  searchQuery: '',
  activeView: 'kanban',
  
  // Role & UI
  setCurrentRole: (role) => set({ currentRole: role }),
  setSelectedProject: (project) => set({ selectedProject: project }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveView: (view) => set({ activeView: view }),
  
  // Project updates
  updateProject: (projectId, updates) => {
    set(state => ({
      projects: state.projects.map(p =>
        p.id === projectId ? { ...p, ...updates, lastActivity: new Date() } : p
      ),
    }));
    get().refreshAlerts();
  },
  
  updateProjectField: (projectId, field, value) => {
    set(state => ({
      projects: state.projects.map(p =>
        p.id === projectId
          ? { ...p, fields: { ...p.fields, [field]: value }, lastActivity: new Date() }
          : p
      ),
      selectedProject: state.selectedProject?.id === projectId
        ? { ...state.selectedProject, fields: { ...state.selectedProject.fields, [field]: value }, lastActivity: new Date() }
        : state.selectedProject,
    }));
    get().refreshAlerts();
    get().applyRules(projectId);
  },
  
  moveProjectToStage: (projectId, newStage) => {
    const state = get();
    const project = state.projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Check permissions
    const role = ROLES.find(r => r.id === state.currentRole);
    if (!role?.permissions.moveStage) {
      get().addLog({
        projectId,
        action: 'move_denied',
        details: `Роль ${role?.name} не имеет права перемещать проекты`,
        type: 'user_action',
      });
      return;
    }
    
    set(state => ({
      projects: state.projects.map(p =>
        p.id === projectId ? { ...p, stage: newStage as any, lastActivity: new Date() } : p
      ),
    }));
    
    get().addLog({
      projectId,
      action: 'stage_change',
      details: `Проект перемещён на этап: ${newStage}`,
      type: 'stage_change',
    });
    
    get().refreshAlerts();
  },
  
  // Rules
  applyRules: (projectId) => {
    const state = get();
    const targetProjects = projectId
      ? state.projects.filter(p => p.id === projectId)
      : state.projects;
    
    const enabledRules = state.rules
      .filter(r => r.enabled)
      .sort((a, b) => a.priority - b.priority);
    
    let updatedProjects = [...state.projects];
    const newLogs: LogEntry[] = [];
    
    targetProjects.forEach(project => {
      for (const rule of enabledRules) {
        // Check scope
        if (rule.scope.stages && !rule.scope.stages.includes(project.stage)) continue;
        
        if (checkRuleConditions(project, rule)) {
          const { project: updated, logs } = executeRuleActions(project, rule, false);
          updatedProjects = updatedProjects.map(p =>
            p.id === project.id ? updated : p
          );
          newLogs.push(...logs);
          
          if (rule.stopOnMatch) break;
        }
      }
    });
    
    set(state => ({
      projects: updatedProjects,
      logs: [...state.logs, ...newLogs],
    }));
    
    get().refreshAlerts();
  },
  
  fillMinimum: (projectId) => {
    const state = get();
    const project = state.projects.find(p => p.id === projectId);
    if (!project) return;
    
    const updated = fillMinimumRequirements(project);
    
    set(state => ({
      projects: state.projects.map(p => p.id === projectId ? updated : p),
      selectedProject: state.selectedProject?.id === projectId ? updated : state.selectedProject,
    }));
    
    get().addLog({
      projectId,
      action: 'quick_fix',
      details: 'Применён быстрый фикс: заполнены минимальные требования',
      type: 'quick_fix',
    });
    
    get().refreshAlerts();
  },
  
  // System
  refreshAlerts: () => {
    set(state => ({
      alerts: generateAlerts(state.projects),
    }));
  },
  
  addLog: (entry) => {
    set(state => ({
      logs: [
        ...state.logs,
        {
          ...entry,
          id: `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          timestamp: new Date(),
        },
      ],
    }));
  },
}));

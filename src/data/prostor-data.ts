import { Stage, Role, Project, AutoRule, StageId, RoleId } from '@/types/prostor';

export const STAGES: Stage[] = [
  {
    id: 'lead',
    name: 'Лид',
    color: 'stage-lead',
    required: [
      { field: 'contactInfo', label: 'Контактные данные', type: 'boolean' },
      { field: 'initialRequest', label: 'Первичный запрос', type: 'boolean' },
    ],
  },
  {
    id: 'measurement',
    name: 'Замер',
    color: 'stage-measurement',
    required: [
      { field: 'measurementDone', label: 'Замер выполнен', type: 'boolean' },
      { field: 'floorPlan', label: 'План помещения', type: 'boolean' },
    ],
  },
  {
    id: 'estimate',
    name: 'Смета',
    color: 'stage-estimate',
    required: [
      { field: 'estimateReady', label: 'Смета готова', type: 'boolean' },
      { field: 'estimateApproved', label: 'Смета согласована', type: 'boolean' },
    ],
  },
  {
    id: 'contract',
    name: 'Договор',
    color: 'stage-contract',
    required: [
      { field: 'contractSigned', label: 'Договор подписан', type: 'boolean' },
      { field: 'prepaymentReceived', label: 'Предоплата получена', type: 'boolean' },
    ],
  },
  {
    id: 'procurement',
    name: 'Закупка',
    color: 'stage-procurement',
    required: [
      { field: 'materialsOrdered', label: 'Материалы заказаны', type: 'boolean' },
      { field: 'deliveryScheduled', label: 'Доставка запланирована', type: 'boolean' },
    ],
  },
  {
    id: 'rough',
    name: 'Черновая',
    color: 'stage-rough',
    required: [
      { field: 'roughDonePct', label: 'Черновые работы ≥80%', type: 'threshold', threshold: 80 },
      { field: 'inspectionPassed', label: 'Проверка пройдена', type: 'boolean' },
    ],
  },
  {
    id: 'finishing',
    name: 'Чистовая',
    color: 'stage-finishing',
    required: [
      { field: 'finishingDonePct', label: 'Чистовые работы ≥90%', type: 'threshold', threshold: 90 },
      { field: 'qualityCheck', label: 'Контроль качества', type: 'boolean' },
    ],
  },
  {
    id: 'handover',
    name: 'Сдача',
    color: 'stage-handover',
    required: [
      { field: 'clientAccepted', label: 'Клиент принял', type: 'boolean' },
      { field: 'finalPayment', label: 'Финальная оплата', type: 'boolean' },
    ],
  },
  {
    id: 'warranty',
    name: 'Гарантия',
    color: 'stage-warranty',
    required: [
      { field: 'warrantyIssued', label: 'Гарантия выдана', type: 'boolean' },
    ],
  },
];

export const ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Администратор',
    views: ['kanban', 'design', 'estimate', 'procurement', 'logistics', 'finance', 'reports', 'sla', 'settings'],
    permissions: { moveStage: true, finance: true, procurement: true, editFields: '*' },
  },
  {
    id: 'pm',
    name: 'Руководитель/ПМ',
    views: ['kanban', 'design', 'estimate', 'procurement', 'logistics', 'finance', 'reports', 'sla'],
    permissions: { moveStage: true, finance: true, procurement: true, editFields: '*' },
  },
  {
    id: 'designer',
    name: 'Дизайнер',
    views: ['kanban', 'design', 'estimate'],
    permissions: { moveStage: false, finance: false, procurement: false, editFields: ['measurementDone', 'floorPlan', 'estimateReady'] },
  },
  {
    id: 'foreman',
    name: 'Прораб',
    views: ['kanban', 'procurement', 'logistics'],
    permissions: { moveStage: false, finance: false, procurement: true, editFields: ['roughDonePct', 'finishingDonePct', 'inspectionPassed', 'qualityCheck'] },
  },
  {
    id: 'procurement',
    name: 'Снабженец',
    views: ['kanban', 'procurement', 'logistics'],
    permissions: { moveStage: false, finance: false, procurement: true, editFields: ['materialsOrdered', 'deliveryScheduled'] },
  },
  {
    id: 'finance',
    name: 'Финансы',
    views: ['kanban', 'estimate', 'finance', 'reports'],
    permissions: { moveStage: false, finance: true, procurement: false, editFields: ['prepaymentReceived', 'finalPayment'] },
  },
  {
    id: 'driver',
    name: 'Водитель',
    views: ['logistics'],
    permissions: { moveStage: false, finance: false, procurement: false, editFields: [] },
  },
  {
    id: 'expeditor',
    name: 'Экспедитор',
    views: ['logistics'],
    permissions: { moveStage: false, finance: false, procurement: false, editFields: [] },
  },
  {
    id: 'loader',
    name: 'Грузчик',
    views: ['logistics'],
    permissions: { moveStage: false, finance: false, procurement: false, editFields: [] },
  },
  {
    id: 'worker',
    name: 'Рабочий',
    views: ['kanban'],
    permissions: { moveStage: false, finance: false, procurement: false, editFields: ['roughDonePct', 'finishingDonePct'] },
  },
  {
    id: 'client',
    name: 'Клиент',
    views: ['client-portal'],
    permissions: { moveStage: false, finance: false, procurement: false, editFields: ['estimateApproved', 'clientAccepted'] },
  },
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: 'P-001',
    name: 'Квартира на Тверской',
    client: 'Иванов А.С.',
    stage: 'rough',
    budget: 2500000,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    assignees: ['Прораб', 'Дизайнер'],
    tags: ['новостройка', 'премиум'],
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    fields: {
      contactInfo: true,
      initialRequest: true,
      measurementDone: true,
      floorPlan: true,
      estimateReady: true,
      estimateApproved: true,
      contractSigned: true,
      prepaymentReceived: true,
      materialsOrdered: true,
      deliveryScheduled: true,
      roughDonePct: 65,
      inspectionPassed: false,
    },
  },
  {
    id: 'P-002',
    name: 'Офис на Арбате',
    client: 'ООО "ТехноПром"',
    stage: 'estimate',
    budget: 5000000,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    assignees: ['Дизайнер'],
    tags: ['офис', 'срочно'],
    lastActivity: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    fields: {
      contactInfo: true,
      initialRequest: true,
      measurementDone: true,
      floorPlan: true,
      estimateReady: true,
      estimateApproved: false,
    },
  },
  {
    id: 'P-003',
    name: 'Дача в Переделкино',
    client: 'Петрова М.В.',
    stage: 'contract',
    budget: 1800000,
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    assignees: ['ПМ'],
    tags: ['загородный'],
    lastActivity: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    fields: {
      contactInfo: true,
      initialRequest: true,
      measurementDone: true,
      floorPlan: true,
      estimateReady: true,
      estimateApproved: true,
      contractSigned: true,
      prepaymentReceived: false,
    },
  },
  {
    id: 'P-004',
    name: 'Студия на Патриках',
    client: 'Сидоров К.Л.',
    stage: 'lead',
    budget: 800000,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    assignees: [],
    tags: ['новостройка'],
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    fields: {
      contactInfo: true,
      initialRequest: false,
    },
  },
  {
    id: 'P-005',
    name: 'Пентхаус Сити',
    client: 'Козлов Д.А.',
    stage: 'finishing',
    budget: 12000000,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    assignees: ['Прораб', 'Снабженец'],
    tags: ['премиум', 'VIP'],
    lastActivity: new Date(),
    fields: {
      contactInfo: true,
      initialRequest: true,
      measurementDone: true,
      floorPlan: true,
      estimateReady: true,
      estimateApproved: true,
      contractSigned: true,
      prepaymentReceived: true,
      materialsOrdered: true,
      deliveryScheduled: true,
      roughDonePct: 100,
      inspectionPassed: true,
      finishingDonePct: 75,
      qualityCheck: false,
    },
  },
  {
    id: 'P-006',
    name: 'Ресторан "Восток"',
    client: 'ИП Ахметов',
    stage: 'procurement',
    budget: 8500000,
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    assignees: ['Снабженец', 'Прораб'],
    tags: ['коммерция', 'HoReCa'],
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    fields: {
      contactInfo: true,
      initialRequest: true,
      measurementDone: true,
      floorPlan: true,
      estimateReady: true,
      estimateApproved: true,
      contractSigned: true,
      prepaymentReceived: true,
      materialsOrdered: true,
      deliveryScheduled: false,
    },
  },
  {
    id: 'P-007',
    name: 'Таунхаус Рублёвка',
    client: 'Новиков С.П.',
    stage: 'handover',
    budget: 25000000,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    assignees: ['ПМ', 'Прораб'],
    tags: ['премиум', 'загородный', 'VIP'],
    lastActivity: new Date(),
    fields: {
      contactInfo: true,
      initialRequest: true,
      measurementDone: true,
      floorPlan: true,
      estimateReady: true,
      estimateApproved: true,
      contractSigned: true,
      prepaymentReceived: true,
      materialsOrdered: true,
      deliveryScheduled: true,
      roughDonePct: 100,
      inspectionPassed: true,
      finishingDonePct: 100,
      qualityCheck: true,
      clientAccepted: false,
      finalPayment: false,
    },
  },
  {
    id: 'P-008',
    name: 'Квартира Сокол',
    client: 'Белова Е.Н.',
    stage: 'measurement',
    budget: 1200000,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    assignees: ['Дизайнер'],
    tags: ['вторичка'],
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    fields: {
      contactInfo: true,
      initialRequest: true,
      measurementDone: false,
      floorPlan: false,
    },
  },
];

export const DEFAULT_RULES: AutoRule[] = [
  {
    id: 'R1',
    name: 'Автоуведомление о сроках',
    enabled: true,
    priority: 1,
    conditions: [{ type: 'deadlineLte', value: 2 }],
    actions: [
      { type: 'notify', message: 'Срок сдачи менее 2 дней!' },
      { type: 'log', message: 'Сработало правило R1: приближается дедлайн' },
    ],
    scope: { stages: ['rough', 'finishing', 'handover'] },
    stopOnMatch: false,
  },
  {
    id: 'R2',
    name: 'Предупреждение о простое',
    enabled: true,
    priority: 2,
    conditions: [{ type: 'inactivityGte', value: 3 }],
    actions: [
      { type: 'notify', message: 'Проект простаивает более 3 дней' },
      { type: 'log', message: 'Сработало правило R2: обнаружен простой' },
    ],
    scope: {},
    stopOnMatch: false,
  },
  {
    id: 'R3',
    name: 'Автопереход после 80% черновых',
    enabled: true,
    priority: 3,
    conditions: [
      { type: 'stageIs', value: 'rough' },
      { type: 'percentAtLeast', value: 80 },
      { type: 'fieldTrue', value: 'inspectionPassed' },
    ],
    actions: [
      { type: 'moveNext' },
      { type: 'log', message: 'Сработало правило R3: автопереход в чистовую' },
    ],
    scope: { stages: ['rough'] },
    stopOnMatch: true,
  },
];

export function getStageIndex(stageId: StageId): number {
  return STAGES.findIndex(s => s.id === stageId);
}

export function getNextStage(stageId: StageId): StageId | null {
  const idx = getStageIndex(stageId);
  if (idx < STAGES.length - 1) {
    return STAGES[idx + 1].id;
  }
  return null;
}

export function getRoleById(roleId: RoleId): Role | undefined {
  return ROLES.find(r => r.id === roleId);
}

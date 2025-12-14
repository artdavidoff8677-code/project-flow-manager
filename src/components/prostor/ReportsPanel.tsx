import { useProstorStore } from '@/stores/prostor-store';
import { formatCurrency } from '@/lib/prostor-engine';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  DollarSign,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STAGES } from '@/data/prostor-data';

export function ReportsPanel() {
  const { projects, alerts } = useProstorStore();

  // Calculate KPIs from actual project data
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const overdueCount = alerts.filter(a => a.type === 'deadline_overdue').length;
  const idleCount = alerts.filter(a => a.type === 'inactivity').length;
  const blockedCount = alerts.filter(a => a.type === 'blocked').length;
  
  // Stage distribution
  const stageStats = STAGES.map(stage => ({
    ...stage,
    count: projects.filter(p => p.stage === stage.id).length,
  }));

  // Average progress for rough/finishing stages
  const roughProjects = projects.filter(p => p.stage === 'rough');
  const avgRoughProgress = roughProjects.length > 0
    ? Math.round(roughProjects.reduce((sum, p) => sum + (p.fields.roughDonePct || 0), 0) / roughProjects.length)
    : 0;

  const finishingProjects = projects.filter(p => p.stage === 'finishing');
  const avgFinishingProgress = finishingProjects.length > 0
    ? Math.round(finishingProjects.reduce((sum, p) => sum + (p.fields.finishingDonePct || 0), 0) / finishingProjects.length)
    : 0;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Отчёты и KPI</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Аналитика проектов и телеметрия этапов
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Всего проектов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              В работе: {projects.filter(p => !['warranty', 'handover'].includes(p.stage)).length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Общий бюджет
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Средний: {formatCurrency(Math.round(totalBudget / projects.length))}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Просрочено
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{overdueCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Простаивает: {idleCount} | Заблокировано: {blockedCount}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-success flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Эффективность
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {Math.round(((projects.length - overdueCount - blockedCount) / projects.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Проектов без проблем
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stage Telemetry */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Телеметрия этапов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stageStats.map(stage => (
              <div key={stage.id} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">{stage.name}</div>
                <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-info rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    style={{ width: `${Math.max((stage.count / projects.length) * 100, 5)}%` }}
                  >
                    <span className="text-xs font-medium text-primary-foreground">
                      {stage.count}
                    </span>
                  </div>
                </div>
                <div className="w-16 text-sm text-muted-foreground text-right">
                  {Math.round((stage.count / projects.length) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Averages */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Средний прогресс (Черновая)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-stage-rough rounded-full transition-all duration-500"
                  style={{ width: `${avgRoughProgress}%` }}
                />
              </div>
              <span className="text-2xl font-bold">{avgRoughProgress}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {roughProjects.length} проектов на этапе
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Средний прогресс (Чистовая)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-stage-finishing rounded-full transition-all duration-500"
                  style={{ width: `${avgFinishingProgress}%` }}
                />
              </div>
              <span className="text-2xl font-bold">{avgFinishingProgress}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {finishingProjects.length} проектов на этапе
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

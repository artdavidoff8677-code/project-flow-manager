import { useProstorStore } from '@/stores/prostor-store';
import { cn } from '@/lib/utils';
import { 
  AlertTriangle, 
  Clock, 
  Ban, 
  Calendar,
  Play,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const alertIcons = {
  deadline_overdue: AlertTriangle,
  deadline_soon: Calendar,
  inactivity: Clock,
  blocked: Ban,
};

const alertColors = {
  error: 'border-destructive/50 bg-destructive/10',
  warning: 'border-warning/50 bg-warning/10',
  info: 'border-info/50 bg-info/10',
};

const severityBadge = {
  error: 'destructive',
  warning: 'outline',
  info: 'secondary',
} as const;

export function SLAPanel() {
  const { alerts, applyRules, fillMinimum, projects } = useProstorStore();

  const errorAlerts = alerts.filter(a => a.severity === 'error');
  const warningAlerts = alerts.filter(a => a.severity === 'warning');
  const infoAlerts = alerts.filter(a => a.severity === 'info');

  const handleApplyRules = () => {
    applyRules();
  };

  const handleQuickFix = (projectId: string) => {
    fillMinimum(projectId);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">SLA / Алёрты</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Мониторинг сроков, простоев и блокировок
            </p>
          </div>
          <Button onClick={handleApplyRules}>
            <Play className="w-4 h-4 mr-2" />
            Применить правила
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold text-2xl">{errorAlerts.length}</span>
            </div>
            <p className="text-sm text-destructive/80 mt-1">Критичных</p>
          </div>
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
            <div className="flex items-center gap-2 text-warning">
              <Clock className="w-5 h-5" />
              <span className="font-semibold text-2xl">{warningAlerts.length}</span>
            </div>
            <p className="text-sm text-warning/80 mt-1">Предупреждений</p>
          </div>
          <div className="p-4 rounded-lg bg-info/10 border border-info/30">
            <div className="flex items-center gap-2 text-info">
              <Ban className="w-5 h-5" />
              <span className="font-semibold text-2xl">{infoAlerts.length}</span>
            </div>
            <p className="text-sm text-info/80 mt-1">Информационных</p>
          </div>
          <div className="p-4 rounded-lg bg-success/10 border border-success/30">
            <div className="flex items-center gap-2 text-success">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold text-2xl">{projects.length}</span>
            </div>
            <p className="text-sm text-success/80 mt-1">Всего проектов</p>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Нет активных алёртов</p>
            </div>
          ) : (
            alerts.map(alert => {
              const Icon = alertIcons[alert.type];
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'p-4 rounded-lg border flex items-start gap-4',
                    alertColors[alert.severity]
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-lg',
                    alert.severity === 'error' && 'bg-destructive/20',
                    alert.severity === 'warning' && 'bg-warning/20',
                    alert.severity === 'info' && 'bg-info/20'
                  )}>
                    <Icon className={cn(
                      'w-5 h-5',
                      alert.severity === 'error' && 'text-destructive',
                      alert.severity === 'warning' && 'text-warning',
                      alert.severity === 'info' && 'text-info'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={severityBadge[alert.severity]} className="text-xs">
                        {alert.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        {alert.projectId}
                      </span>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                  {alert.type === 'blocked' && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleQuickFix(alert.projectId)}
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Быстрый фикс
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

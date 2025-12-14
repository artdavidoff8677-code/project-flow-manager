import { useProstorStore } from '@/stores/prostor-store';
import { formatCurrency, formatDate } from '@/lib/prostor-engine';
import { STAGES } from '@/data/prostor-data';
import { 
  User, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  FileText,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function ClientPortal() {
  const { projects } = useProstorStore();

  // For demo, show first project as "client's project"
  const clientProject = projects[0];
  const stage = STAGES.find(s => s.id === clientProject?.stage);
  const stageIndex = STAGES.findIndex(s => s.id === clientProject?.stage);
  const progress = Math.round((stageIndex / (STAGES.length - 1)) * 100);

  if (!clientProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Нет активных проектов</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Добро пожаловать!</h2>
            <p className="text-sm text-muted-foreground">{clientProject.client}</p>
          </div>
        </div>

        {/* Project Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Ваш проект</span>
              <Badge variant="outline">{clientProject.id}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-4">{clientProject.name}</h3>
            
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Общий прогресс</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Stage Info */}
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-medium">Текущий этап: {stage?.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Следующий шаг: {STAGES[stageIndex + 1]?.name || 'Завершение проекта'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Бюджет</p>
                <p className="text-lg font-semibold">{formatCurrency(clientProject.budget)}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Дедлайн</p>
                <p className="text-lg font-semibold">{formatDate(clientProject.deadline)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Согласовать смету</p>
                <p className="text-xs text-muted-foreground">Просмотр и утверждение</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/20">
                <MessageSquare className="w-5 h-5 text-info" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Сообщения</p>
                <p className="text-xs text-muted-foreground">Связь с командой</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        {/* Stage Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Этапы проекта</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {STAGES.map((s, idx) => {
                const isCompleted = idx < stageIndex;
                const isCurrent = idx === stageIndex;
                
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center shrink-0
                      ${isCompleted ? 'bg-success' : isCurrent ? 'bg-primary' : 'bg-muted'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-success-foreground" />
                      ) : (
                        <span className={`text-sm font-medium ${isCurrent ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <div className={`flex-1 ${!isCompleted && !isCurrent ? 'opacity-50' : ''}`}>
                      <p className="font-medium text-sm">{s.name}</p>
                    </div>
                    {isCurrent && (
                      <Badge>В работе</Badge>
                    )}
                    {isCompleted && (
                      <Badge variant="outline" className="text-success border-success">
                        Готово
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

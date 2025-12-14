import { useState } from 'react';
import { runTests } from '@/lib/prostor-engine';
import { useProstorStore } from '@/stores/prostor-store';
import { DEFAULT_RULES } from '@/data/prostor-data';
import { 
  Settings as SettingsIcon, 
  Play, 
  CheckCircle2, 
  XCircle,
  Code,
  Cog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export function SettingsPanel() {
  const { rules, logs } = useProstorStore();
  const [testResults, setTestResults] = useState<{ name: string; passed: boolean; message: string }[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = () => {
    setIsRunning(true);
    // Simulate async test run
    setTimeout(() => {
      const results = runTests();
      setTestResults(results);
      setIsRunning(false);
    }, 500);
  };

  const passedTests = testResults?.filter(t => t.passed).length ?? 0;
  const totalTests = testResults?.length ?? 0;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-6 h-6" />
          Настройки
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Конфигурация системы и диагностика
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Diagnostics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Диагностика / Тесты
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleRunTests} 
              disabled={isRunning}
              className="w-full"
            >
              <Play className={cn('w-4 h-4 mr-2', isRunning && 'animate-spin')} />
              {isRunning ? 'Запуск...' : 'Запустить тесты'}
            </Button>

            {testResults && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className="font-medium">Результат</span>
                  <Badge variant={passedTests === totalTests ? 'default' : 'destructive'}>
                    {passedTests}/{totalTests} PASS
                  </Badge>
                </div>

                {testResults.map((test, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      'p-3 rounded-lg border flex items-start gap-3',
                      test.passed ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30'
                    )}
                  >
                    {test.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{test.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{test.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rules Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cog className="w-5 h-5" />
              Авто-правила
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {DEFAULT_RULES.map(rule => (
              <div 
                key={rule.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {rule.id}
                    </Badge>
                    <span className="font-medium text-sm">{rule.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Условий: {rule.conditions.length} | Действий: {rule.actions.length}
                  </p>
                </div>
                <Switch checked={rule.enabled} disabled />
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center pt-2">
              Редактор правил будет добавлен в следующей версии
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Журнал событий (последние 10)</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Нет записей в журнале
            </p>
          ) : (
            <div className="space-y-2">
              {logs.slice(-10).reverse().map(log => (
                <div key={log.id} className="flex items-center gap-3 text-sm py-2 border-b border-border/50 last:border-0">
                  <span className="text-xs text-muted-foreground font-mono w-20">
                    {new Date(log.timestamp).toLocaleTimeString('ru-RU')}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {log.type}
                  </Badge>
                  {log.projectId && (
                    <span className="text-xs font-mono text-muted-foreground">
                      {log.projectId}
                    </span>
                  )}
                  <span className="flex-1 truncate">{log.details}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

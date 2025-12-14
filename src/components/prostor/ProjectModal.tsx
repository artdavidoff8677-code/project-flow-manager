import { useProstorStore } from '@/stores/prostor-store';
import { STAGES, ROLES, getNextStage } from '@/data/prostor-data';
import { getMissingRequirements, canMoveToNextStage, formatCurrency, formatDate } from '@/lib/prostor-engine';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2,
  Calendar,
  DollarSign,
  Users,
  Tags,
  FileText,
  Zap
} from 'lucide-react';

export function ProjectModal() {
  const { 
    selectedProject, 
    setSelectedProject, 
    updateProjectField, 
    moveProjectToStage,
    fillMinimum,
    currentRole 
  } = useProstorStore();

  if (!selectedProject) return null;

  const stage = STAGES.find(s => s.id === selectedProject.stage);
  const missing = getMissingRequirements(selectedProject);
  const canMove = canMoveToNextStage(selectedProject);
  const nextStage = getNextStage(selectedProject.stage);
  const nextStageName = STAGES.find(s => s.id === nextStage)?.name;
  const role = ROLES.find(r => r.id === currentRole);

  const canEdit = (field: string) => {
    if (role?.permissions.editFields === '*') return true;
    return role?.permissions.editFields?.includes(field) ?? false;
  };

  const handleFieldChange = (field: string, value: any) => {
    updateProjectField(selectedProject.id, field, value);
  };

  const handleMoveNext = () => {
    if (canMove && nextStage) {
      moveProjectToStage(selectedProject.id, nextStage);
      setSelectedProject(null);
    }
  };

  const handleFillMinimum = () => {
    fillMinimum(selectedProject.id);
  };

  return (
    <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-muted-foreground">{selectedProject.id}</span>
            <Badge variant="outline">{stage?.name}</Badge>
          </div>
          <DialogTitle className="text-xl">{selectedProject.name}</DialogTitle>
        </DialogHeader>

        {/* Quick Info */}
        <div className="grid grid-cols-4 gap-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{formatDate(selectedProject.deadline)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span>{formatCurrency(selectedProject.budget)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{selectedProject.assignees.length || 'Нет'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Tags className="w-4 h-4 text-muted-foreground" />
            <span>{selectedProject.tags.length} тегов</span>
          </div>
        </div>

        <Separator />

        {/* Stage Requirements */}
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Требования этапа «{stage?.name}»
            </h3>
            {missing.length > 0 && (
              <Badge variant="outline" className="text-warning border-warning">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {missing.length} не выполнено
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            {stage?.required.map(req => {
              const value = selectedProject.fields[req.field as keyof typeof selectedProject.fields];
              const isMet = req.type === 'boolean' 
                ? value === true 
                : req.type === 'threshold' && req.threshold 
                  ? (value as number) >= req.threshold 
                  : !!value;
              const editable = canEdit(req.field);

              return (
                <div 
                  key={req.field}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border transition-all',
                    isMet ? 'bg-success/10 border-success/30' : 'bg-muted/30 border-border'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isMet ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <span className={cn('text-sm', isMet && 'text-success')}>{req.label}</span>
                  </div>

                  {req.type === 'boolean' && editable && (
                    <Checkbox
                      checked={value === true}
                      onCheckedChange={(checked) => handleFieldChange(req.field, checked)}
                    />
                  )}

                  {req.type === 'threshold' && (
                    <div className="flex items-center gap-3 w-40">
                      <Slider
                        value={[typeof value === 'number' ? value : 0]}
                        onValueChange={([v]) => editable && handleFieldChange(req.field, v)}
                        max={100}
                        step={5}
                        disabled={!editable}
                        className="flex-1"
                      />
                      <span className="text-sm font-mono w-12 text-right">
                        {typeof value === 'number' ? value : 0}%
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Notes */}
        <div className="py-4">
          <h3 className="font-semibold mb-3">Заметки</h3>
          <Textarea
            value={selectedProject.fields.notes || ''}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            placeholder="Добавить заметки..."
            className="min-h-[80px]"
            disabled={!canEdit('notes') && role?.permissions.editFields !== '*'}
          />
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex gap-2">
            {missing.length > 0 && (role?.permissions.moveStage || role?.id === 'admin') && (
              <Button variant="outline" size="sm" onClick={handleFillMinimum}>
                <Zap className="w-4 h-4 mr-1" />
                Заполнить минимум
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setSelectedProject(null)}>
              Закрыть
            </Button>
            {nextStage && role?.permissions.moveStage && (
              <Button 
                onClick={handleMoveNext}
                disabled={!canMove}
                className={cn(!canMove && 'opacity-50')}
              >
                Перейти к «{nextStageName}»
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>

        {!canMove && nextStage && (
          <p className="text-xs text-muted-foreground text-center">
            Выполните все требования для перехода на следующий этап
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

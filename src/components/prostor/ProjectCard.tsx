import { Project, RiskType } from '@/types/prostor';
import { STAGES } from '@/data/prostor-data';
import { useProstorStore } from '@/stores/prostor-store';
import { getProjectRisk, getDaysToDeadline, formatCurrency, formatDate, getMissingRequirements } from '@/lib/prostor-engine';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  AlertTriangle, 
  Ban, 
  CheckCircle2, 
  Calendar,
  Users,
  DollarSign
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProjectCardProps {
  project: Project;
}

const riskConfig: Record<RiskType, { icon: typeof Clock; color: string; bg: string }> = {
  ok: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/20' },
  idle: { icon: Clock, color: 'text-warning', bg: 'bg-warning/20' },
  blocked: { icon: Ban, color: 'text-destructive', bg: 'bg-destructive/20' },
  overdue: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/30' },
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { setSelectedProject } = useProstorStore();
  const risk = getProjectRisk(project);
  const daysToDeadline = getDaysToDeadline(project);
  const missing = getMissingRequirements(project);
  const RiskIcon = riskConfig[risk.type].icon;

  return (
    <div
      onClick={() => setSelectedProject(project)}
      className="kanban-card group animate-fade-in"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">{project.id}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn('p-1 rounded', riskConfig[risk.type].bg)}>
                  <RiskIcon className={cn('w-3 h-3', riskConfig[risk.type].color)} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{risk.label}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <h3 className="font-medium text-sm text-card-foreground truncate group-hover:text-primary transition-colors">
            {project.name}
          </h3>
        </div>
      </div>

      {/* Client */}
      <p className="text-xs text-muted-foreground mb-3 truncate">
        {project.client}
      </p>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {project.tags.slice(0, 3).map(tag => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-[10px] px-1.5 py-0"
            >
              #{tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Progress bar for rough/finishing */}
      {(project.stage === 'rough' || project.stage === 'finishing') && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Прогресс</span>
            <span className="text-foreground">
              {project.stage === 'rough' ? project.fields.roughDonePct : project.fields.finishingDonePct}%
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-info rounded-full transition-all duration-500"
              style={{ 
                width: `${project.stage === 'rough' ? project.fields.roughDonePct : project.fields.finishingDonePct}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span className={cn(daysToDeadline < 0 && 'text-destructive', daysToDeadline <= 2 && daysToDeadline >= 0 && 'text-warning')}>
                {formatDate(project.deadline)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{daysToDeadline < 0 ? `Просрочено на ${Math.abs(daysToDeadline)} дн.` : `До дедлайна: ${daysToDeadline} дн.`}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>{formatCurrency(project.budget).replace('₽', '').trim()}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Бюджет: {formatCurrency(project.budget)}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {project.assignees.length > 0 && (
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{project.assignees.length}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{project.assignees.join(', ')}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Missing requirements indicator */}
      {missing.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border/50">
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-1.5 text-xs text-warning">
              <AlertTriangle className="w-3 h-3" />
              <span>Не выполнено: {missing.length}</span>
            </TooltipTrigger>
            <TooltipContent>
              <ul className="text-xs space-y-1">
                {missing.map(m => (
                  <li key={m.field}>• {m.label}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

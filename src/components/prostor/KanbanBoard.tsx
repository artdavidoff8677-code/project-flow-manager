import { useMemo } from 'react';
import { useProstorStore } from '@/stores/prostor-store';
import { STAGES } from '@/data/prostor-data';
import { searchProjects } from '@/lib/prostor-engine';
import { ProjectCard } from './ProjectCard';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const stageColors: Record<string, string> = {
  lead: 'from-stage-lead/20 to-stage-lead/5',
  measurement: 'from-stage-measurement/20 to-stage-measurement/5',
  estimate: 'from-stage-estimate/20 to-stage-estimate/5',
  contract: 'from-stage-contract/20 to-stage-contract/5',
  procurement: 'from-stage-procurement/20 to-stage-procurement/5',
  rough: 'from-stage-rough/20 to-stage-rough/5',
  finishing: 'from-stage-finishing/20 to-stage-finishing/5',
  handover: 'from-stage-handover/20 to-stage-handover/5',
  warranty: 'from-stage-warranty/20 to-stage-warranty/5',
};

const stageDotColors: Record<string, string> = {
  lead: 'bg-stage-lead',
  measurement: 'bg-stage-measurement',
  estimate: 'bg-stage-estimate',
  contract: 'bg-stage-contract',
  procurement: 'bg-stage-procurement',
  rough: 'bg-stage-rough',
  finishing: 'bg-stage-finishing',
  handover: 'bg-stage-handover',
  warranty: 'bg-stage-warranty',
};

export function KanbanBoard() {
  const { projects, searchQuery } = useProstorStore();

  const filteredProjects = useMemo(() => {
    return searchProjects(projects, searchQuery);
  }, [projects, searchQuery]);

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="flex gap-4 p-4 min-w-max h-full">
        {STAGES.map(stage => {
          const stageProjects = filteredProjects.filter(p => p.stage === stage.id);
          
          return (
            <div 
              key={stage.id} 
              className={cn(
                'stage-column',
                'bg-gradient-to-b',
                stageColors[stage.id]
              )}
            >
              {/* Header */}
              <div className="stage-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2.5 h-2.5 rounded-full', stageDotColors[stage.id])} />
                    <h3 className="font-semibold text-sm text-foreground">{stage.name}</h3>
                    <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                      {stageProjects.length}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Cards */}
              <ScrollArea className="flex-1 px-2 pb-2">
                <div className="space-y-2 pt-2">
                  {stageProjects.length > 0 ? (
                    stageProjects.map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-xs">
                      Нет проектов
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>
    </div>
  );
}

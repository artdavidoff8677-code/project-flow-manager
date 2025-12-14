import { useProstorStore } from '@/stores/prostor-store';
import { Sidebar } from '@/components/prostor/Sidebar';
import { SearchBar } from '@/components/prostor/SearchBar';
import { KanbanBoard } from '@/components/prostor/KanbanBoard';
import { ProjectModal } from '@/components/prostor/ProjectModal';
import { SLAPanel } from '@/components/prostor/SLAPanel';
import { ReportsPanel } from '@/components/prostor/ReportsPanel';
import { SettingsPanel } from '@/components/prostor/SettingsPanel';
import { ClientPortal } from '@/components/prostor/ClientPortal';
import { DesignPanel } from '@/components/prostor/DesignPanel';
import { EstimatePanel } from '@/components/prostor/EstimatePanel';
import { ProcurementPanel } from '@/components/prostor/ProcurementPanel';
import { LogisticsPanel } from '@/components/prostor/LogisticsPanel';
import { FinancePanel } from '@/components/prostor/FinancePanel';

const Index = () => {
  const { activeView } = useProstorStore();

  const renderContent = () => {
    switch (activeView) {
      case 'kanban':
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-card/50">
              <SearchBar />
            </div>
            <KanbanBoard />
          </div>
        );
      case 'sla':
        return <SLAPanel />;
      case 'reports':
        return <ReportsPanel />;
      case 'settings':
        return <SettingsPanel />;
      case 'client-portal':
        return <ClientPortal />;
      case 'design':
        return <DesignPanel />;
      case 'estimate':
        return <EstimatePanel />;
      case 'procurement':
        return <ProcurementPanel />;
      case 'logistics':
        return <LogisticsPanel />;
      case 'finance':
        return <FinancePanel />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Модуль в разработке
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </main>
      <ProjectModal />
    </div>
  );
};

export default Index;

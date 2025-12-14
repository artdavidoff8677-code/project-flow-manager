import { 
  LayoutDashboard, 
  Palette, 
  FileText, 
  Package, 
  Truck, 
  Wallet, 
  BarChart3, 
  AlertTriangle, 
  Settings, 
  User,
  ChevronDown,
  Building2
} from 'lucide-react';
import { useProstorStore } from '@/stores/prostor-store';
import { ROLES } from '@/data/prostor-data';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const NAV_ITEMS = [
  { id: 'kanban', label: 'Канбан', icon: LayoutDashboard },
  { id: 'design', label: 'Дизайн', icon: Palette },
  { id: 'estimate', label: 'Смета', icon: FileText },
  { id: 'procurement', label: 'Закупка', icon: Package },
  { id: 'logistics', label: 'Логистика', icon: Truck },
  { id: 'finance', label: 'Финансы', icon: Wallet },
  { id: 'reports', label: 'Отчёты', icon: BarChart3 },
  { id: 'sla', label: 'SLA/Алёрты', icon: AlertTriangle },
  { id: 'settings', label: 'Настройки', icon: Settings },
  { id: 'client-portal', label: 'Портал клиента', icon: User },
];

export function Sidebar() {
  const { currentRole, setCurrentRole, activeView, setActiveView, alerts } = useProstorStore();
  const role = ROLES.find(r => r.id === currentRole);
  
  const visibleItems = NAV_ITEMS.filter(item => role?.views.includes(item.id));
  const alertCount = alerts.filter(a => a.severity === 'error').length;

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">Prostor</h1>
            <p className="text-xs text-muted-foreground">Build OS</p>
          </div>
        </div>
      </div>

      {/* Role Selector */}
      <div className="p-3 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{role?.name}</span>
              </div>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {ROLES.map(r => (
              <DropdownMenuItem 
                key={r.id}
                onClick={() => setCurrentRole(r.id)}
                className={cn(currentRole === r.id && 'bg-accent')}
              >
                {r.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {visibleItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const showBadge = item.id === 'sla' && alertCount > 0;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                isActive 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {showBadge && (
                <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center text-xs">
                  {alertCount}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">
          MVP v0.1 • Демо-режим
        </p>
      </div>
    </aside>
  );
}

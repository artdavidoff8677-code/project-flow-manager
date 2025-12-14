import { 
  Truck, 
  MapPin, 
  Package, 
  CheckCircle2,
  Clock,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DEMO_DELIVERIES = [
  { 
    id: 'DEL-001', 
    from: 'Склад Химки', 
    to: 'Объект P-001 (Тверская)', 
    driver: 'Иванов П.', 
    status: 'in_progress',
    eta: '14:30'
  },
  { 
    id: 'DEL-002', 
    from: 'СтройМаркет', 
    to: 'Склад Химки', 
    driver: 'Петров А.', 
    status: 'pending',
    eta: '16:00'
  },
  { 
    id: 'DEL-003', 
    from: 'Склад Химки', 
    to: 'Объект P-005 (Сити)', 
    driver: 'Сидоров К.', 
    status: 'delivered',
    eta: 'Доставлено'
  },
];

const DEMO_ROUTES = [
  { id: 1, name: 'Маршрут #1', stops: 4, distance: '45 км', time: '2ч 15м' },
  { id: 2, name: 'Маршрут #2', stops: 2, distance: '28 км', time: '1ч 30м' },
  { id: 3, name: 'Маршрут #3', stops: 6, distance: '67 км', time: '3ч 45м' },
];

export function LogisticsPanel() {
  const statusConfig = {
    pending: { label: 'Ожидает', color: 'bg-warning/20 text-warning', icon: Clock },
    in_progress: { label: 'В пути', color: 'bg-info/20 text-info', icon: Truck },
    delivered: { label: 'Доставлено', color: 'bg-success/20 text-success', icon: CheckCircle2 },
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="w-6 h-6" />
          Логистика
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Маршруты, доставки и подтверждения
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Active Deliveries */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Активные доставки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DEMO_DELIVERIES.map(delivery => {
                const config = statusConfig[delivery.status as keyof typeof statusConfig];
                const StatusIcon = config.icon;
                
                return (
                  <div key={delivery.id} className="p-4 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{delivery.id}</span>
                        <Badge className={config.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">{delivery.eta}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{delivery.from}</span>
                      </div>
                      <span className="text-muted-foreground">→</span>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{delivery.to}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{delivery.driver}</span>
                      </div>
                      {delivery.status !== 'delivered' && (
                        <Button size="sm" variant="outline">
                          Подтвердить
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Маршруты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DEMO_ROUTES.map(route => (
                <div key={route.id} className="p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{route.name}</span>
                    <Badge variant="secondary" className="text-xs">{route.stops} точек</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{route.distance}</span>
                    <span>~{route.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Построить маршрут
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-muted-foreground mt-8 text-sm">
        Интеграция с картами и GPS-трекингом в следующей версии
      </p>
    </div>
  );
}

import { 
  Package, 
  Warehouse, 
  Users, 
  Clock,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/prostor-engine';

const DEMO_REQUESTS = [
  { id: 'REQ-001', project: 'P-001', material: 'Ламинат Tarkett', quantity: 50, unit: 'м²', status: 'pending', date: '12 дек' },
  { id: 'REQ-002', project: 'P-005', material: 'Плитка Kerama', quantity: 25, unit: 'м²', status: 'ordered', date: '11 дек' },
  { id: 'REQ-003', project: 'P-006', material: 'Электрокабель ВВГ', quantity: 200, unit: 'м', status: 'delivered', date: '10 дек' },
];

const DEMO_INVENTORY = [
  { id: 1, name: 'Ламинат Tarkett', quantity: 120, unit: 'м²', minQty: 50 },
  { id: 2, name: 'Краска Dulux белая', quantity: 45, unit: 'л', minQty: 20 },
  { id: 3, name: 'Плитка керамическая', quantity: 15, unit: 'м²', minQty: 30 },
  { id: 4, name: 'Гипсокартон 12мм', quantity: 80, unit: 'шт', minQty: 40 },
];

const DEMO_SUPPLIERS = [
  { id: 1, name: 'СтройМаркет', category: 'Отделочные материалы', rating: 4.8 },
  { id: 2, name: 'ЭлектроПро', category: 'Электрика', rating: 4.5 },
  { id: 3, name: 'СантехОпт', category: 'Сантехника', rating: 4.2 },
];

export function ProcurementPanel() {
  const statusColors = {
    pending: 'bg-warning/20 text-warning',
    ordered: 'bg-info/20 text-info',
    delivered: 'bg-success/20 text-success',
  };

  const statusLabels = {
    pending: 'Ожидает',
    ordered: 'Заказано',
    delivered: 'Доставлено',
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6" />
            Закупка / Склад
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Заявки, складские остатки и поставщики
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Новая заявка
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Material Requests */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Заявки на материалы
            </CardTitle>
            <div className="flex gap-2">
              <Input placeholder="Поиск..." className="w-40 h-8" />
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DEMO_REQUESTS.map(req => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">{req.id}</span>
                      <p className="font-medium text-sm">{req.material}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{req.project}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">{req.quantity} {req.unit}</span>
                    <span className="text-xs text-muted-foreground">{req.date}</span>
                    <Badge className={statusColors[req.status as keyof typeof statusColors]}>
                      {statusLabels[req.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Suppliers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Поставщики
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DEMO_SUPPLIERS.map(supplier => (
                <div key={supplier.id} className="p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{supplier.name}</span>
                    <Badge variant="secondary" className="text-xs">★ {supplier.rating}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{supplier.category}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2" size="sm">
                Все поставщики
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="w-5 h-5" />
              Складские остатки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {DEMO_INVENTORY.map(item => {
                const isLow = item.quantity < item.minQty;
                return (
                  <div 
                    key={item.id} 
                    className={`p-4 rounded-lg border ${isLow ? 'bg-destructive/10 border-destructive/30' : 'bg-muted/30 border-border'}`}
                  >
                    <p className="font-medium text-sm mb-2">{item.name}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className={`text-2xl font-bold ${isLow ? 'text-destructive' : ''}`}>
                          {item.quantity}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">{item.unit}</span>
                      </div>
                      {isLow && (
                        <Badge variant="destructive" className="text-xs">Мало</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Мин: {item.minQty} {item.unit}</p>
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

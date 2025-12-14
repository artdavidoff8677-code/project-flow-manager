import { 
  Wallet, 
  FileText, 
  CreditCard, 
  TrendingUp,
  Download,
  Send,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/prostor-engine';

const DEMO_INVOICES = [
  { id: 'INV-001', project: 'P-001', amount: 500000, status: 'paid', date: '10 дек' },
  { id: 'INV-002', project: 'P-005', amount: 2400000, status: 'pending', date: '12 дек' },
  { id: 'INV-003', project: 'P-007', amount: 5000000, status: 'overdue', date: '05 дек' },
];

const DEMO_ACTS = [
  { id: 'ACT-001', project: 'P-003', type: 'Акт выполненных работ', status: 'signed' },
  { id: 'ACT-002', project: 'P-006', type: 'Акт приёмки материалов', status: 'pending' },
];

export function FinancePanel() {
  const statusConfig = {
    paid: { label: 'Оплачено', color: 'bg-success/20 text-success' },
    pending: { label: 'Ожидает', color: 'bg-warning/20 text-warning' },
    overdue: { label: 'Просрочено', color: 'bg-destructive/20 text-destructive' },
    signed: { label: 'Подписан', color: 'bg-success/20 text-success' },
  };

  const totalReceived = DEMO_INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = DEMO_INVOICES.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const totalOverdue = DEMO_INVOICES.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          Финансы
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Счета, оплаты и акты
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-success/10 border-success/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-success mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Получено</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalReceived)}</p>
          </CardContent>
        </Card>

        <Card className="bg-warning/10 border-warning/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-warning mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Ожидает</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalPending)}</p>
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Просрочено</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalOverdue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm font-medium">Всего счетов</span>
            </div>
            <p className="text-2xl font-bold">{DEMO_INVOICES.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Счета
            </CardTitle>
            <Button size="sm">Создать счёт</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DEMO_INVOICES.map(invoice => (
                <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{invoice.id}</span>
                      <Badge variant="outline" className="text-xs">{invoice.project}</Badge>
                    </div>
                    <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{invoice.date}</span>
                    <Badge className={statusConfig[invoice.status as keyof typeof statusConfig].color}>
                      {statusConfig[invoice.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Акты
            </CardTitle>
            <Button size="sm" variant="outline">Создать акт</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DEMO_ACTS.map(act => (
                <div key={act.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{act.id}</span>
                      <Badge variant="outline" className="text-xs">{act.project}</Badge>
                    </div>
                    <p className="text-sm">{act.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusConfig[act.status as keyof typeof statusConfig].color}>
                      {statusConfig[act.status as keyof typeof statusConfig].label}
                    </Badge>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Accounting Adapter Placeholder */}
            <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-border">
              <p className="text-sm font-medium mb-2">Адаптер бухгалтерии</p>
              <p className="text-xs text-muted-foreground mb-3">
                Интеграция с 1С, МойСклад и другими системами
              </p>
              <Badge variant="secondary">В очереди на разработку</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

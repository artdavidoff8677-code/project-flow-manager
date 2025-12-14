import { useState } from 'react';
import { EstimateItem } from '@/types/prostor';
import { formatCurrency } from '@/lib/prostor-engine';
import { 
  FileText, 
  Plus, 
  Download,
  Send,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const DEMO_ITEMS: EstimateItem[] = [
  { id: '1', type: 'material', name: 'Ламинат Tarkett 33 класс', unit: 'м²', quantity: 45, price: 1200, vatRate: 20, total: 54000 },
  { id: '2', type: 'material', name: 'Плитка керамическая Kerama', unit: 'м²', quantity: 12, price: 2500, vatRate: 20, total: 30000 },
  { id: '3', type: 'work', name: 'Укладка ламината', unit: 'м²', quantity: 45, price: 450, vatRate: 20, total: 20250 },
  { id: '4', type: 'work', name: 'Укладка плитки', unit: 'м²', quantity: 12, price: 1200, vatRate: 20, total: 14400 },
  { id: '5', type: 'material', name: 'Краска Dulux интерьерная', unit: 'л', quantity: 25, price: 800, vatRate: 20, total: 20000 },
  { id: '6', type: 'work', name: 'Покраска стен (2 слоя)', unit: 'м²', quantity: 120, price: 280, vatRate: 20, total: 33600 },
  { id: '7', type: 'service', name: 'Доставка материалов', unit: 'усл.', quantity: 1, price: 5000, vatRate: 20, total: 5000 },
];

export function EstimatePanel() {
  const [items] = useState<EstimateItem[]>(DEMO_ITEMS);

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const vat = Math.round(subtotal * 0.2);
  const total = subtotal + vat;

  const typeLabels = {
    material: 'Материал',
    work: 'Работа',
    service: 'Услуга',
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Смета
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Расчёт стоимости работ и материалов
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Экспорт PDF
          </Button>
          <Button>
            <Send className="w-4 h-4 mr-2" />
            На согласование
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Позиции сметы</CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Добавить
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Наименование</TableHead>
                <TableHead className="text-center">Ед.</TableHead>
                <TableHead className="text-right">Кол-во</TableHead>
                <TableHead className="text-right">Цена</TableHead>
                <TableHead className="text-right">НДС</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {typeLabels[item.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{item.unit}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.vatRate}%</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Totals */}
          <div className="mt-6 border-t border-border pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Подытог:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">НДС (20%):</span>
                  <span>{formatCurrency(vat)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                  <span>Итого:</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

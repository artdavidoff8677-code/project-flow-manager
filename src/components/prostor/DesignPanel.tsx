import { 
  Palette, 
  Image, 
  Box, 
  Check,
  Upload,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function DesignPanel() {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Palette className="w-6 h-6" />
          Дизайн
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Мудборды, планы и согласование концепции
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Moodboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Image className="w-5 h-5" />
              Мудборд
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-border">
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Загрузить изображения</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Создать мудборд
            </Button>
          </CardContent>
        </Card>

        {/* Floor Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="w-5 h-5" />
              Планы 2D
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-border">
              <div className="text-center">
                <Box className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Планировки</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">2D</Button>
              <Button variant="outline" className="flex-1">3D</Button>
              <Button variant="outline" className="flex-1">VR</Button>
            </div>
          </CardContent>
        </Card>

        {/* Concept Approval */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Check className="w-5 h-5" />
              Согласование
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                <span className="text-sm">Концепция v1</span>
                <Badge variant="outline" className="text-warning border-warning">На проверке</Badge>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                <span className="text-sm">Цветовая схема</span>
                <Badge variant="outline" className="text-success border-success">Утверждено</Badge>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                <span className="text-sm">Материалы</span>
                <Badge variant="secondary">Черновик</Badge>
              </div>
            </div>
            <Button className="w-full mt-4">
              Отправить на согласование
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-muted-foreground mt-8 text-sm">
        Полный функционал дизайн-модуля будет доступен в следующей версии
      </p>
    </div>
  );
}

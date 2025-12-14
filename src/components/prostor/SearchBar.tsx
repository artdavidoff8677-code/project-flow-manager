import { Search, X, Filter } from 'lucide-react';
import { useProstorStore } from '@/stores/prostor-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const QUICK_FILTERS = [
  { label: '#премиум', query: '#премиум' },
  { label: '#срочно', query: '#срочно' },
  { label: '@Прораб', query: '@прораб' },
  { label: 'stage:черновая', query: 'stage:rough' },
];

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useProstorStore();

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск: id:P-001, #тег, @исполнитель, stage:..."
          className="pl-10 pr-10 bg-muted/50 border-border focus:bg-card"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {QUICK_FILTERS.map(filter => (
          <Tooltip key={filter.query}>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => setSearchQuery(filter.query)}
              >
                {filter.label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Быстрый фильтр</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <Button variant="outline" size="icon">
        <Filter className="w-4 h-4" />
      </Button>
    </div>
  );
}

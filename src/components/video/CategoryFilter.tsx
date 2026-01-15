import { Button } from '@/components/ui/button';
import { VIDEO_CATEGORIES, VideoCategory } from '@/lib/videoCategories';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: VideoCategory | 'all';
  onCategoryChange: (category: VideoCategory | 'all') => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onCategoryChange('all')}
        className={cn(
          'transition-all',
          selectedCategory === 'all' && 'ring-2 ring-primary ring-offset-2'
        )}
      >
        🎯 All
      </Button>
      {VIDEO_CATEGORIES.map((category) => (
        <Button
          key={category.value}
          variant={selectedCategory === category.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category.value)}
          className={cn(
            'transition-all',
            selectedCategory === category.value && 'ring-2 ring-primary ring-offset-2'
          )}
        >
          {category.icon} {category.label}
        </Button>
      ))}
    </div>
  );
}

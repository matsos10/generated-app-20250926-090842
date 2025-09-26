import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Scene } from '@/lib/types';
import { useCreatorStore } from '@/hooks/useCreatorStore';
interface SceneCardProps {
  scene: Scene;
  index: number;
  sceneCount: number;
}
export function SceneCard({ scene, index, sceneCount }: SceneCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: scene.id });
  const { removeScene, updateScene } = useCreatorStore();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="bg-zinc-900 border-zinc-800 relative group">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 left-1 h-8 w-8 cursor-grab touch-none text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </Button>
        <CardContent className="p-6 pl-12 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-white">Scene {index + 1}</h3>
            {sceneCount > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-500 hover:bg-red-900/20 hover:text-red-500"
                onClick={() => removeScene(scene.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div>
            <label htmlFor={`text-${scene.id}`} className="block text-sm font-medium text-zinc-400 mb-2">
              Narration Script
            </label>
            <Textarea
              id={`text-${scene.id}`}
              placeholder="Enter the script for this scene..."
              value={scene.text}
              onChange={(e) => updateScene(scene.id, 'text', e.target.value)}
              className="bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-indigo-500 min-h-[120px]"
              rows={5}
            />
          </div>
          <div>
            <label htmlFor={`search-${scene.id}`} className="block text-sm font-medium text-zinc-400 mb-2">
              Background Video Keywords
            </label>
            <Input
              id={`search-${scene.id}`}
              placeholder="e.g., nature, city, technology"
              value={scene.searchTerms}
              onChange={(e) => updateScene(scene.id, 'searchTerms', e.target.value)}
              className="bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-indigo-500"
            />
            <p className="text-xs text-zinc-500 mt-2">
              Separate keywords with commas. The AI will find the best matching videos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { PlusCircle } from 'lucide-react';
import { useCreatorStore } from '@/hooks/useCreatorStore';
import { SceneCard } from '@/components/creator/SceneCard';
import { ConfigPanel } from '@/components/creator/ConfigPanel';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
export function CreatorPage() {
  const { scenes, addScene, reorderScenes } = useCreatorStore();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = scenes.findIndex((s) => s.id === active.id);
      const newIndex = scenes.findIndex((s) => s.id === over.id);
      reorderScenes(arrayMove(scenes, oldIndex, newIndex));
    }
  }
  return (
    <>
      <main className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 -z-10 h-full w-full bg-zinc-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={scenes} strategy={verticalListSortingStrategy}>
                {scenes.map((scene, index) => (
                  <SceneCard key={scene.id} scene={scene} index={index} sceneCount={scenes.length} />
                ))}
              </SortableContext>
            </DndContext>
            <div className="flex justify-center">
              <Button variant="outline" className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white" onClick={addScene}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Scene
              </Button>
            </div>
          </div>
          <div className="lg:col-span-1">
            <ConfigPanel />
          </div>
        </div>
      </main>
      <Toaster theme="dark" richColors />
    </>
  );
}
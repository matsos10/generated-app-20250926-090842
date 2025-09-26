import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { Scene, RenderConfig, VoiceEnum, MusicMoodEnum, OrientationEnum, CaptionPositionEnum, MusicVolumeEnum } from '@/lib/types';
type CreatorState = {
  scenes: Scene[];
  config: RenderConfig;
  isGenerating: boolean;
};
type CreatorActions = {
  addScene: () => void;
  removeScene: (id: string) => void;
  updateScene: (id:string, field: keyof Omit<Scene, 'id'>, value: string) => void;
  reorderScenes: (scenes: Scene[]) => void;
  updateConfig: <K extends keyof RenderConfig>(field: K, value: RenderConfig[K]) => void;
  reset: () => void;
  setIsGenerating: (isGenerating: boolean) => void;
};
const initialState: CreatorState = {
  scenes: [{ id: uuidv4(), text: '', searchTerms: '' }],
  config: {
    paddingBack: 1500,
    voice: VoiceEnum.af_heart,
    music: MusicMoodEnum.chill,
    orientation: OrientationEnum.portrait,
    captionPosition: CaptionPositionEnum.bottom,
    captionBackgroundColor: '#4f46e5', // indigo-600
    musicVolume: MusicVolumeEnum.high,
  },
  isGenerating: false,
};
export const useCreatorStore = create<CreatorState & CreatorActions>()(
  immer((set) => ({
    ...initialState,
    addScene: () =>
      set((state) => {
        state.scenes.push({ id: uuidv4(), text: '', searchTerms: '' });
      }),
    removeScene: (id) =>
      set((state) => {
        state.scenes = state.scenes.filter((scene) => scene.id !== id);
      }),
    updateScene: (id, field, value) =>
      set((state) => {
        const scene = state.scenes.find((s) => s.id === id);
        if (scene) {
          scene[field] = value;
        }
      }),
    reorderScenes: (scenes) =>
      set((state) => {
        state.scenes = scenes;
      }),
    updateConfig: (field, value) =>
      set((state) => {
        state.config[field] = value;
      }),
    reset: () => set(initialState),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
  })),
);
import React, { useEffect, useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCreatorStore } from '@/hooks/useCreatorStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getVoices, getMusicTags, createShortVideo } from '@/lib/api';
import { VoiceEnum, MusicMoodEnum, OrientationEnum, CaptionPositionEnum, MusicVolumeEnum, CreateVideoPayload } from '@/lib/types';
import { toast } from '@/components/ui/sonner';
export function ConfigPanel() {
  const navigate = useNavigate();
  const config = useCreatorStore((state) => state.config);
  const scenes = useCreatorStore((state) => state.scenes);
  const updateConfig = useCreatorStore((state) => state.updateConfig);
  const isGenerating = useCreatorStore((state) => state.isGenerating);
  const setIsGenerating = useCreatorStore((state) => state.setIsGenerating);
  const [voices, setVoices] = useState<VoiceEnum[]>([]);
  const [musicTags, setMusicTags] = useState<MusicMoodEnum[]>([]);
  useEffect(() => {
    const fetchOptions = async () => {
      const [fetchedVoices, fetchedMusicTags] = await Promise.all([
        getVoices(),
        getMusicTags(),
      ]);
      setVoices(fetchedVoices);
      setMusicTags(fetchedMusicTags);
    };
    fetchOptions();
  }, []);
  const handleGenerate = async () => {
    if (scenes.some(s => !s.text.trim() || !s.searchTerms.trim())) {
      toast.error("All scenes must have a script and keywords.", {
        description: "Please fill out all fields before generating the video.",
      });
      return;
    }
    setIsGenerating(true);
    toast.info("Starting video generation...", {
      description: "This might take a few moments. Please wait.",
    });
    try {
      const payload: CreateVideoPayload = {
        scenes: scenes.map(s => ({
          text: s.text,
          searchTerms: s.searchTerms.split(',').map(term => term.trim()).filter(Boolean),
        })),
        config: {
          ...config,
          paddingBack: Number(config.paddingBack),
        },
      };
      const response = await createShortVideo(payload);
      toast.success("Video is processing!", {
        description: `You are being redirected to the video page. ID: ${response.videoId}`,
      });
      navigate(`/video/${response.videoId}`);
    } catch (error) {
      console.error("Failed to generate video:", error);
      toast.error("Video generation failed.", {
        description: "Something went wrong on our end. Please try again later.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white sticky top-24">
      <CardHeader>
        <CardTitle>Video Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="voice">Voice</Label>
          <Select value={config.voice} onValueChange={(value) => updateConfig('voice', value as VoiceEnum)}>
            <SelectTrigger id="voice" className="bg-zinc-950 border-zinc-700">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
              {voices.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="music">Music Mood</Label>
          <Select value={config.music} onValueChange={(value) => updateConfig('music', value as MusicMoodEnum)}>
            <SelectTrigger id="music" className="bg-zinc-950 border-zinc-700">
              <SelectValue placeholder="Select a mood" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
              {musicTags.map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="orientation">Orientation</Label>
          <Select value={config.orientation} onValueChange={(value) => updateConfig('orientation', value as OrientationEnum)}>
            <SelectTrigger id="orientation" className="bg-zinc-950 border-zinc-700">
              <SelectValue placeholder="Select orientation" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
              {Object.values(OrientationEnum).map(o => <SelectItem key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="caption-pos">Caption Position</Label>
          <Select value={config.captionPosition} onValueChange={(value) => updateConfig('captionPosition', value as CaptionPositionEnum)}>
            <SelectTrigger id="caption-pos" className="bg-zinc-950 border-zinc-700">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
              {Object.values(CaptionPositionEnum).map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="music-volume">Music Volume</Label>
          <Select value={config.musicVolume} onValueChange={(value) => updateConfig('musicVolume', value as MusicVolumeEnum)}>
            <SelectTrigger id="music-volume" className="bg-zinc-950 border-zinc-700">
              <SelectValue placeholder="Select volume" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
              {Object.values(MusicVolumeEnum).map(v => <SelectItem key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="padding-back">End Padding (ms)</Label>
          <Input
            id="padding-back"
            type="number"
            value={config.paddingBack}
            onChange={(e) => updateConfig('paddingBack', parseInt(e.target.value, 10) || 0)}
            className="bg-zinc-950 border-zinc-700"
          />
        </div>
        <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate Video
        </Button>
      </CardContent>
    </Card>
  );
}
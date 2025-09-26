import axios from 'axios';
import { CreateVideoPayload, VideoCreationResponse, VoiceEnum, MusicMoodEnum, VideoItem, VideoStatus } from './types';
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
export const createShortVideo = async (payload: CreateVideoPayload): Promise<VideoCreationResponse> => {
  const response = await api.post('/short-video', payload);
  return response.data;
};
export const getVoices = async (): Promise<VoiceEnum[]> => {
  try {
    const response = await api.get('/voices');
    return response.data;
  } catch (error) {
    console.error('Error fetching voices:', error);
    return Object.values(VoiceEnum);
  }
};
export const getMusicTags = async (): Promise<MusicMoodEnum[]> => {
  try {
    const response = await api.get('/music-tags');
    return response.data;
  } catch (error) {
    console.error('Error fetching music tags:', error);
    return Object.values(MusicMoodEnum);
  }
};
export const getVideos = async (): Promise<VideoItem[]> => {
  const response = await api.get('/short-videos');
  return response.data.videos || [];
};
export const getVideoStatus = async (videoId: string): Promise<VideoStatus> => {
  const response = await api.get(`/short-video/${videoId}/status`);
  return response.data.status;
};
export const deleteVideo = async (videoId: string): Promise<void> => {
  await api.delete(`/short-video/${videoId}`);
};
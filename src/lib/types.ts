export enum MusicMoodEnum {
  sad = "sad",
  melancholic = "melancholic",
  happy = "happy",
  euphoric = "euphoric/high",
  excited = "excited",
  chill = "chill",
  uneasy = "uneasy",
  angry = "angry",
  dark = "dark",
  hopeful = "hopeful",
  contemplative = "contemplative",
  funny = "funny/quirky",
}
export enum CaptionPositionEnum {
  top = "top",
  center = "center",
  bottom = "bottom",
}
export enum VoiceEnum {
  af_heart = "af_heart",
  af_alloy = "af_alloy",
  af_aoede = "af_aoede",
  af_bella = "af_bella",
  af_jessica = "af_jessica",
  af_kore = "af_kore",
  af_nicole = "af_nicole",
  af_nova = "af_nova",
  af_river = "af_river",
  af_sarah = "af_sarah",
  af_sky = "af_sky",
  am_adam = "am_adam",
  am_echo = "am_echo",
  am_eric = "am_eric",
  am_fenrir = "am_fenrir",
  am_liam = "am_liam",
  am_michael = "am_michael",
  am_onyx = "am_onyx",
  am_puck = "am_puck",
  am_santa = "am_santa",
  bf_emma = "bf_emma",
  bf_isabella = "bf_isabella",
  bm_george = "bm_george",
  bm_lewis = "bm_lewis",
  bf_alice = "bf_alice",
  bf_lily = "bf_lily",
  bm_daniel = "bm_daniel",
  bm_fable = "bm_fable",
}
export enum OrientationEnum {
  portrait = "portrait",
  landscape = "landscape",
}
export enum MusicVolumeEnum {
  muted = "muted",
  low = "low",
  medium = "medium",
  high = "high",
}
export interface Scene {
  id: string;
  text: string;
  searchTerms: string;
}
export interface RenderConfig {
  paddingBack: number;
  music?: MusicMoodEnum;
  captionPosition?: CaptionPositionEnum;
  captionBackgroundColor?: string;
  voice?: VoiceEnum;
  orientation?: OrientationEnum;
  musicVolume?: MusicVolumeEnum;
}
export interface CreateVideoPayload {
  scenes: {
    text: string;
    searchTerms: string[];
  }[];
  config: RenderConfig;
}
export interface VideoCreationResponse {
  videoId: string;
}
export type VideoStatus = 'processing' | 'ready' | 'failed';
export interface VideoItem {
  id: string;
  status: VideoStatus;
}
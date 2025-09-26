import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo, VideoInfo, VideoStatus } from './types';
import type { Env } from './core-utils';
const VIDEO_PROCESSING_TIME_MS = 30 * 1000; // 30 seconds
// 🤖 AI Extension Point: Add session management features
export class AppController extends DurableObject<Env> {
  private sessions = new Map<string, SessionInfo>();
  private videos = new Map<string, VideoInfo>();
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const stored = await this.ctx.storage.get<Record<string, SessionInfo>>('sessions') || {};
      this.sessions = new Map(Object.entries(stored));
      const storedVideos = await this.ctx.storage.get<Record<string, VideoInfo>>('videos') || {};
      this.videos = new Map(Object.entries(storedVideos));
      this.loaded = true;
    }
  }
  private async persist(): Promise<void> {
    await this.ctx.storage.put('sessions', Object.fromEntries(this.sessions));
    await this.ctx.storage.put('videos', Object.fromEntries(this.videos));
  }
  async alarm() {
    await this.ensureLoaded();
    const now = Date.now();
    let changed = false;
    let nextAlarmTime: number | null = null;

    for (const video of this.videos.values()) {
      if (video.status === 'processing') {
        const finishedTime = video.createdAt + VIDEO_PROCESSING_TIME_MS;
        if (now >= finishedTime) {
          video.status = 'ready';
          changed = true;
        } else {
          // This video is still processing, check if it's the next one to finish.
          if (nextAlarmTime === null || finishedTime < nextAlarmTime) {
            nextAlarmTime = finishedTime;
          }
        }
      }
    }

    if (changed) {
      await this.persist();
    }

    // If there are still videos processing, set the next alarm.
    if (nextAlarmTime !== null) {
      await this.ctx.storage.setAlarm(nextAlarmTime);
    }
  }
  // Session Management
  async addSession(sessionId: string, title?: string): Promise<void> {
    await this.ensureLoaded();
    const now = Date.now();
    this.sessions.set(sessionId, {
      id: sessionId,
      title: title || `Chat ${new Date(now).toLocaleDateString()}`,
      createdAt: now,
      lastActive: now
    });
    await this.persist();
  }
  async removeSession(sessionId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.sessions.delete(sessionId);
    if (deleted) await this.persist();
    return deleted;
  }
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActive = Date.now();
      await this.persist();
    }
  }
  async updateSessionTitle(sessionId: string, title: string): Promise<boolean> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.title = title;
      await this.persist();
      return true;
    }
    return false;
  }
  async listSessions(): Promise<SessionInfo[]> {
    await this.ensureLoaded();
    return Array.from(this.sessions.values()).sort((a, b) => b.lastActive - a.lastActive);
  }
  async getSessionCount(): Promise<number> {
    await this.ensureLoaded();
    return this.sessions.size;
  }
  async getSession(sessionId: string): Promise<SessionInfo | null> {
    await this.ensureLoaded();
    return this.sessions.get(sessionId) || null;
  }
  async clearAllSessions(): Promise<number> {
    await this.ensureLoaded();
    const count = this.sessions.size;
    this.sessions.clear();
    await this.persist();
    return count;
  }
  // Video Management
  async addVideo(videoId: string): Promise<VideoInfo> {
    await this.ensureLoaded();
    const now = Date.now();
    const newVideo: VideoInfo = {
      id: videoId,
      status: 'processing',
      createdAt: now,
    };
    this.videos.set(videoId, newVideo);
    // Set an alarm to simulate processing time
    const currentAlarm = await this.ctx.storage.getAlarm();
    if (currentAlarm === null) {
        await this.ctx.storage.setAlarm(Date.now() + VIDEO_PROCESSING_TIME_MS);
    }
    await this.persist();
    return newVideo;
  }
  async listVideos(): Promise<VideoInfo[]> {
    await this.ensureLoaded();
    return Array.from(this.videos.values()).sort((a, b) => b.createdAt - a.createdAt);
  }
  async getVideo(videoId: string): Promise<VideoInfo | null> {
    await this.ensureLoaded();
    return this.videos.get(videoId) || null;
  }
  async deleteVideo(videoId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.videos.delete(videoId);
    if (deleted) {
      await this.persist();
    }
    return deleted;
  }
}
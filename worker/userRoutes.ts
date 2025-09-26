import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";
// Data from the original project to mock the API responses
const VoiceEnum = {
  af_heart: "af_heart", af_alloy: "af_alloy", af_aoede: "af_aoede", af_bella: "af_bella",
  af_jessica: "af_jessica", af_kore: "af_kore", af_nicole: "af_nicole", af_nova: "af_nova",
  af_river: "af_river", af_sarah: "af_sarah", af_sky: "af_sky", am_adam: "am_adam",
  am_echo: "am_echo", am_eric: "am_eric", am_fenrir: "am_fenrir", am_liam: "am_liam",
  am_michael: "am_michael", am_onyx: "am_onyx", am_puck: "am_puck", am_santa: "am_santa",
  bf_emma: "bf_emma", bf_isabella: "bf_isabella", bm_george: "bm_george", bm_lewis: "bm_lewis",
  bf_alice: "bf_alice", bf_lily: "bf_lily", bm_daniel: "bm_daniel", bm_fable: "bm_fable",
};
const MusicMoodEnum = {
  sad: "sad", melancholic: "melancholic", happy: "happy", "euphoric/high": "euphoric/high",
  excited: "excited", chill: "chill", uneasy: "uneasy", angry: "angry", dark: "dark",
  hopeful: "hopeful", contemplative: "contemplative", "funny/quirky": "funny/quirky",
};
/**
 * DO NOT MODIFY THIS FUNCTION. Only for your reference.
 */
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    // Use this API for conversations. **DO NOT MODIFY**
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId); // Get existing agent or create a new one if it doesn't exist, with sessionId as the name
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
        return agent.fetch(new Request(url.toString(), {
            method: c.req.method,
            headers: c.req.header(),
            body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
        }));
        } catch (error) {
        console.error('Agent routing error:', error);
        return c.json({
            success: false,
            error: API_RESPONSES.AGENT_ROUTING_FAILED
        }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Static options for video creation UI
    app.get('/api/voices', (c) => {
        return c.json(Object.values(VoiceEnum));
    });
    app.get('/api/music-tags', (c) => {
        return c.json(Object.values(MusicMoodEnum));
    });
    // Stateful video creation endpoints using Durable Objects
    app.post('/api/short-video', async (c) => {
        const controller = getAppController(c.env);
        const videoId = `vid_${crypto.randomUUID()}`;
        await controller.addVideo(videoId);
        return c.json({ videoId });
    });
    app.get('/api/short-videos', async (c) => {
        const controller = getAppController(c.env);
        const videos = await controller.listVideos();
        return c.json({ videos: videos.map(({ id, status }) => ({ id, status })) });
    });
    app.get('/api/short-video/:videoId/status', async (c) => {
        const { videoId } = c.req.param();
        const controller = getAppController(c.env);
        const video = await controller.getVideo(videoId);
        if (!video) {
            return c.json({ status: 'failed', error: 'Video not found' }, 404);
        }
        return c.json({ status: video.status });
    });
    app.delete('/api/short-video/:videoId', async (c) => {
        const { videoId } = c.req.param();
        const controller = getAppController(c.env);
        const deleted = await controller.deleteVideo(videoId);
        if (!deleted) {
            return c.json({ success: false, error: 'Video not found' }, 404);
        }
        return c.json({ success: true });
    });
    // This endpoint is for the frontend to display a placeholder.
    // In a real app, it would serve the actual video file.
    app.get('/api/short-video/:videoId', async (c) => {
        const { videoId } = c.req.param();
        const controller = getAppController(c.env);
        const video = await controller.getVideo(videoId);

        if (!video) {
            return c.json({ status: 'failed', error: 'Video not found' }, 404);
        }

        if (video.status !== 'ready') {
            return c.json({ status: video.status, error: 'Video is not ready' }, 202);
        }

        // In a real app, this would stream the video file from storage.
        // For this mock, we'll fetch a sample video and stream it back.
        const sampleVideoUrl = 'https://github.com/user-attachments/assets/1b488e7d-1b40-439d-8767-6ab51dbc0922';
        const videoResponse = await fetch(sampleVideoUrl);

        if (!videoResponse.ok || !videoResponse.body) {
            return c.json({ status: 'failed', error: 'Could not retrieve video file' }, 500);
        }

        c.header('Content-Type', 'video/mp4');
        c.header('Content-Disposition', `inline; filename=${videoId}.mp4`);
        return c.body(videoResponse.body, 200);
    });
    // Session Management Routes
    app.get('/api/sessions', async (c) => {
        try {
            const controller = getAppController(c.env);
            const sessions = await controller.listSessions();
            return c.json({ success: true, data: sessions });
        } catch (error) {
            console.error('Failed to list sessions:', error);
            return c.json({
                success: false,
                error: 'Failed to retrieve sessions'
            }, { status: 500 });
        }
    });
    app.post('/api/sessions', async (c) => {
        try {
            const body = await c.req.json().catch(() => ({}));
            const { title, sessionId: providedSessionId, firstMessage } = body;
            const sessionId = providedSessionId || crypto.randomUUID();
            let sessionTitle = title;
            if (!sessionTitle) {
                const now = new Date();
                const dateTime = now.toLocaleString([], {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                if (firstMessage && firstMessage.trim()) {
                    const cleanMessage = firstMessage.trim().replace(/\s+/g, ' ');
                    const truncated = cleanMessage.length > 40
                        ? cleanMessage.slice(0, 37) + '...'
                        : cleanMessage;
                    sessionTitle = `${truncated} • ${dateTime}`;
                } else {
                    sessionTitle = `Chat ${dateTime}`;
                }
            }
            await registerSession(c.env, sessionId, sessionTitle);
            return c.json({
                success: true,
                data: { sessionId, title: sessionTitle }
            });
        } catch (error) {
            console.error('Failed to create session:', error);
            return c.json({
                success: false,
                error: 'Failed to create session'
            }, { status: 500 });
        }
    });
    app.delete('/api/sessions/:sessionId', async (c) => {
        try {
            const sessionId = c.req.param('sessionId');
            const deleted = await unregisterSession(c.env, sessionId);
            if (!deleted) {
                return c.json({
                    success: false,
                    error: 'Session not found'
                }, { status: 404 });
            }
            return c.json({ success: true, data: { deleted: true } });
        } catch (error) {
            console.error('Failed to delete session:', error);
            return c.json({
                success: false,
                error: 'Failed to delete session'
            }, { status: 500 });
        }
    });
    app.put('/api/sessions/:sessionId/title', async (c) => {
        try {
            const sessionId = c.req.param('sessionId');
            const { title } = await c.req.json();
            if (!title || typeof title !== 'string') {
                return c.json({
                    success: false,
                    error: 'Title is required'
                }, { status: 400 });
            }
            const controller = getAppController(c.env);
            const updated = await controller.updateSessionTitle(sessionId, title);
            if (!updated) {
                return c.json({
                    success: false,
                    error: 'Session not found'
                }, { status: 404 });
            }
            return c.json({ success: true, data: { title } });
        } catch (error) {
            console.error('Failed to update session title:', error);
            return c.json({
                success: false,
                error: 'Failed to update session title'
            }, { status: 500 });
        }
    });
    app.get('/api/sessions/stats', async (c) => {
        try {
            const controller = getAppController(c.env);
            const count = await controller.getSessionCount();
            return c.json({
                success: true,
                data: { totalSessions: count }
            });
        } catch (error) {
            console.error('Failed to get session stats:', error);
            return c.json({
                success: false,
                error: 'Failed to retrieve session stats'
            }, { status: 500 });
        }
    });
    app.delete('/api/sessions', async (c) => {
        try {
            const controller = getAppController(c.env);
            const deletedCount = await controller.clearAllSessions();
            return c.json({
                success: true,
                data: { deletedCount }
            });
        } catch (error) {
            console.error('Failed to clear all sessions:', error);
            return c.json({
                success: false,
                error: 'Failed to clear all sessions'
            }, { status: 500 });
        }
    });
}
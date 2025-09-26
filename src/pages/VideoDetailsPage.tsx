import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Loader2, AlertTriangle } from 'lucide-react';
import { getVideoStatus } from '@/lib/api';
import { VideoStatus } from '@/lib/types';
import { VideoPlayer } from '@/components/videos/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
const processingSteps = [
  "Warming up the AI...",
  "Generating voiceover...",
  "Sourcing background clips...",
  "Composing scenes...",
  "Adding captions & music...",
  "Final rendering...",
];
export function VideoDetailsPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const [status, setStatus] = useState<VideoStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const stepIntervalRef = useRef<number | null>(null);
  useEffect(() => {
    if (!videoId) return;
    const checkStatus = async () => {
      try {
        const newStatus = await getVideoStatus(videoId);
        setStatus(newStatus);
        if (newStatus === 'ready' || newStatus === 'failed') {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
          intervalRef.current = null;
          stepIntervalRef.current = null;
        }
      } catch (err) {
        console.error('Failed to fetch video status:', err);
        setError('Could not retrieve video status. It might have been deleted or an error occurred.');
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      }
    };
    checkStatus(); // Initial check
    intervalRef.current = window.setInterval(checkStatus, 5000);
    // Simulate processing steps
    stepIntervalRef.current = window.setInterval(() => {
      setCurrentStep(prev => (prev + 1) % processingSteps.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    };
  }, [videoId]);
  const renderContent = () => {
    if (error) {
      return (
        <Alert variant="destructive" className="bg-red-950/50 border-red-500/30 text-red-400">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    if (status === null || status === 'processing') {
      return (
        <Card className="bg-zinc-900 border-zinc-800 text-white text-center py-20">
          <CardContent>
            <Loader2 className="h-12 w-12 text-indigo-400 animate-spin mx-auto" />
            <h3 className="mt-4 text-xl font-semibold">Video is Processing</h3>
            <p className="mt-2 text-zinc-400 h-6 transition-all duration-300">
              {processingSteps[currentStep]}
            </p>
            <p className="text-sm text-zinc-500 mt-1">We'll automatically update this page when it's ready.</p>
          </CardContent>
        </Card>
      );
    }
    if (status === 'failed') {
      return (
        <Alert variant="destructive" className="bg-red-950/50 border-red-500/30 text-red-400">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Processing Failed</AlertTitle>
          <AlertDescription>
            Something went wrong while generating your video. Please try creating it again.
          </AlertDescription>
        </Alert>
      );
    }
    if (status === 'ready' && videoId) {
      return (
        <div className="space-y-6">
          <VideoPlayer videoId={videoId} />
          <div className="text-center">
            <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <a href={`/api/short-video/${videoId}`} download={`clipcraft-video-${videoId}.mp4`}>
                <Download className="mr-2 h-4 w-4" />
                Download Video
              </a>
            </Button>
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <main className="container max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Button asChild variant="outline" className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white">
          <Link to="/videos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Videos
          </Link>
        </Button>
      </div>
      <div className="space-y-2 mb-6">
        <h1 className="text-4xl font-display font-bold text-white">Your Video</h1>
        <p className="text-lg text-zinc-400 font-mono break-all">{videoId}</p>
      </div>
      {renderContent()}
    </main>
  );
}
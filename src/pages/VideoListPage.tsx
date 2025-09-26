import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Plus, AlertCircle } from 'lucide-react';
import { getVideos, deleteVideo } from '@/lib/api';
import { VideoItem } from '@/lib/types';
import { VideoCard } from '@/components/videos/VideoCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Toaster, toast } from '@/components/ui/sonner';
export function VideoListPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchVideos = async () => {
    try {
      setError(null);
      const fetchedVideos = await getVideos();
      setVideos(fetchedVideos.sort((a, b) => a.id.localeCompare(b.id) * -1)); // Sort newest first
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setError('Could not load your videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVideos();
  }, []);
  const handleDelete = async (id: string) => {
    try {
      await deleteVideo(id);
      setVideos((prevVideos) => prevVideos.filter((v) => v.id !== id));
      toast.success('Video deleted successfully.');
    } catch (err) {
      console.error('Failed to delete video:', err);
      toast.error('Failed to delete video. Please try again.');
    }
  };
  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <Alert variant="destructive" className="bg-red-950/50 border-red-500/30 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    if (videos.length === 0) {
      return (
        <div className="text-center py-16 border-2 border-dashed border-zinc-800 rounded-lg">
          <Film className="mx-auto h-12 w-12 text-zinc-500" />
          <h3 className="mt-4 text-lg font-medium text-white">No videos yet</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Get started by creating your first video.
          </p>
          <div className="mt-6">
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link to="/create">
                <Plus className="mr-2 h-4 w-4" /> Create Video
              </Link>
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onDelete={handleDelete} />
        ))}
      </div>
    );
  };
  return (
    <>
      <main className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-bold text-white">My Videos</h1>
            <p className="text-lg text-zinc-400">
              Manage and view all your generated video clips.
            </p>
          </div>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
            <Link to="/create">
              <Plus className="mr-2 h-4 w-4" /> Create New Video
            </Link>
          </Button>
        </div>
        {renderContent()}
      </main>
      <Toaster theme="dark" richColors />
    </>
  );
}
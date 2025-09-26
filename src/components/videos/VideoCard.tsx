import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { PlayCircle, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { VideoItem, VideoStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
interface VideoCardProps {
  video: VideoItem;
  onDelete: (id: string) => void;
}
const statusStyles: Record<VideoStatus, string> = {
  ready: 'bg-green-500/20 text-green-400 border-green-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
};
const statusIcons: Record<VideoStatus, React.ReactNode> = {
  ready: <PlayCircle className="h-4 w-4" />,
  processing: <Loader2 className="h-4 w-4 animate-spin" />,
  failed: <AlertTriangle className="h-4 w-4" />,
};
export function VideoCard({ video, onDelete }: VideoCardProps) {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(video.id);
  };
  return (
    <Link to={`/video/${video.id}`} className="block group">
      <Card className="bg-zinc-900 border-zinc-800 hover:border-indigo-500/50 transition-all duration-200 overflow-hidden h-full flex flex-col">
      <CardHeader className="p-4">
        <AspectRatio ratio={16 / 9} className="bg-zinc-950 rounded-md overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            {/* Use a static placeholder image for the thumbnail */}
            <img src="https://images.pexels.com/videos/853878/free-video-853878.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="Video thumbnail" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
              <PlayCircle className="h-12 w-12 text-white/50 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
            </div>
          </div>
          </AspectRatio>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <p className="text-sm font-mono text-zinc-400 break-all">{video.id}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <Badge className={cn('flex items-center gap-1.5', statusStyles[video.status])}>
            {statusIcons[video.status]}
            <span className="capitalize">{video.status}</span>
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-500 hover:bg-red-900/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete video</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
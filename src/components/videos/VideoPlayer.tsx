import { AspectRatio } from "@/components/ui/aspect-ratio";
// A high-quality placeholder video for demonstration purposes.
const PLACEHOLDER_VIDEO_URL = "https://videos.pexels.com/video-files/853878/853878-hd_720_1366_25fps.mp4";
export function VideoPlayer({ videoId }: { videoId?: string }) {
  const videoUrl = videoId ? `/api/short-video/${videoId}` : PLACEHOLDER_VIDEO_URL;

  return (
    <AspectRatio ratio={9 / 16} className="bg-zinc-950 rounded-lg overflow-hidden shadow-lg ring-1 ring-zinc-800">
      <video
        key={videoUrl}
        src={videoUrl}
        controls
        autoPlay
        loop
        playsInline
        className="w-full h-full object-contain"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </AspectRatio>
  );
}
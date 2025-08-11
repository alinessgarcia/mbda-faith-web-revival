
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface VideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

const VideoDialog = ({ isOpen, onClose, videoUrl }: VideoDialogProps) => {
  // Detecta se é vídeo local ou YouTube
  const isLocalVideo = videoUrl.startsWith('/videos/');
  
  // Extract video ID and convert regular URL to embed URL (para YouTube)
  const getEmbedUrl = (url: string) => {
    let videoId = "";

    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get("v") || "";
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1].split("?")[0];
    }

    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80" />
        <DialogContent className="sm:max-w-[800px] p-0 bg-transparent border-none">
          <div className="aspect-video w-full">
            {isLocalVideo ? (
              // Player para vídeo local
              <video
                width="100%"
                height="100%"
                controls
                autoPlay
                className="w-full h-full"
              >
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/webm" />
                Seu navegador não suporta o elemento de vídeo.
              </video>
            ) : (
              // Player para YouTube
              <iframe
                width="100%"
                height="100%"
                src={getEmbedUrl(videoUrl)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
          <DialogClose
            onClick={onClose}
            className="absolute top-2 right-2 rounded-full p-2 bg-white text-black hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default VideoDialog;

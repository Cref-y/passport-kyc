"use client"
import { useState, useEffect } from "react"
import { Play, Pause, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Animation for the pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlaying && !isHovered) {
        const pulse = document.getElementById("play-pulse")
        if (pulse) {
          pulse.classList.remove("animate-pulse")
          // Trigger reflow
          void pulse.offsetWidth
          pulse.classList.add("animate-pulse")
        }
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [isPlaying, isHovered])

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-8 mb-12">
      {/* Background effects */}
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-purple-300 rounded-full opacity-40 blur-2xl"></div>
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-400 rounded-full opacity-40 blur-2xl"></div>
      
      {/* Video container with 3D effect */}
      <div 
        className={`relative rounded-2xl overflow-hidden border-4 border-purple-100 shadow-2xl 
          transition-all duration-500 transform ${isExpanded ? 'scale-105 z-50' : 'scale-100'}
          ${isHovered && !isPlaying ? 'shadow-purple-300/50' : ''}`}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)'
        }}
      >
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjOTMzM0VBIiBzdHJva2Utb3BhY2l0eT0iLjEiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0yNCA0OGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzkzMzNFQSIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-10 z-10 pointer-events-none"></div>
        
        {/* Video embed */}
        <div 
          className="relative w-full transition-all duration-500" 
          style={{ 
            paddingBottom: "56.25%",
            transform: isHovered && !isPlaying ? 'translateY(-8px)' : 'translateY(0)'
          }}
        >
          <iframe
            src={`https://www.loom.com/embed/3da73164690843379b7c5b57806efbf3?sid=80bbd2e7-a694-4ab4-93db-23ee7a268098${isPlaying ? "&autoplay=1" : ""}`}
            frameBorder="0"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
          
          {/* Play button overlay with animated elements */}
          {!isPlaying && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20 cursor-pointer transition-all duration-300"
              onClick={() => setIsPlaying(true)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Animated circles */}
              <div className="absolute w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/10 rounded-full animate-ping"></div>
                <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-purple-300/20 rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-purple-400/20 rounded-full"></div>
              </div>
              
              {/* Play button with pulse */}
              <div id="play-pulse" className="relative transform transition-all duration-300 hover:scale-110">
                <div className="absolute -inset-10 bg-purple-500/20 rounded-full animate-pulse"></div>
                <div className="absolute -inset-6 bg-purple-500/30 rounded-full"></div>
                <Button
                  size="lg"
                  className="h-20 w-20 rounded-full bg-purple-600 hover:bg-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/30"
                >
                  <Play className="h-10 w-10 ml-1" />
                </Button>
              </div>
              
              {/* Watch demo text */}
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-white text-2xl font-medium drop-shadow-md tracking-wide">
                  Watch Demo
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Video controls */}
        {isPlaying && (
          <div className="absolute bottom-4 right-4 z-20 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 hover:bg-white border-purple-200 text-purple-700"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Maximize2 className="h-4 w-4 mr-1" /> {isExpanded ? "Shrink" : "Expand"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 hover:bg-white border-purple-200 text-purple-700"
              onClick={() => setIsPlaying(false)}
            >
              <Pause className="h-4 w-4 mr-1" /> Pause
            </Button>
          </div>
        )}
        
        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/40 to-transparent p-4 z-10">
          <p className="text-white text-sm font-medium drop-shadow-md text-center">
            See how Crefy Passports revolutionizes identity verification
          </p>
        </div>
      </div>
      
      {/* Video label with animation */}
      <div 
        className="absolute -right-2 -top-2 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-30 transform rotate-3 animate-bounce"
        style={{ animationDuration: '2s', animationIterationCount: 3 }}
      >
        LIVE DEMO
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 -left-2 w-4 h-20 bg-purple-200 rounded-full transform -translate-y-1/2"></div>
      <div className="absolute top-1/2 -right-2 w-4 h-20 bg-purple-200 rounded-full transform -translate-y-1/2"></div>
    </div>
  )
}

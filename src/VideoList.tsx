import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { CheckCircle, Lock, File } from "lucide-react";
import { useVideoProgress } from "./hooks/useVideoProgress";
import { Progress } from "./components/ui/progress";

// Sample video data
const videoData = [
  {
    id: "1",
    url: "https://www.youtube.com/watch?v=TgOgzIqG1p4",
    title: "Introduction",
    duration: "5 MINUTES",
    questions: 0,
  },
  {
    id: "2",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Course Overview",
    duration: "10 MINUTES",
    questions: 1,
  },
  {
    id: "3",
    url: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
    title: "Code Editor Installation (Optional)",
    duration: "7 MINUTES",
    questions: 0,
  },
];

const VideoCoursePlayer = () => {
  const { watchStatus, updateProgress, isLoaded } = useVideoProgress();
  const [activeVideo, setActiveVideo] = useState(videoData[0]);
  const [playing, setPlaying] = useState(true);
  const playerRef = useRef(null);

  const totalVideos = videoData.length;
  const watchedCount = videoData.filter(
    (video) => watchStatus[video.id]?.status === "Watched"
  ).length;
  const courseProgress = Math.round((watchedCount / totalVideos) * 100);

  const handleEnded = () => {
    updateProgress(activeVideo.id, 1);
    const currentIndex = videoData.findIndex((v) => v.id === activeVideo.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < videoData.length) {
      setActiveVideo(videoData[nextIndex]);
      setPlaying(true);
    }
  };

  useEffect(() => {
    setPlaying(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeVideo]);

  if (!isLoaded) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="flex md:flex-row flex-col py-8 items-start justify-between w-[90%] mx-auto gap-8">
      {/* Video Player Section */}
      <div className="w-full md:w-2/3">
        <ReactPlayer
          key={activeVideo.id}
          ref={playerRef}
          url={activeVideo.url}
          playing={playing}
          controls
          width="100%"
          height="400px"
          onProgress={({ played }) => updateProgress(activeVideo.id, played)}
          onEnded={handleEnded}
        />
        <h1 className="text-2xl font-bold mt-4">{activeVideo.title}</h1>
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-1/3 bg-white rounded-xl border p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Topics for This Course</h2>

        {/* Progress Header */}
        <div className="mb-4 w-full">
          <div className="flex justify-between w-full text-xs text-gray-500 mb-1">
            <span className="font-medium text-gray-700">You</span>
            <span className="font-medium">{courseProgress}%</span>
          </div>
          <Progress value={courseProgress} className="h-2 w-full bg-gray-300" />
        </div>

        {/* Week Info */}
        <div className="text-sm mb-3">
          <div className="text-gray-800 font-semibold text-sm">Week 1–4</div>
          <p className="text-xs text-gray-500 mb-3">
            Advanced story telling techniques for writers: Personas, Characters
            & Plots
          </p>

          <div className="space-y-2">
            {videoData.map((video) => {
              const isWatched = watchStatus[video.id]?.status === "Watched";

              return (
                <div
                  key={video.id}
                  onClick={() => {
                    setActiveVideo(video);
                    setPlaying(true);
                  }}
                  className={`flex items-start justify-between gap-2 rounded-md px-3 py-2 cursor-pointer transition hover:bg-gray-50 ${
                    activeVideo.id === video.id ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="flex gap-2 items-start">
                    <File size={18} className="text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {video.title}
                      </div>
                      <div className="flex gap-2 mt-1 text-xs text-gray-500 items-center flex-wrap">
                        {video.questions > 0 && (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-medium">
                            {video.questions} QUESTION
                          </span>
                        )}
                        <span className="text-red-500 font-medium">
                          {video.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    {isWatched ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <Lock size={18} className="text-gray-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCoursePlayer;

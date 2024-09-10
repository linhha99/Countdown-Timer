import React, { useState, useEffect, useRef } from "react";

const App = () => {
  const TIME_DEFAULT = 30;
  const [time, setTime] = useState(TIME_DEFAULT); // Thời gian ban đầu là 30 giây
  const [isRunning, setIsRunning] = useState(false);
  const [hasExtended, setHasExtended] = useState(false); // Thêm state để theo dõi việc đã sử dụng Extension
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (time === 0) {
      setIsRunning(false);
      setTime(TIME_DEFAULT); // Reset thời gian về 30 giây
      clearInterval(timerRef.current);
      setHasExtended(false);
    }
  }, [time]);

  useEffect(() => {
    if (time === 10) {
      if (audioRef.current) {
        audioRef.current
          .play()
          .catch((error) => console.error("Failed to play audio:", error));
      }
    }
  }, [time]);

  // Bắt sự kiện bàn phím
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "1":
          startTimer();
          break;
        case "2":
          stopTimer();
          break;
        case "3":
          pauseTimer();
          break;
        case "4":
          extendTime();
          break;
        default:
          break;
      }
    };

    // Lắng nghe sự kiện khi nhấn phím
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup sự kiện khi component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [isRunning, hasExtended]);

  // Bắt đầu đếm ngược
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }
  };

  // Tạm dừng
  const pauseTimer = () => {
    if (isRunning && timerRef.current) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // Dừng và reset
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRunning(false);
    setTime(TIME_DEFAULT); // Reset thời gian về 30 giây
    setHasExtended(false); // Cho phép dùng lại Extension sau khi stop

    if (audioRef.current) {
      audioRef.current.pause(); // Tạm dừng âm thanh
      audioRef.current.currentTime = 0; // Đặt lại thời gian âm thanh
    }
  };

  // Thêm 30 giây
  const extendTime = () => {
    if (!hasExtended) {
      setTime((prevTime) => prevTime + 30);
      setHasExtended(true); // Đánh dấu đã sử dụng Extension

      if (audioRef.current) {
        audioRef.current.pause(); // Tạm dừng âm thanh
        audioRef.current.currentTime = 0; // Đặt lại thời gian âm thanh
      }
    }
  };

  // Kích hoạt chế độ toàn màn hình
  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message}`
          );
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div
      className="bg-dark-subtle d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div
        ref={containerRef}
        className="text-center container box-shadow bg-white rounded"
      >
        <h1 className="mb-4 fs-1">Countdown Timer</h1>

        <div
          className="time-box"
          style={{ color: time <= 10 ? "red" : "white" }}
        >
          {time}s
        </div>

        <div>
          <button
            type="button"
            class="btn btn-primary "
            onClick={startTimer}
            disabled={isRunning}
          >
            Start
          </button>

          <button type="button" className="btn btn-danger " onClick={stopTimer}>
            Stop
          </button>
          <button
            type="button"
            className="btn btn-warning "
            onClick={pauseTimer}
            disabled={!isRunning}
          >
            Pause
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={extendTime}
            disabled={hasExtended}
          >
            Extension +30s
          </button>
        </div>
        <button onClick={toggleFullScreen} className="mt-5">
          Full Screen
        </button>
      </div>

      <audio ref={audioRef} src="/assets/10sec.mp3" />
    </div>
  );
};

export default App;

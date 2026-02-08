import { useRef, useState } from "react";
import {
  useLocation,
  useNavigationType,
  Routes,
  Route,
} from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { HomePage } from "@/components/HomePage";
import { CreatePage } from "@/pages/CreatePage";
import { HistoryDetailPage } from "@/pages/HistoryDetailPage";

export function AnimatedRoutes() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setDirection(navigationType === "POP" ? -1 : 1);
  }

  return (
    <AnimatePresence
      mode="wait"
      custom={direction}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.div
        ref={containerRef}
        key={location.pathname}
        custom={direction}
        style={{ minHeight: "100dvh" }}
        variants={{
          enter: (d: number) => ({
            x: d === 0 ? 0 : `${d * 30}%`,
            opacity: d === 0 ? 1 : 0,
          }),
          center: {
            x: 0,
            opacity: 1,
          },
          exit: (d: number) => ({
            x: `${d * -30}%`,
            opacity: 0,
          }),
        }}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          type: "tween",
          ease: [0.25, 0.1, 0.25, 1],
          duration: 0.25,
        }}
        onAnimationComplete={() => {
          // Remove transform so position:fixed works correctly in resting state
          if (containerRef.current) {
            containerRef.current.style.transform = "none";
          }
        }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/history/:id" element={<HistoryDetailPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

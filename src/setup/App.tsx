import { lazyWithPreload } from "react-lazy-with-preload";
import { Route, Routes } from "react-router-dom";

import VideoTesterView from "@/pages/developer/VideoTesterView";
import { NotFoundPage } from "@/pages/errors/NotFoundPage";
import { Layout } from "@/setup/Layout";

const PlayerView = lazyWithPreload(() => import("@/pages/PlayerView"));

PlayerView.preload();

function App() {
  return (
    <Layout>
      <Routes>
        {/* pages */}
        <Route path="/embed/:media/:id" element={<PlayerView />} />
        <Route
          path="/embed/:media/:/id/:season/:episode"
          element={<PlayerView />}
        />

        {/* other */}
        <Route path="/dev/video" element={<VideoTesterView />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;

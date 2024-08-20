import { Route, Routes } from "react-router-dom";

import VideoTesterView from "@/pages/developer/VideoTesterView";
import { NotFoundPage } from "@/pages/errors/NotFoundPage";
import PlayerView from "@/pages/PlayerView";
import { Layout } from "@/setup/Layout";

function App() {
  return (
    <Layout>
      <Routes>
        {/* pages */}
        <Route path="/embed/:type/:id" element={<PlayerView />} />
        <Route
          path="/embed/:type/:/id/:season/:episode"
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

import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Layout/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Layout/Footer";
import AllWork from "./Pages/AllWork";
import WorkDetail from "./Pages/WorkDetail";

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    // AllWork이고 복원할 스크롤이 있으면 최상단으로 안 보냄
    if (pathname === '/AllWork' && sessionStorage.getItem("scrollY")) return;
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />

        <Route path="/AllWork" element={<AllWork />} />
        <Route path="/work/:id" element={<WorkDetail />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Layout/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Layout/Footer";
import AllWork from "./Pages/AllWork";
import WorkDetail from "./Pages/WorkDetail";

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
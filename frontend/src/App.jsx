import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EmailDetail from "./pages/EmailDetail";
import EmailList from "./pages/EmailList";
function App() {
  return (
    <Routes>
      <Route path="/" element={<EmailList />} />
      <Route path="/email/:id" element={<EmailDetail />} />
    </Routes>
  );
}

export default App;

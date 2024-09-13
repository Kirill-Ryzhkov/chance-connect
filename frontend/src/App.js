import { WholeCafe } from "./components/cafe/WholeCafe";
import { FinalScreen } from "./components/cafe/FinalScreen";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/cafe' />} />
        <Route path='/cafe' element={<WholeCafe />} />
        <Route path='/done' element={<FinalScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
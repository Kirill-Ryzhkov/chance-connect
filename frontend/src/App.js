import { WholeCafe } from "./components/cafe/WholeCafe";
import { FinalScreen } from "./components/cafe/FinalScreen";
import { OrdersTable } from "./components/adminCafe/OrdersTable";
import { OrderStatus } from "./components/statusScreen/OrderStatus";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';  // Provider для Redux
import { store } from './services/redux/store';  // Импорт store

function App() {
  return (
    <Provider store={store}> 
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/cafe' />} /> 
          <Route path='/cafe' element={<WholeCafe />} /> 
          <Route path='/done' element={<FinalScreen />} /> 
          <Route path='/admin-cafe' element={<OrdersTable />} />
          <Route path='/status' element={<OrderStatus />} /> 
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

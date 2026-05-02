import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddTransactions from './pages/addTransactions';
import EditTransaction from './pages/editTransactions';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-transaction" element={<AddTransactions />} />
        <Route path="/edit-transaction/:id" element={<EditTransaction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
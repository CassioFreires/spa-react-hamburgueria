import './App.css';
import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Hamburguers from './pages/Hambugers/Hamburgers';
import Footer from './components/Footer/Footer';
import Promotion from './pages/Promontions/Promotions';
import Combos from './pages/Combos/Combos';
import Drinks from './pages/Drinks/Drinks';
import Dashboard from './pages/Dashboard/Dashboard';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Address from './pages/Address/Address';

function App() {

  return (
    <UserProvider> {/* Envolva a aplicação com o UserProvider */}
      <Router>
        <div className="App flex flex-col min-h-screen">
          <NavBar />
          <div className="container mx-auto p-4 flex-grow">
            <Routes> {/* Barra de navegação, que poderá acessar o estado do usuário */}
              <Route path='/' element={<Home />} />
              <Route path='/hamburgers' element={<Hamburguers />} />
              <Route path='/promocoes' element={<Promotion />} />
              <Route path='/combos' element={<Combos />} />
              <Route path='/bebidas' element={<Drinks />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/order' element={<Checkout />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />

              {/* Rota protegida (somente usuários autenticados e com perfil adequado) */}
              <Route element={<ProtectedRoute requiredRole={['Funcionário', 'Admin']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              {/* Rota protegida (somente usuários autenticados e com perfil adequado) */}
              <Route element={<ProtectedRoute requiredRole={['Funcionário', 'Admin', 'Cliente']} />}>
                <Route path="/address" element={<Address />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  )
}

export default App

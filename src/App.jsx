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

function App() {

  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <NavBar />
        <div className="container mx-auto p-4 flex-grow">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/hamburgers' element={<Hamburguers />} />
            <Route path='/promocoes' element={<Promotion />} />
            <Route path='/combos' element={<Combos />} />
            <Route path='/bebidas' element={<Drinks />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/cart' element={<Cart />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App

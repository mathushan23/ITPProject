
import{BrowserRouter,Routes,Route}from 'react-router-dom'
import Home from './pages/Home';
import Navbar from './components/Navbar';
import ProductForm from './components/ProductForm';
import DirectPurchase from './pages/DirectPurchase';
import SalesReport from './pages/SalesReport'


function App() {
  return (
    <div className="App">
      
    <BrowserRouter>

    <Navbar/>
    <p></p>
      <div className="pages">

        <Routes>

        <Route path="/" element={<DirectPurchase/>}/>


        <Route path="/WorkoutForm" element={<ProductForm/>}/>
        <Route path="/Inventory" element={<Home/>}/>
        <Route path="/DirectPurchase" element={<DirectPurchase/>}/>
        <Route path="/report" element={<SalesReport/>}/>

          
        </Routes>

      </div>
    
    </BrowserRouter>

    </div>
  );
}

export default App;

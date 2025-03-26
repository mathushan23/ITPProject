
import{BrowserRouter,Routes,Route}from 'react-router-dom'
import Home from './pages/Home';
import Navbar from './components/Navbar';
import ProductForm from './components/ProductForm';

function App() {
  return (
    <div className="App">
      
    <BrowserRouter>

    <Navbar/>
    <p></p>
      <div className="pages">

        <Routes>

          <Route
              path="/"
              element={<Home/>}
              />
        <Route path="/WorkoutForm" element={<ProductForm/>}/>
        <Route path="/Home" element={<Home/>}/>

          
        </Routes>

      </div>
    
    </BrowserRouter>

    </div>
  );
}

export default App;

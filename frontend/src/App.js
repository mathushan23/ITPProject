import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import TasksList from "./components/TasksList";
import User from './Product';
import './image.css';


function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
      <Route path="/abc" element={<User/>} />
        
      
       
        <Route path="/" element={<TasksList />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import Footer from './components/Footer'

// This is the correct and single usage of createRoot for each container
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const footer = ReactDOM.createRoot(document.getElementById('footer'));
footer.render(<Footer />);

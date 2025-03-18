import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-wide neon-text">
          Arul Electro Mar
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
        <Link to="/Home" className="navTxt">Home</Link>
          <Link to="/orders" className="navTxt">Orders</Link>
          <Link to="/products" className="navTxt">Products</Link>
          <Link to="/WorkoutForm" className="navTxt">Inventory</Link>
          <Link to="/users" className="navTxt">Users</Link>
          <button className="logoutBtn">Logout</button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

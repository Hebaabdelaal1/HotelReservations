import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IoSearchSharp } from "react-icons/io5";
import { Menu, X, LogOut } from "lucide-react";
import { logout } from "../features/auth/authSlice";
import toast from "react-hot-toast";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);


  useEffect(() => {
    if (location.pathname === "/") {
      localStorage.setItem("searchTerm", search.trim().toLowerCase());
      window.dispatchEvent(new Event("storage"));
    }
  }, [search, location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    

    if (value.trim() && location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate("/");
    toast.success("Logged out successfully!");
  };

  const redirectState = { state: { from: location.pathname } };

  return (
    <nav className="sticky top-0 z-50 bg-[#10103b] text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-blue-400 transition">
          Hotel
        </Link>

        {/* Search Bar - Desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-white rounded-full overflow-hidden w-64"
        >
          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={handleSearchChange}
            className="flex-1 px-4 py-2 text-black outline-none placeholder-gray-500"
          />
          <button type="submit" className="px-3 text-black hover:text-blue-600 transition">
            <IoSearchSharp size={20} />
          </button>
        </form>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-400 transition">Home</Link>

          {isAuthenticated ? (
            <>
              <Link to="/reservations" className="hover:text-blue-400 transition">Reservations</Link>
              <span className="text-blue-300 font-medium">Welcome, {user?.name}!</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 hover:text-red-400 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              {/* <Link to="/login" {...redirectState} className="hover:text-blue-400 transition">Login</Link> */}
              <Link to="/signup" {...redirectState} className="hover:text-blue-400 transition">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#10103b] border-t border-gray-700 flex flex-col items-center gap-4 py-4">
          {/* Search Bar - Mobile */}
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full overflow-hidden w-64">
            <input
              type="text"
              placeholder="Search rooms..."
              value={search}
              onChange={handleSearchChange}
              className="flex-1 px-4 py-2 text-black outline-none placeholder-gray-500"
            />
            <button type="submit" className="px-3 text-black hover:text-blue-600 transition">
              <IoSearchSharp size={20} />
            </button>
          </form>

          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-blue-400 transition">Home</Link>

          {isAuthenticated ? (
            <>
              <Link to="/reservations" onClick={() => setMenuOpen(false)} className="hover:text-blue-400 transition">Reservations</Link>
              <span className="text-blue-300 font-medium">Welcome, {user?.name}!</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 hover:text-red-400 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              {/* <Link to="/login" {...redirectState} onClick={() => setMenuOpen(false)} className="hover:text-blue-400 transition">Login</Link> */}
              <Link to="/signup" {...redirectState} onClick={() => setMenuOpen(false)} className="hover:text-blue-400 transition">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
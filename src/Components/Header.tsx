import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setIsAuthenticated } from "../features/userSlice";
// import LOGO from "../assets/LOGO.jpg"

function Header() {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const authenticated = localStorage.getItem("taxiToken") ? true : false;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleClick = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("taxiToken");
    dispatch(setIsAuthenticated(false));
    navigate("/user");
    window.location.reload();
  };
  return (
    <>
      <div className="ml-10 flex items-center">
        <h1 className="text-xl font-bold text-indigo-700">LOGO</h1>
      </div>
      {/* <div className="flex items-center ">
        <img src={LOGO} alt="Logo" className="h-12 w-auto rounded-md size-13" />
      </div> */}
      <ul className="flex flex-row ml-auto mr-10 gap-10 items-center">
        <Link
          to="/"
          className="text-gray-700 hover:underline hover:text-blue-500 font-medium"
        >
          Home
        </Link>
        <li className="text-gray-700 hover:underline hover:text-blue-500 font-medium cursor-pointer">
          About Us
        </li>
        <li className="text-gray-700 hover:underline hover:text-blue-500 font-medium cursor-pointer">
          Contact us
        </li>
        {authenticated || isAuthenticated ? (
          <button
            className="bg-blue-600 text-white border rounded-xl shadow px-4 py-2 text-base font-semibold hover:bg-blue-700 transition-colors duration-200" 
            onClick={handleClick}
          >
            Logout
          </button>
        ) : (
          <li className="text-gray-700 hover:underline hover:text-blue-500 font-medium cursor-pointer">
            Blog
          </li>
        )}
      </ul>
    </>
  );
}

export default Header;

import { Link } from "react-router";

function Header() {
  return (
    <>
      <div className="ml-10">
        <h1>sign</h1>
      </div>
      <ul className="flex flex-row ml-auto mr-10 gap-10">
        <Link to="/" className="hover:underline hover:text-blue-500">Home</Link>
        <li>About Us</li>
        <li>Blog</li>
        <li>Contact us</li>
      </ul>
    </>
  );
}

export default Header;

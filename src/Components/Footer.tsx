import { FaSquareXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

function Footer() {
  return (
    <>
      <div className="flex mx-auto">
        <ul className="flex gap-24 h-10 justify-between">
          <li>
            <FaSquareXTwitter color="black" size={42} />
          </li>
          <li className="flex">
            <FaYoutube color="red" size={50} className="flex align-middle"/>
          </li>
          <li>
            <FaInstagram color="#d62976" size={42} />
          </li>
        </ul>
      </div>
    </>
  );
}

export default Footer;

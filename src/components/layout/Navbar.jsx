import { Link } from "react-router-dom";

import AdminIcon from "../../assets/icons/circle-user.png";
import logo from "../../assets/images/logo.svg";
import menuIcon from "../../assets/icons/menu-burger.png";

function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 h-14 z-50 px-3">
      <div className="w-full h-full flex items-center justify-between">
        <div>
          <img
            className="w-6 cursor-pointer"
            src={menuIcon}
            alt="Menu Burger"
          />
        </div>
        <Link to="/">
          <img className="w-24 cursor-pointer" src={logo} alt="Logo" />
        </Link>
        <Link to="/">
          <img
            className="w-6 cursor-pointer"
            src={AdminIcon}
            alt="Profile Icon"
          />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

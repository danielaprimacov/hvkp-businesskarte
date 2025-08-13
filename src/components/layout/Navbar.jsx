import AdminIcon from "../../assets/icons/circle-user.png";
import logo from "../../assets/images/logo.svg";
import menuIcon from "../../assets/icons/menu-burger.png";

function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 h-14 z-50 px-3">
      <div className="w-full h-full flex items-center justify-between">
        <div>
          <img className="w-6" src={menuIcon} alt="Menu Burger" />
        </div>
        <div>
          <img className="w-24" src={logo} alt="Logo" />
        </div>
        <div>
          <img className="w-6" src={AdminIcon} alt="Profile Icon" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

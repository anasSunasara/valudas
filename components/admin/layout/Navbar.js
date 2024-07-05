import React, { useState, useEffect } from "react";
import Link from "next/link";
import 'boxicons/css/boxicons.min.css';
import Image from "next/image";


const Navbar = ({ toggleSidebar, toggleDarkMode }) => {
  const [isSearchFormVisible, setSearchFormVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  const toggleSearchForm = (e) => {
    e.preventDefault();
    setSearchFormVisible(!isSearchFormVisible);
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSidebarToggle = () => {
    toggleSidebar(); // Close the sidebar
  };

  return (
    <section id="content">
    <nav className="nave">
      <i className="bx bx-menu" onClick={handleSidebarToggle}></i>
      <form>
        <div className="form-input">
          <input type="search" placeholder="Search..." />
          <button
            type="submit"
            className="search-btn"
            onClick={toggleSearchForm}
          >
            <i
              className={`bx ${isSearchFormVisible ? "bx-x" : "bx-search"}`}
            ></i>
          </button>
        </div>
      </form>
      <input
        type="checkbox"
        id="switch-mode"
        hidden
        onChange={toggleDarkMode}
      />
      <label htmlFor="switch-mode" className="switch-mode"></label>
      <Link href="/dashboard" className="profile active">
        <Image src="/assets/image/people.png" alt="user" width={20} height={20}/>
      </Link>
    </nav>
    </section>
  );
};

export default Navbar;

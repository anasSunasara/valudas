import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import "boxicons/css/boxicons.min.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();

  return (
    <section
      id="sidebar"
      className={isOpen ? "" : ""}
      onClick={toggleSidebar}
    >
      <Link href="" passHref className="brand active">
        <i className="bx bxs-smile"></i>
        <span className="text">AdminHub</span>
      </Link>
      <ul className="side-menu top">
        <li className={router.pathname === "/admin/dashboard" ? "active" : ""}>
          <Link href="/admin/dashboard" passHref >
            <i className="bx bxs-dashboard"></i>
            <span className="text">Dashboard</span>
          </Link>
        </li>
        <li className={router.pathname === "/admin/service" ? "active" : ""}>
          <Link href="/admin/service" className="active">
            <i className="bx bxs-shopping-bag-alt"></i>
            <span className="text">Service</span>
          </Link>
        </li>
        <li className={router.pathname === "/admin/tecnology" ? "active" : ""}>
          <Link href="/admin/tecnology" className="active">
            <i className="bx bxs-shopping-bag-alt"></i>
            <span className="text">Tecnology</span>
          </Link>
        </li>
        <li className={router.pathname === "/admin/portfolio" ? "active" : ""}>
          <Link href="/admin/portfolio" className="active">
            <i className="bx bxs-shopping-bag-alt"></i>
            <span className="text">Portfolio</span>
          </Link>
        </li>
      </ul>

      <ul className="side-menu">
        <li>
          <Link href="/settings">
            <i className="bx bxs-cog"></i>
            <span className="text">Settings</span>
          </Link>
        </li>
        <li  className={router.pathname === "/admin/login" ? "active" : ""}>
          <Link href="/admin/login" className="logout active">
            <i className="bx bxs-log-out-circle"></i>
            <span className="text">Logout</span>
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;

import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthToken } from "../../contexts/AuthTokenContext";
import JwtInfo from "./JwtInfo";
import ReloginModal from "./ReloginModal";

function Header() {
  const { loggedIn, tokenWillExpire } = useAuthToken();

  const renderLinks = () => {
    if (!loggedIn) {
      return [
        <NavLink exact activeClassName="active" to="/" key="navlogin">
          <li key="nav1">Login</li>
        </NavLink>,
      ];
    }

    return [
      <NavLink
        exact
        activeClassName="active"
        to="/dashboard"
        key="nav1"
      >
        <li>Dashboard</li>
      </NavLink>,
      <NavLink
        exact
        activeClassName="active"
        to="/devices"
        key="nav2"
      >
        <li>Devices</li>
      </NavLink>,
      <NavLink
        exact
        activeClassName="active"
        to="/groups"
        key="nav3"
      >
        <li>Groups</li>
      </NavLink>,
      <NavLink
        exact
        activeClassName="active"
        to="/jobs"
        key="nav4"
      >
        <li>Jobs</li>
      </NavLink>,
      <NavLink
        exact
        activeClassName="active"
        to="/firmware-copy"
        key="nav5"
      >
        <li>Firmware</li>
      </NavLink>,
      <NavLink
        exact
        activeClassName="active"
        to="/config-change"
        key="nav6"
      >
        <li>Config change</li>
      </NavLink>,
      <JwtInfo key="navjwtinfo" />,
    ];
  };

  return (
    <header>
      <nav>
        <h1>CNaaS NAC: {process.env.API_URL.split("/")[2]}</h1>
        <ul>{renderLinks()}</ul>
        <ReloginModal isOpen={tokenWillExpire} />
      </nav>
    </header>
  );
}

export default Header;

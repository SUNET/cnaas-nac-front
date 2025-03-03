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
		to="/clients"
		key="nav2"
	    >
		<li>Clients</li>
	    </NavLink>,
	    <NavLink
		exact
		activeClassName="active"
		to="/oui"
		key="nav3"
	    >
		<li>OUIs</li>
	    </NavLink>,
	    <NavLink
		exact
		activeClassName="active"
		to="/groups"
		key="nav4"
	    >
		<li>Groups</li>
	    </NavLink>,
	    <JwtInfo key="navjwtinfo" />,
	];
    };

    return (
	<header>
	    <nav>
		<h1>CNaaS NAC</h1>
		<ul>{renderLinks()}</ul>
		<ReloginModal isOpen={tokenWillExpire} />
	    </nav>
	</header>
    );
}

export default Header;

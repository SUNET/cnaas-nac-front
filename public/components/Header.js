import React from "react";
import { NavLink } from "react-router-dom";

class Header extends React.Component {
    render() {
	return (
	    <header>
		<nav>
		    <ul>
			<NavLink activeclassname="active" to={`/`}>
			    <li>Start</li>
			</NavLink>
			<NavLink activeclassname="active" to={`/clients`}>
			    <li>Clients</li>
			</NavLink>
			<NavLink activeclassname="active" to={`/groups`}>
			    <li>Groups</li>
			</NavLink>
			<NavLink activeclassname="active" to={`/oui`}>
			    <li>Auto assign</li>
			</NavLink>
		    </ul>
		</nav>
	    </header>
	);
    }
}

export default Header;

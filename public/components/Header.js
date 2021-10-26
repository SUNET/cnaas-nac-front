import React from "react";
import { NavLink } from "react-router-dom";

class Header extends React.Component {
    render() {
        return (
            <header>
                <nav>
                    <ul>
                        <NavLink exact activeClassName="active" to={`/`}>
                            <li>Start</li>
                        </NavLink>
                        <NavLink exact activeClassName="active" to={`/clients`}>
                            <li>Clients</li>
                        </NavLink>
                    </ul>
                </nav>
            </header>
        );
    }
}

export default Header;

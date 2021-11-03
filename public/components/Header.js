import React from "react";
import { NavLink } from "react-router-dom";

class Header extends React.Component {
    render() {
        return (
            <header>
                <a
                    id="logout"
                    style={{ cursor: "pointer" }}
                    onClick={this.props.clearToken}
                >
                    Log out
                </a>
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

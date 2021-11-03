import React from "react";
import { Button } from "semantic-ui-react";

class DeviceMonitor extends React.Component {
    render() {
        console.log(this.props);
        return (
            <div id="device-monitor">
                <div id="left"></div>
                <div id="content">
                    <div id="accepted">
                        <div className="header">Accepted clients</div>
                        <List clients={this.props.accepted} />
                        {this.props.acceptedCleared.length > 0 && (
                            <React.Fragment>
                                <hr />
                                <div class="cleared">
                                    <List
                                        clients={this.props.acceptedCleared}
                                    />
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                    <div id="rejected">
                        <div className="header">Rejected clients</div>
                        <List clients={this.props.rejected} />
                        {this.props.rejectedCleared.length > 0 && (
                            <React.Fragment>
                                <hr />
                                <div className="cleared">
                                    <List
                                        clients={this.props.rejectedCleared}
                                    />
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>
                <div id="right">
                    <Button id="clear-button" onClick={this.props.clear}>
                        Reset
                    </Button>
                </div>
            </div>
        );
    }
}

function List(props) {
    return props.clients.map(x => <Row key={x[0]} id={x[0]} n={x[1]} />);
}

function Row(props) {
    return (
        <div className="client">
            <div className="client-name">{props.id}</div>
            {props.n > 1 && <div className="client-n">{props.n}</div>}
        </div>
    );
}

export default DeviceMonitor;

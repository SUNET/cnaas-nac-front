import React from "react";
import { Button } from "semantic-ui-react";

class DeviceMonitor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            accepted: [],
            rejected: [],
            acceptedCleared: [],
            rejectedCleared: []
        };
    }

    makeListener(type) {
        return event => {
            // NOTE: O(n)
            this.setState((state, props) => {
                let old = state[type].find(x => x[0] === event.data);
                let oldValue = old === undefined ? 0 : old[1];
                let res = {};
                res[type] = [
                    [event.data, oldValue + 1],
                    ...state.rejected.filter(x => x[0] !== event.data)
                ];
                return res;
            });
        };
    }

    rejectListener = this.makeListener("rejected");
    acceptListener = this.makeListener("accepted");
    eventSource = new EventSource("https://localhost:4430/events");

    componentDidMount() {
        this.eventSource.addEventListener(
            "accepted_update",
            this.acceptListener
        );
        this.eventSource.addEventListener(
            "rejected_update",
            this.rejectListener
        );
    }

    componentWillUnmount() {
        this.eventSource.removeEventListener(
            "accepted_update",
            this.acceptListener
        );
        this.eventSource.removeEventListener(
            "rejected_update",
            this.rejectListener
        );
    }

    clear = () => {
        console.log("clear");
        this.setState((state, props) => ({
            rejectedCleared: state.rejected,
            rejected: []
        }));
    };

    render() {
        console.log(this.state);
        return (
            <div id="device-monitor">
                <div id="left"></div>
                <div id="content">
                    <div id="accepted">
                        <div className="header">Accepted clients</div>
                        <List clients={this.state.accepted} />
                    </div>
                    <div id="rejected">
                        <div className="header">Rejected clients</div>
                        <List clients={this.state.rejected} />
                        {this.state.rejectedCleared.length > 0 && (
                            <React.Fragment>
                                <hr />
                                <div class="cleared">
                                    <List
                                        clients={this.state.rejectedCleared}
                                    />
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>
                <div id="right">
                    <Button id="clear-button" onClick={this.clear}>
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

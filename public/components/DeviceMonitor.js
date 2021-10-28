import React from "react";

class DeviceMonitor extends React.Component {
    constructor(props) {
        super(props);

        // NOTE: Mock data
        // TODO: Set initial state via API call?
        this.state = {
            accepted: [
                { test3: "12" },
                { test4: "3" },
                { test2: "3" },
                { test1: "2" }
            ],
            rejected: [
                { test3: "12" },
                { test4: "3" },
                { test2: "3" },
                { test1: "2" }
            ]
        };
    }

    acceptListener = event => {
        console.log(`Accepted: ${event.data}`);
        this.setState({
            accepted: JSON.parse(event.data)["accepted"]
        });
    };

    rejectListener = event => {
        console.log(`Rejected: ${event.data}`);
        this.setState({
            rejected: JSON.parse(event.data)["rejected"]
        });
    };

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

    render() {
        return (
            <div id="device-monitor">
                <div id="accepted">
                    <div className="header">Accepted clients</div>
                    <TopList clients={this.state.accepted} />
                </div>
                <div id="rejected">
                    <div className="header">Rejected clients</div>
                    <TopList clients={this.state.rejected} />
                </div>
            </div>
        );
    }
}

function TopList(props) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Client</th>
                    <th>Connection attempts</th>
                </tr>
            </thead>
            <tbody>
                {props.clients
                    .map(x => Object.entries(x)[0]) // TODO: Change to array of tuples in backend
                    .map(x => (
                        <tr key={x[0]}>
                            <td>{x[0]}</td>
                            <td>{x[1]}</td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );

    return JSON.stringify(props.clients);
}

export default DeviceMonitor;

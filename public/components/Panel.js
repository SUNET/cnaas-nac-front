import React from "react";
import DeviceList from "./DeviceList";
import { Route, Switch } from "react-router-dom";
import { postData } from "react-router-dom";
import { Button } from "semantic-ui-react";
import DeviceMonitor from "./DeviceMonitor";

class Panel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deviceMonitor: {
                accepted: [],
                rejected: [],
                acceptedCleared: [],
                rejectedCleared: []
            }
        };
    }

    makeListener(type) {
        return event => {
            // NOTE: O(n)
            this.setState((state, props) => {
                let old = state.deviceMonitor[type].find(
                    x => x[0] === event.data
                );
                let oldValue = old === undefined ? 0 : old[1];
                let res = Object.assign({}, state.deviceMonitor);
                res[type] = [
                    [event.data, oldValue + 1],
                    ...state.deviceMonitor[type].filter(
                        x => x[0] !== event.data
                    )
                ];
                return { deviceMonitor: res };
            });
        };
    }

    acceptListener = this.makeListener("accepted");
    rejectListener = this.makeListener("rejected");
    eventSource = new EventSource("https://localhost:4430/events");

    componentDidMount() {
        console.log("event listeners added");
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
        console.log("event listeners removed");
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
            deviceMonitor: {
                acceptedCleared: state.deviceMonitor.accepted,
                accepted: [],
                rejectedCleared: state.deviceMonitor.rejected,
                rejected: []
            }
        }));
    };

    render() {
        console.log("this is props (in panel)", this.props);
        return (
            <div id="panel">
                <Switch>
                    <Route exact path="/">
                        <DeviceMonitor
                            clear={this.clear}
                            {...this.state.deviceMonitor}
                        />
                    </Route>
                    <Route exact path="/clients">
                        <DeviceList />
                    </Route>
                </Switch>
            </div>
        );
    }
}

export default Panel;

import React from "react";
import PropTypes from "prop-types";
import {
    Button,
    Select,
    Input,
    Icon,
    Pagination,
    Checkbox
} from "semantic-ui-react";

export default class Modal extends React.Component {
    onClose = e => {
        this.props.onClose && this.props.onClose(e);
    };

    onSubmit = e => {
        this.props.onSubmit && this.props.onSubmit(e);
        this.props.onClose && this.props.onClose(e);
    };

    render() {
        if (!this.props.show) {
            return null;
        }

        if (this.props.messageBox !== "") {
            return (
                <div id="modal">
                    <div id="content">{this.props.children}</div>
                    <div id="actions">
                        <Button onClick={this.onClose}>Close</Button>
                    </div>
                </div>
            );
        } else {
            return (
                <div id="modal">
                    <div id="content">{this.props.children}</div>
                    <br />
                    <div id="actions">
                        <center>
                            <Button onClick={this.onSubmit}>OK</Button>
                            <Button onClick={this.onClose}>Cancel</Button>
                        </center>
                    </div>
                    <br />
                </div>
            );
        }
    }
}

Modal.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    messageBox: PropTypes.string.isRequired
};

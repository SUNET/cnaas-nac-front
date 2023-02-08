import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import checkResponseStatus from "../utils/checkResponseStatus";

class FileUploadButton extends Component {
    handleFileUpload = event => {
	const file = event.target.files[0];
	const credentials = localStorage.getItem("token");

	fetch(process.env.NAC_API_URL + "/api/v1.0/auth", {
	    method: 'POST',
	    body: file,
	    headers: {
		"Content-Type": "text/csv",
		Authorization: `Bearer ${credentials}`
	    }
	})
	    .then(function(res){ return res.json(); })
	    .catch(function(data){alert(data.message)})
    };

    render() {
	return (
	    <React.Fragment>
		<input
		    ref="fileInput"
		    onChange={this.handleFileUpload}
		    type="file"
		    style={{ display: "none" }}
		    // multiple={false}
		/>
		<Button onClick={() => this.refs.fileInput.click()} title="Upload CSV file">📁</Button>
	    </React.Fragment>
	);
    }
}
export default FileUploadButton;

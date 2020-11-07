import React from "react";
import PropTypes from 'prop-types'
import { Button, Select, Input, Icon } from 'semantic-ui-react'

class DeviceEnableForm extends React.Component {
  render() {
    return (
      <form >
        <Button type='submit'>Enable</Button>
      </form>
    );

  }
}

export default DeviceEnableForm;

import React from 'react';
import { Input } from 'antd';
import { keyboardFilters } from 'utils/keyboard';


class DigitsInput extends React.Component {

  render () {

    return (
      <Input {...this.props} onKeyPress={keyboardFilters.digit} />
    )
  }
}

export default DigitsInput

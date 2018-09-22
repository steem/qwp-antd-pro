import React from 'react';
import { Input } from 'antd';
import * as keyboardFilters from 'utils/keyboard';


class DigitsInput extends React.PureComponent {

  render () {

    return (
      <Input {...this.props} onKeyPress={keyboardFilters.digit} />
    )
  }
}

export default DigitsInput

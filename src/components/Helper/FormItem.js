import React from 'react';
import {
  Form,
} from 'antd';
import { getFieldDecorator, getFormFieldLabel } from 'utils/form';

const FormItem = Form.Item;


class FormItemEx extends React.Component {

  render () {
    const { form, settings, formName, noLabel, fieldName, label, children, values, ...itemProps} = this.props;
    const otherProps = {};

    if (!noLabel) {
      otherProps.label = label || (fieldName ? getFormFieldLabel(settings, formName, fieldName) : '');
    }
    return (
      <FormItem {...itemProps} {...otherProps}>
        {getFieldDecorator(form, settings, formName, fieldName, values)(children)}
      </FormItem>
    )
  }
}

export default FormItemEx

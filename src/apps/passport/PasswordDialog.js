import React, { PureComponent } from 'react';
import {
  Form,
  Input,
} from 'antd';
import AutoSizeDialog from 'components/Dialog';
import FormItemEx from 'components/Helper/FormItem';
import { createSubmitHandler } from 'utils/form';
import { showErrorMessage } from 'utils/utils';

const formName = 'pwd';

@Form.create()
export default class PasswordDialog extends PureComponent {

  onOk = (err, fields, resetFields) => {
    if (err) {
      showErrorMessage(err);
      return;
    }
    this.props.dispatch({
      type: `passport/changePassword`,
      payload: fields,
      callback: () => {
        resetFields();
        this.props.handleModalVisible(false);
      },
    });
  }

  render() {
    const { modalVisible, form, settings, loading, handleModalVisible } = this.props;

    if (!this.submitHandler) {
      this.submitHandler = createSubmitHandler({
        form,
        onSubmit: this.onOk.bind(this),
        formName,
        formRules: settings.formRules,
      })
    }

    const formItemProps = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      form,
      settings,
      formName,
    };

    return (
      <AutoSizeDialog 
        title="修改密码"
        visible={modalVisible}
        loading={loading.effects['passport/changePassword']}
        height={220}
        onOk={this.submitHandler}
        onCancel={() => handleModalVisible(false)}
      >
        <FormItemEx {...formItemProps} fieldName="pwd1">
          <Input type="password" placeholder="请输入" />
        </FormItemEx>
        <FormItemEx {...formItemProps} fieldName="pwd2">
          <Input type="password" placeholder="请输入" />
        </FormItemEx>
      </AutoSizeDialog>
    );
  }
}

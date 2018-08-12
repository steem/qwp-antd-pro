import React, { PureComponent } from 'react';
import {
  Form,
  Input,
} from 'antd';
import AutoSizeDialog from 'components/Dialog';
import { createSubmitHandler, getFieldDecorator } from 'utils/form';
import { showErrorMessage } from 'utils/utils';

const FormItem = Form.Item;
const formName = 'user';

@Form.create()
export default class UserDialog extends PureComponent {

  onOk = (err, fields, cb) => {
    if (err) {
      showErrorMessage(err);
      return;
    }
    if (this.props.isEdit) {
      fields.id = this.props.values.id;
    }
    this.props.dispatch({
      type: `user/${this.props.isEdit ? 'edit' : 'create'}`,
      payload: fields,
      callback: () => {
        cb();
        this.handleModalVisible(false);
      },
    });
  };

  render() {
    const { modalVisible, form, settings, loading, values, handleModalVisible, isEdit } = this.props;

    return (
      <AutoSizeDialog 
        title={isEdit ? '编辑对象' : '创建对象'}
        visible={modalVisible}
        loading={loading}
        height={300}
        onOk={createSubmitHandler(form, this.onOk.bind(this))} 
        onCancel={() => handleModalVisible(false)}
      >
        {!isEdit && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {getFieldDecorator(form, settings, formName, 'name', values)(<Input placeholder="请输入" disabled={isEdit} />)}
        </FormItem>)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
          {getFieldDecorator(form, settings, formName, 'desc', values)(<Input placeholder="请输入" />)}
        </FormItem>
      </AutoSizeDialog>
    );
  }
}

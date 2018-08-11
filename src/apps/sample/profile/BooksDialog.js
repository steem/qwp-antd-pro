import React, { PureComponent } from 'react';
import {
  Form,
  Input,
} from 'antd';
import AutoSizeDialog from 'components/Dialog';
import { createSubmitHandler, getFieldDecorator } from 'utils/form';

const FormItem = Form.Item;

@Form.create()
export default class BooksDialog extends PureComponent {

  render() {
    const { modalVisible, form, settings, loading, values, onOk, handleModalVisible, isEdit } = this.props;
    const formName = 'books';

    return (
      <AutoSizeDialog 
        title={isEdit ? '编辑对象' : '创建对象'}
        visible={modalVisible}
        loading={loading}
        height={300}
        onOk={createSubmitHandler(form, onOk)} 
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

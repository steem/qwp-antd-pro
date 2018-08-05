import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Icon,
  Select,
} from 'antd';
import AutoSizeDialog from 'components/Dialog';
import { createSubmitHander, getFieldDecorator } from 'utils/form';

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
export default class UserDialog extends PureComponent {

  render() {
    const { modalVisible, form, settings, loading, values, onOk, handleModalVisible, isEdit } = this.props;
    const formName = 'user';

    return (
      <AutoSizeDialog 
        title={isEdit ? '编辑用户信息' : '创建新用户'}
        visible={modalVisible}
        loading={loading}
        height={300}
        onOk={createSubmitHander(form, onOk)} 
        onCancel={() => handleModalVisible(false)}
      >
        {!isEdit && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="账号">
          {getFieldDecorator(form, settings, formName, 'account', values)(<Input placeholder="请输入" disabled={isEdit} />)}
        </FormItem>)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
          {getFieldDecorator(form, settings, formName, 'pwd', values, isEdit ? 'edit' : false)(<Input type="password" placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
          {getFieldDecorator(form, settings, formName, 'role', values)(
            <Select placeholder="请选择角色" style={{ width: '100%' }}>
              <Option value="">请选择角色</Option>
              <Option value="1">超级管理员</Option>
              <Option value="2">维护人员</Option>
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="昵称">
          {getFieldDecorator(form, settings, formName, 'nick_name', values)(<Input placeholder="请输入" />)}
        </FormItem>
      </AutoSizeDialog>
    );
  }
}

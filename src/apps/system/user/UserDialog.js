import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Upload,
  Icon,
  Select,
} from 'antd';
import AutoSizeDialog from 'components/Dialog';
import FormItemEx from 'components/Helper/FormItem';
import DigitsInput from 'components/Helper/DigitsInput';
import { createSubmitHandler, isFileValid } from 'utils/form';
import { getFileUploadUrl, getUserAvatarUrl } from 'requests/user';
import { showOpsNotification, showErrorMessage } from 'utils/utils';
import { l } from 'utils/localization';

const FormItem = Form.Item;
const Option = Select.Option;
const formName = 'user';

@Form.create()
export default class UserDialog extends PureComponent {
  state = {
    loading: false,
  };

  onChange (info) {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      if (!info.file.response) {
        showErrorMessage(l('Unkown error'));
      } else if (!info.file.response.success) {
        showOpsNotification(info.file.response);
        this.setState({
          loading: false,
        });
        return;
      }
      this.setState({
        url: getUserAvatarUrl({u: 1}),
        loading: false,
      });
    }
  }

  beforeUpload (file) {
    const ret = isFileValid(this.props.settings, formName, 'avatar', [file]);
    if (ret !== true) {
      showErrorMessage(ret);
      return false;
    }
    return true;
  }

  beforeSubmit () {
    if (this.state.loading) {
      showErrorMessage(l('正在上传头像，请稍后！'));
      return false;
    }
    if (!this.state.url) {
      showErrorMessage(l('请上传头像'));
      // TODO: if file is required, just return false
      // return false;
    }
  }

  onOk = (err, fields, resetFields) => {
    if (err) {
      showErrorMessage(err);
      return;
    }
    if (this.props.isEdit) {
      fields.id = this.props.values.id;
    }
    this.props.dispatch({
      type: `users/${this.props.isEdit ? 'edit' : 'create'}`,
      payload: fields,
      callback: () => {
        resetFields();
        this.props.handleModalVisible(false);
      },
    });
  }

  render() {
    const { modalVisible, form, settings, loading, values, handleModalVisible, isEdit } = this.props;

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    if (!this.submitHandler) {
      this.submitHandler = createSubmitHandler({
        form,
        onSubmit: this.onOk.bind(this),
        beforeSubmit: this.beforeSubmit.bind(this),
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
      values,
    };
    return (
      <AutoSizeDialog 
        title={isEdit ? '编辑用户信息' : '创建新用户'}
        visible={modalVisible}
        loading={loading}
        onOk={this.submitHandler}
        onCancel={() => handleModalVisible(false)}
      >
        {!isEdit && (
        <FormItemEx {...formItemProps} fieldName="account">
          <Input placeholder="请输入" disabled={isEdit} />
        </FormItemEx>)}
        <FormItemEx {...formItemProps} fieldName="pwd">
          <Input type="password" placeholder="请输入" />
        </FormItemEx>
        <FormItemEx {...formItemProps} fieldName="role">
          <Select placeholder="请选择角色" style={{ width: '100%' }}>
            <Option value="">请选择角色</Option>
            <Option value="1">超级管理员</Option>
            <Option value="2">维护人员</Option>
          </Select>
        </FormItemEx>
        <FormItemEx {...formItemProps} fieldName="name">
          <Input placeholder="请输入" />
        </FormItemEx>
        <FormItemEx {...formItemProps} fieldName="nick_name">
          <Input placeholder="请输入" />
        </FormItemEx>
        <FormItemEx {...formItemProps} fieldName="phone">
          <Input placeholder="请输入" />
        </FormItemEx>
        <FormItemEx {...formItemProps} fieldName="age">
          <DigitsInput placeholder="请输入" />
        </FormItemEx>
        <FormItemEx {...formItemProps} fieldName="email">
          <Input placeholder="请输入" />
        </FormItemEx>
        <FormItemEx {...formItemProps} fieldName="address">
          <Input placeholder="请输入" />
        </FormItemEx>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="头像">
          <Upload 
            name="avatar"
            style={{ width: 128, height: 128 }}
            showUploadList={false}
            beforeUpload={this.beforeUpload.bind(this)}
            onChange={this.onChange.bind(this)}
            action={getFileUploadUrl()}
            listType="picture-card"
          >
            {(isEdit && values.avatar_type) || this.state.url ? <img src={isEdit && !this.state.url ? getUserAvatarUrl({id: values.id}) : this.state.url} alt="avatar" width="128px" height="128px" /> : uploadButton}
          </Upload>
        </FormItem>
      </AutoSizeDialog>
    );
  }
}

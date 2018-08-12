import React, { PureComponent } from 'react';
import {
  Form,
  Input,
} from 'antd';
import AutoSizeDialog from 'components/Dialog';
import MultiTags from 'components/Helper/MultiTags';
import { createSubmitHandler, getFieldDecorator } from 'utils/form';
import { showErrorMessage } from 'utils/utils';

const FormItem = Form.Item;
const formName = 'books';

@Form.create()
export default class BooksDialog extends PureComponent {

  onOk = (err, fields, resetFields) => {
    if (err) {
      showErrorMessage(err);
      return;
    }
    if (this.props.isEdit) {
      fields.id = this.props.values.id;
    }
    fields.f.tags = this.state && this.state.tags ? this.state.tags : this.props.values.tags;
    this.props.dispatch({
      type: `books/${this.props.isEdit ? 'edit' : 'create'}`,
      payload: fields,
      callback: () => {
        resetFields();
        this.props.handleModalVisible(false);
      },
    });
  };

  saveTags (tags) {
    this.setState({
      tags,
    });
  }

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
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标签">
          <MultiTags color="blue" saveTags={this.saveTags.bind(this)} maxLength={20} tags={values && values.tags ? values.tags : []} />
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
          {getFieldDecorator(form, settings, formName, 'description', values)(<Input placeholder="请输入" />)}
        </FormItem>
      </AutoSizeDialog>
    );
  }
}

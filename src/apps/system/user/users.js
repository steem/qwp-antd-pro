import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  DatePicker,
  Alert,
} from 'antd';
import StandardTable from 'components/StandardTable';
import RandomAvatar from 'components/Helper/RandomAvatar';
import DropOption from 'components/DropOption';
import { createSubmitHander, createFieldRules } from 'utils/form';
import { showErrorMessage } from 'utils/utils';
import { l } from 'utils/localization';
import { createTableColumn, handleTableChange } from 'utils/table';
import UserDialog from './UserDialog';
import styles from './users.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ users, loading }) => ({
  users,
  loading,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    searchValues: {},
    isEdit: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/fetch',
      payload: {},
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;

    handleTableChange(dispatch, 'users/fetch', searchValues, pagination, filtersArg, sorter);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      searchValues: {},
    });
    dispatch({
      type: 'users/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;

    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = (u, e) => {
    if (!u) {
      if (this.props.users.selectedRows.length !== 1) {
        showErrorMessage(l('请选择一个用户'));
        return;
      }
      u = this.props.users.selectedRows[0];
    }

    switch (e.key) {
      case 'remove':
        this.deleteUsers(u.id);
        break;
      case 'edit':
        this.editUser(u, true);
        break;
      default:
        break;
    }
  };

  deleteUsers = (ids) => {
    if (!ids && !this.props.users.selectedRows.length) return;
    this.props.dispatch({
      type: 'users/remove',
      payload: {
        ids,
      },
    });
  };

  editUser = (user, fromClick) => {
    this.handleModalVisible(true, true, fromClick ? user : null);
  };

  handleSelectRows = rows => {
    this.props.dispatch({
      type: 'users/selectedUsers',
      payload: {
        r: rows,
      },
    });
  };

  clearSelectedRows = () => {
    this.props.dispatch({
      type: 'users/selectedUsers',
      payload: {
        r: [],
      },
    });
  };

  handleSearch = (err, fields) => {
    if (err) return;

    this.setState({
      searchValues: fields,
    });

    const { dispatch } = this.props;

    dispatch({
      type: 'users/fetch',
      payload: fields,
    });
  };

  handleModalVisible = (modalVisible, isEdit, user) => {
    this.setState({
      modalVisible: !!modalVisible,
      isEdit: !!isEdit,
      user,
    });
  };

  handleUserDialog = (err, fields, cb) => {
    if (err) {
      showErrorMessage(err);
      return;
    }
    if (this.state.isEdit) {
      fields.id = this.state.user ? this.state.user.id : this.props.users.selectedRows[0].id;
    }
    this.props.dispatch({
      type: `users/${this.state.isEdit ? 'edit' : 'create'}`,
      payload: fields,
      callback: () => {
        cb();
        this.handleModalVisible(false);
      },
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const formName = 'search';

    return (
      <Form onSubmit={createSubmitHander(this.props.form, this.handleSearch, false, 's')} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('create_time', createFieldRules(this.props.users.settings, formName, 'create_time'))(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name', createFieldRules(this.props.users.settings, formName, 'name'))(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    const formName = 'search';

    return (
      <Form onSubmit={createSubmitHander(this.props.form, this.handleSearch, false, 's')} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('create_time', createFieldRules(this.props.users.settings, formName, 'create_time'))(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name', createFieldRules(this.props.users.settings, formName, 'name'))(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="电话号码">
              {getFieldDecorator('phone', createFieldRules(this.props.users.settings, formName, 'phone'))(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="邮箱">
              {getFieldDecorator('email', createFieldRules(this.props.users.settings, formName, 'email'))(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="地址">
              {getFieldDecorator('address', createFieldRules(this.props.users.settings, formName, 'address'))(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="y">启用</Option>
                  <Option value="n">禁用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { users, loading } = this.props;
    const { data, settings } = users;

    if (!settings.tables.user) {
      return null;
    }

    const { modalVisible } = this.state;

    if (!this.columns) {
      this.columns = createTableColumn(settings.tables.user, {
        render: {
          name (text, record, ui) {
            return (
              <RandomAvatar text={record.nick_name.substr(0, 1)}>
                <a title={l('Click to update user information')} onClick={() => ui.editUser(record, true)}>{text}</a>
              </RandomAvatar>
            );
          },
          detail (text, r) {
            return (<span>{ r.gender === 'm' ? 'Male' : 'Female' } <br /> { r.nick_name } { r.age }</span>)
          },
          operation (text, record, ui) {
            return (
              <DropOption 
                onMenuClick={e => ui.handleMenuClick(record, e)}
                menuOptions={[{ key: 'edit', name: l('Edit') }, { key: 'remove', name: l('Delete') }]}
              />
            )
          },
        },
        className: {
          avatar: styles.avatar,
        },
      }, this);
    }
    const menu = (
      <Menu onClick={e => this.handleMenuClick(null, e)} selectedKeys={[]}>
        <Menu.Item key="role">设置角色</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const dialogProps = {
      settings,
      onOk: this.handleUserDialog,
      handleModalVisible: this.handleModalVisible,
      values: this.state.isEdit ? (this.state.user || this.props.users.selectedRows[0]) : {},
      isEdit: this.state.isEdit,
    };

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新建
            </Button>
            {users.selectedRows && users.selectedRows.length > 0 && (
              <span>
                {users.selectedRows.length === 1 && <Button onClick={this.editUser} loading={loading.effects['users/edit']}>编辑</Button>}
                <Button onClick={() => this.deleteUsers()} loading={loading.effects['users/remove']}>删除</Button>
                <Dropdown overlay={menu}>
                  <Button>
                    更多操作 <Icon type="down" />
                  </Button>
                </Dropdown>
              </span>
            )}
            {users.selectedRows && users.selectedRows.length > 0 && (
              <div style={{float: 'right'}}>
                <Alert
                  message={
                    <Fragment>
                      已选择 <a style={{ fontWeight: 600 }}>{users.selectedRows.length}</a> 项&nbsp;&nbsp;
                      <a onClick={this.clearSelectedRows} style={{ marginLeft: 24 }}>
                        清空
                      </a>
                    </Fragment>}
                  type="info"
                  showIcon
                />
              </div>
            )}
          </div>
          <StandardTable
            selectedRows={users.selectedRows}
            loading={loading.effects['users/init'] || loading.effects['users/fetch']}
            data={data}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
        {modalVisible && <UserDialog ref={n => {this.dialog = n}} {...dialogProps} modalVisible={modalVisible} loading={loading.effects['users/create'] || loading.effects['users/edit']} />}
      </Card>
    );
  }
}

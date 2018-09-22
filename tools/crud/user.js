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
import FormItemEx from 'components/Helper/FormItem';
import DropOption from 'components/DropOption';
import { createSubmitHandlerForSearch } from 'utils/form';
import { showErrorMessage } from 'utils/utils';
import { l } from 'utils/localization';
import { createTableColumn, handleTableChange } from 'utils/table';
import UserDialog from './UserDialog';
import styles from './user.less';

const searchFormName = 'search';

@connect(({ user, loading }) => ({
  user,
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
      type: 'user/fetch',
      payload: {},
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;

    handleTableChange(dispatch, 'user/fetch', searchValues, pagination, filtersArg, sorter);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      searchValues: {},
    });
    dispatch({
      type: 'user/fetch',
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
      if (this.props.user.selectedRows.length !== 1) {
        showErrorMessage(l('请选择一个用户'));
        return;
      }
      u = this.props.user.selectedRows[0];
    }

    switch (e.key) {
      case 'remove':
        this.deleteUser(u.id);
        break;
      case 'edit':
        this.editUser(u, true);
        break;
      default:
        break;
    }
  };

  opsByIds = (ids, op) => {
    if (!ids && !this.props.tasks.selectedRows.length) return;
    this.props.dispatch({
      type: `tasks/${op}`,
      payload: {
        ids,
      },
    });
  }

  deleteUser = (ids) => {
    this.opsByIds(ids, 'remove');
  };

  editUser = (user, fromClick) => {
    this.handleModalVisible(true, true, fromClick ? user : null);
  };

  handleSelectRows = rows => {
    this.props.dispatch({
      type: 'user/selectedUser',
      payload: {
        r: rows,
      },
    });
  };

  clearSelectedRows = () => {
    this.props.dispatch({
      type: 'user/selectedUser',
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
      type: 'user/fetch',
      payload: fields,
    });
  };

  handleModalVisible = (visible, isEdit, user) => {
    this.setState({
      modalVisible: !!visible,
      isEdit: !!isEdit,
      user,
    });
  };

  renderSimpleForm() {
    const { form, user: { settings } } = this.props;
    const formItemProps = {
      form,
      settings,
      formName: searchFormName,
    };

    return (
      <Form onSubmit={this.searchSubmitHandler} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItemEx {...formItemProps} fieldName="create_time">
              <DatePicker style={{ width: '100%' }} placeholder="请输入创建日期" />
            </FormItemEx>
          </Col>
          <Col md={8} sm={24}>
            <FormItemEx {...formItemProps} fieldName="name">
              <Input placeholder="请输入" />
            </FormItemEx>
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
    const { form, user: { settings } } = this.props;
    const formItemProps = {
      form,
      settings,
      formName: searchFormName,
    };

    return (
      <Form onSubmit={this.searchSubmitHandler} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItemEx {...formItemProps} fieldName="create_time">
              <DatePicker style={{ width: '100%' }} placeholder="请输入创建日期" />
            </FormItemEx>
          </Col>
          <Col md={8} sm={24}>
            <FormItemEx {...formItemProps} fieldName="name">
              <Input placeholder="请输入" />
            </FormItemEx>

          </Col>
          <Col md={8} sm={24}>
            <FormItemEx {...formItemProps} fieldName="description">
              <Input placeholder="请输入" />
            </FormItemEx>
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
    const { user, loading } = this.props;
    const { data, settings } = user;

    if (!settings.tables.user) {
      return null;
    }

    if (!this.searchSubmitHandler) {
      this.searchSubmitHandler = createSubmitHandlerForSearch({
        form: this.props.form,
        onSubmit: this.handleSearch,
        formRules: settings.formRules,
        formName: searchFormName,
      })
    }
  
    const { modalVisible } = this.state;

    if (!this.columns) {
      this.columns = createTableColumn(settings.tables.user, {
        render: {
          name (text, record, ui) {
            return (<a title={l('Click to update user information')} onClick={() => ui.editUser(record, true)}>{text}</a>);
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
      dispatch: this.props.dispatch,
      handleModalVisible: this.handleModalVisible,
      values: this.state.isEdit ? (this.state.user || this.props.user.selectedRows[0]) : {},
      isEdit: this.state.isEdit,
    };
    const isSelected = user.selectedRows && user.selectedRows.length > 0;

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新建
            </Button>
            {isSelected && (
              <span>
                {user.selectedRows.length === 1 && <Button onClick={this.editUser} loading={loading.effects['user/edit']}>编辑</Button>}
                <Button onClick={() => this.deleteUser()} loading={loading.effects['user/remove']}>删除</Button>
                <Dropdown overlay={menu}>
                  <Button>
                    更多操作 <Icon type="down" />
                  </Button>
                </Dropdown>
              </span>
            )}
            {isSelected && (
              <div style={{float: 'right'}}>
                <Alert
                  message={
                    <Fragment>
                      已选择 <a style={{ fontWeight: 600 }}>{user.selectedRows.length}</a> 项&nbsp;&nbsp;
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
            selectedRows={user.selectedRows}
            loading={loading.effects['user/init'] || loading.effects['user/fetch']}
            data={data}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
        {modalVisible && <UserDialog ref={n => {this.dialog = n}} {...dialogProps} modalVisible={modalVisible} loading={loading.effects['user/create'] || loading.effects['user/edit']} />}
      </Card>
    );
  }
}

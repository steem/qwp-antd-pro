import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Dropdown,
  Menu,
  DatePicker,
  Alert,
} from 'antd';
import StandardTable from 'components/StandardTable';
import DropOption from 'components/DropOption';
import { createSubmitHandlerForSearch, getFieldDecorator } from 'utils/form';
import { showErrorMessage } from 'utils/utils';
import { l } from 'utils/localization';
import { createTableColumn, handleTableChange } from 'utils/table';
import styles from './user.less';

const FormItem = Form.Item;
const searchFormName = 'search';

@connect(({ user, loading }) => ({
  user,
  loading,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    expandForm: false,
    searchValues: {},
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

  handleMenuClick = (e) => {

  }

  renderSimpleForm() {
    const { form, user: { settings } } = this.props;

    return (
      <Form onSubmit={this.searchSubmitHandler} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator(form, settings, searchFormName, 'create_time' )(<DatePicker style={{ width: '100%' }} placeholder="请输入创建日期" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator(form, settings, searchFormName, 'name' )(<Input placeholder="请输入" />)}
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
    const { form, user: { settings } } = this.props;

    return (
      <Form onSubmit={this.searchSubmitHandler} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator(form, settings, searchFormName, 'create_time')(<DatePicker style={{ width: '100%' }} placeholder="请输入创建日期" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator(form, settings, searchFormName, 'name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="描述">
              {getFieldDecorator(form, settings, searchFormName, 'description')(<Input placeholder="请输入" />)}
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

    if (!this.columns) {
      this.columns = createTableColumn(settings.tables.user, {
        render: {
          operation (text, record, ui) {
            return (<span>Test</span>)
          },
        },
      }, this);
    }

    const menu = (
      <Menu onClick={e => this.handleMenuClick(e)} selectedKeys={[]}>
        <Menu.Item key="role">设置角色</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div className={styles.tableListOperator}>
            {user.selectedRows && user.selectedRows.length > 0 && (
              <Dropdown overlay={menu}>
                <Button>
                  更多操作 <Icon type="down" />
                </Button>
              </Dropdown>
            )}
            {user.selectedRows && user.selectedRows.length > 0 && (
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
      </Card>
    );
  }
}
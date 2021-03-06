import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Tag,
  Icon,
  Button,
  Dropdown,
  Menu,
  DatePicker,
  Alert,
  Tooltip,
} from 'antd';
import _ from 'lodash';
import StandardTable from 'components/StandardTable';
import FormItemEx from 'components/Helper/FormItem';
import DropOption from 'components/DropOption';
import { createSubmitHandlerForSearch, getFieldDecorator } from 'utils/form';
import { showErrorMessage } from 'utils/utils';
import { l } from 'utils/localization';
import { createTableColumn, handleTableChange } from 'utils/table';
import BooksDialog from './BooksDialog';
import styles from './books.less';

const FormItem = Form.Item;
const searchFormName = 'search';

function createBookTags(r) {
  if (!r.tags || r.tags.length === 0) return (<span>未设置</span>);
  if (_.isString(r.tags)) r.tags = JSON.parse(r.tags);
  return r.tags.map(item => {
    const isLongTag = item.length > 10;
    const props = {
      color: 'magenta',
    };
    if (!isLongTag) props.key = item;
    const tagElem = (<Tag {...props}>{isLongTag ? `${item.slice(0, 10)}...` : item}</Tag>);
    return isLongTag ? <Tooltip title={item} key={item}>{tagElem}</Tooltip> : tagElem;
  });
}

@connect(({ books, loading }) => ({
  books,
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
      type: 'books/fetch',
      payload: {},
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;

    handleTableChange(dispatch, 'books/fetch', searchValues, pagination, filtersArg, sorter);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      searchValues: {},
    });
    dispatch({
      type: 'books/fetch',
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
      if (this.props.books.selectedRows.length !== 1) {
        showErrorMessage(l('请选择一个用户'));
        return;
      }
      u = this.props.books.selectedRows[0];
    }

    switch (e.key) {
      case 'remove':
        this.deleteBooks(u.id);
        break;
      case 'edit':
        this.editBooks(u, true);
        break;
      default:
        break;
    }
  };

  deleteBooks = (ids) => {
    if (!ids && !this.props.books.selectedRows.length) return;
    this.props.dispatch({
      type: 'books/remove',
      payload: {
        ids,
      },
    });
  };

  editBooks = (books, fromClick) => {
    this.handleModalVisible(true, true, fromClick ? books : null);
  };

  handleSelectRows = rows => {
    this.props.dispatch({
      type: 'books/selectedBooks',
      payload: {
        r: rows,
      },
    });
  };

  clearSelectedRows = () => {
    this.props.dispatch({
      type: 'books/selectedBooks',
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
      type: 'books/fetch',
      payload: fields,
    });
  };

  handleModalVisible = (modalVisible, isEdit, books) => {
    this.setState({
      modalVisible: !!modalVisible,
      isEdit: !!isEdit,
      books,
    });
  };

  renderSimpleForm() {
    const { form, books: { settings } } = this.props;
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
    const { form, books: { settings } } = this.props;
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
    const { books, loading } = this.props;
    const { data, settings } = books;

    if (!settings.tables.books) {
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
      this.columns = createTableColumn(settings.tables.books, {
        render: {
          name (text, record, ui) {
            return (<a title={l('Click to update books information')} onClick={() => ui.editBooks(record, true)}>{text}</a>);
          },
          tags (text, record) {
            return createBookTags(record);
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

    const dialogProps = {
      settings,
      dispatch: this.props.dispatch,
      handleModalVisible: this.handleModalVisible,
      values: this.state.isEdit ? (this.state.books || this.props.books.selectedRows[0]) : {},
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
            {books.selectedRows && books.selectedRows.length > 0 && (
              <span>
                {books.selectedRows.length === 1 && <Button onClick={this.editBooks} loading={loading.effects['books/edit']}>编辑</Button>}
                <Button onClick={() => this.deleteBooks()} loading={loading.effects['books/remove']}>删除</Button>
              </span>
            )}
            {books.selectedRows && books.selectedRows.length > 0 && (
              <div style={{float: 'right'}}>
                <Alert
                  message={
                    <Fragment>
                      已选择 <a style={{ fontWeight: 600 }}>{books.selectedRows.length}</a> 项&nbsp;&nbsp;
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
            selectedRows={books.selectedRows}
            loading={loading.effects['books/init'] || loading.effects['books/fetch']}
            data={data}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
        {modalVisible && <BooksDialog ref={n => {this.dialog = n}} {...dialogProps} modalVisible={modalVisible} loading={loading.effects['books/create'] || loading.effects['books/edit']} />}
      </Card>
    );
  }
}

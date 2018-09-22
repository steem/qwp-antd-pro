import React, { PureComponent, Fragment, Children } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';


class StandardTable extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (!nextProps.selectedRows || nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  };

  handleTableChange = (pagination, filters, sorter) => {
    if (this.props.onChange) this.props.onChange(pagination, filters, sorter);
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { data: { list, pagination }, loading, columns, 
      rowKey, noRowSelection, rowSelectionType, expandedRowRender, showHeader, noPager, locale } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = noRowSelection ? null : {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
      type: rowSelectionType || 'checkbox',
    };

    const otherProps = {};

    if (expandedRowRender) otherProps.expandedRowRender = expandedRowRender;
    if (showHeader === false) otherProps.showHeader = false;
    if (noPager !== true) otherProps.pagination = paginationProps;
    else otherProps.pagination = false;

    return (
      <div className={styles.standardTable}>
        {this.props.children}
        <Table
          loading={loading}
          rowKey={rowKey || 'id'}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          onChange={this.handleTableChange}
          {...otherProps}
          {...locale}
        />
      </div>
    );
  }
}

export default StandardTable;

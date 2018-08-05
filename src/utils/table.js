import { l } from './localization';
import config from './config';

// [dataIndex, title, width, sort, render, className]
function createColumn(item, colOptions, context) {
  const col = {
    title: item[1] ? l(item[1]) : '',
    width: item[2],
  }
  if (item[0]) {
    col.key = item[0];
    col.dataIndex = item[0];
  }
  if (item[3]) {
    if (colOptions && colOptions.sorter && colOptions.sorter[item[0]]) col.sorter = colOptions.sorter[item[0]];
    else col.sorter = true;
  }
  if (colOptions) {
    if (item.length >= 5) {
      const render = colOptions.render[item[4] === true ? item[0] : item[4]];
      col.render = context ? (t, r) => render(t, r, context) : render;
    }
    if (item.length >= 6) {
      col.className = colOptions.className[item[5] === true ? item[0] : item[5]];
    }
  }
  return col;
}
/*
headers:
{
  names: [
    ["", "", 40, false, "avatar", true],
    ["name", "Name", "10", true, true],
    ["", "", "20", false, "operation"]
  ]
}
colOptions:
{
    render: {
      avatar (text, record) {
        return (<RandomAvatar text={record.nickName.substr(0, 1)}/>)
      },
      name (text, record) {
        return (<Link title={l('Click to update user information')} onClick={e => handleClickUser(record)}>{text}</Link>)
      },
      operation (text, record) {
        return (<DropOption onMenuClick={e => handleMenuClick(record, e)}
          menuOptions={[{ key: '1', name: 'Update' }, { key: '2', name: 'Delete' }]} />)
      },
      ...
    },
    className: {
      avatar: styles.avatar
    },
  }
*/
export function createTableColumn (headers, colOptions, context) {
  if (!headers || !headers.names || headers.names.length === 0) return false;
  const cols = [];
  for (const item of headers.names) {
    cols.push(createColumn(item, colOptions, context));
  }
  return cols;
}

export function toTableData(res, params) {
  return {
    data: {
      list: res.data.data,
      pagination: {
        ...config.pagination,
        ...params,
        total: res.data.total,
        showTotal: (total, range) => l('{0}-{1} of {2} items', range[0], range[1], total),
      },
    }
  };
}

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

export function handleTableChange(dispatch, type, searchValues, pagination, filtersArg, sorter) {
  const filters = filtersArg ? Object.keys(filtersArg).reduce((obj, key) => {
    const newObj = { ...obj };
    newObj[key] = getValue(filtersArg[key]);
    return newObj;
  }, {}) : {};

  const params = {
    currentPage: pagination.current,
    pageSize: pagination.pageSize,
    ...searchValues,
    ...filters,
  };
  if (sorter && sorter.field) {
    params.sorter = sorter.field;
    params.order = sorter.order;
  }

  dispatch({
    type,
    payload: params,
  });
}

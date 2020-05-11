import React from 'react';
import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import { PaginationProps } from 'antd/lib/pagination';

interface ITableProps<T> extends TableProps<any> {
  Loading?: boolean;
  data: { list: T[]; pagination: PaginationProps };
  showPagination?: boolean;
}

function ITable<T>({
  scroll,
  columns,
  data: { list, pagination },
  showPagination,
  onChange,
  rowKey,
  loading,
  ...rest
}: ITableProps<T>) {
  /** 添加一下默认项 */
  pagination = { ...pagination, showQuickJumper: true, showSizeChanger: true, showTotal: (total) => {return `总共${total}条`}};
  return (
    <Table
      loading={loading}
      rowKey={(record: any, index: any) => index}
      dataSource={list}
      scroll={scroll}
      columns={columns}
      pagination={showPagination ? false : pagination}
      onChange={onChange}
      {...rest}
    />
  );
}

export default ITable;

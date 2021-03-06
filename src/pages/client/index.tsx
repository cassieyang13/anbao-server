import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Divider, Modal, Checkbox, message, Form, Input, Button, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import ITable from '@/components/ITable';
import TableSearch from '@/components/TableSearch';
import { getAccessList, addAccess, editAccess, deleteAccess } from '@/services/equipment';

import { getUserList, deleteUser } from '@/services/client';
import styles from './index.less';
import { PaginationProps } from 'antd/lib/pagination';
import { ITableData } from '@/services/interface';
import { standT } from '@/utils/utils';

interface IParams {
  userPhone: string;
  userName: string;
}

const Order: React.FC = () => {
  const [form] = Form.useForm();
  const columns: ColumnProps<any>[] = [
    {
      title: '序号',
      key: 'sortId',
      align: 'center',
      render: (val, _, index) => index + 1,
    },
    {
      title: '手机号',
      dataIndex: 'userPhone',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      align: 'center',
    },

    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (value: any, record: any) => (
        <div className={styles.actionWrap}>
          {/* <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => handleEdit(record)}>
            编辑
          </span>
          <Divider type="vertical" /> */}
          <span
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={() => handleDelete(record)}
          >
            删除
          </span>
        </div>
      ),
    },
  ];

  const validMeg = {};
  const [clientList, setClientList] = useState<ITableData<any>>({list: [], pagination: {}});
  const [param, setParam] = useState({
    userPhone: '',
    userName: '',
    pageNo: 1,
    pageSize: 10,
  });
  const [visiable, setVisiable] = useState(false);
  const [editData, setEditData] = useState<IParams>({
    userPhone: '',
    userName: '',
  });

  useEffect(() => {
    getClientData();
  }, [param]);

  function getClientData() {
    getUserList(param).then((res: any) => {
      if (res) {
        const formatData = standT(res.data.userList, res.data.page)
        setClientList(formatData);
      }
    });
  }


  function handleDelete(record: any) {
    console.log(record);

    Modal.confirm({
      title: '确认删除？',
      onOk: () => {
        deleteUser({
          userId: record.userId,
        }).then((res: any) => {
          console.log(res);
          message.success('删除成功')
          getClientData()
        });
      },
    });
  }



  function handleSearch(values: any) {
    console.log(values);
    setParam({
      ...param,
      ...values,
    });
  }

  function handleAdd() {
    // setVisiable(true);
  }

  async function modalSubmit() {
    const values = await form.validateFields();
    console.log(values);
    try {
      if (editData.userPhone) {
        // 编辑
        editAccess({
          ...values,

        }).then((res: any) => {
          getClientData();
          form.resetFields();
          setVisiable(false);
        });
      } else {
        // 新增
        addAccess({
          ...values,

        }).then((res: any) => {
          getClientData();
          form.resetFields();
          setVisiable(false);
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  function openTypeChange(value: any) {
    console.log(value);
  }

  function vehicleChange() {}

  
  function handleTable(pagination: PaginationProps) {
    const page = pagination.current || 1;
    const size = pagination.pageSize || 10;
    setParam({ ...param, pageNo: page, pageSize: size });
  }
  return (
    <PageHeaderWrapper>
      <div className={styles.searchWrap}>
        <TableSearch type="client" onSubmit={handleSearch} onAdd={handleAdd} isShowAdd={false} />
      </div>

      <div className={styles.mainWrap}>
        <ITable
          key="access"
          columns={columns}
          data={clientList}
          onChange={handleTable}
        />
      </div>
      <Modal
        title="新增/编辑门禁信息"
        visible={visiable}
        onOk={modalSubmit}
        onCancel={() => setVisiable(false)}
      >
        <Form
          form={form}
          layout="vertical"
          validateMessages={validMeg}
          initialValues={{
            userPhone: editData.userPhone,
            userName: editData.userName,
          }}
        >
          <Form.Item
            label="手机号:"
            name="userPhone"
            rules={[
              {
                required: true,
                message: '请输入手机号',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="姓名:" name="userName">
            <Input className={styles.input} placeholder="请输入姓名" />
          </Form.Item>

        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default Order;

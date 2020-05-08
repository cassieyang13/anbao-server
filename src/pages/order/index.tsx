import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Divider, Modal, Checkbox, Form, Input, Button, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import ITable from '@/components/ITable';
import TableSearch from '@/components/TableSearch';
import { getAccessList, addAccess, editAccess, deleteAccess } from '@/services/equipment';

import { getUserList } from '@/services/client';
import { getOrderList, refund } from '@/services/order';
import moment from 'moment';
import styles from './index.less';

interface IParams {
  orderId: string;
}

const Client: React.FC = () => {
  const [form] = Form.useForm();
  const columns: ColumnProps<any>[] = [
    {
      title: '序号',
      key: 'sortId',
      align: 'center',
      render: (val, _, index) => index + 1,
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      align: 'center',
      render: value => (value === 0 ? '门禁' : '充电')
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      align: 'center',
      render: value => {
        const statusType = {
          create: '订单创建待支付',
          validity: '有效期内',
          expired: '订单过期',
          delete: '删除'
        }
        return statusType[value]
      }
    },
    {
      title: '开始时间',
      dataIndex: 'createtime',
      align: 'center',
    },
    {
      title: '结束时间',
      dataIndex: 'endtime',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'userPhone',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (value: any, record: any) => (
        <div className={styles.actionWrap}>
          <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => handleRefund(record)}>
            退款
          </span>
          {/* <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => handleRefund(record)}>
            已退款
          </span> */}
        </div>
      ),
    },
  ];

  const validMeg = {};
  const [clientList, setClientList] = useState<any[]>([]);
  const [param, setParam] = useState({
    orderType: 1,
    userPhone: '',
    startTime: '2020-01-01 08:00:00',
    endTime: '2020-01-01 08:00:00',
    orderStatus: '',
  });
  const [visiable, setVisiable] = useState(false);
  const [refundInfo, setRefundInfo] = useState<IParams>({
    orderId: '',
  });

  useEffect(() => {
    getOrderData();
  }, [param]);

  function getOrderData() {
    getOrderList(param).then((res: any) => {
      setClientList(res.data);
    });
  }


  function handleRefund (record: any) {
    setRefundInfo({
      orderId: record.orderId
    })
    setVisiable(true)
  }


  function handleTable() {}

  function handleSearch(values: any) {
    console.log(values);
    setParam({
      ...param,
      orderType: values.orderType,
      orderStatus: values.orderStatus,
      userPhone: values.userPhone,
      startTime: moment(values.rangeTime[0]).format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment(values.rangeTime[1]).format('YYYY-MM-DD HH:mm:ss')
    });
  }

  function handleAdd() {
    // setVisiable(true);
  }

  async function modalSubmit() {
    const values = await form.validateFields();
    console.log(values);
    try {
      refund({
        orderId: refundInfo.orderId,
        refundFee: values.refundFee,
      }).then(res => {
        console.log(res)
      })
    } catch (e) {
      console.log(e);
    }
  }


  return (
    <PageHeaderWrapper>
      <div className={styles.searchWrap}>
        <TableSearch type="order" onSubmit={handleSearch} onAdd={handleAdd} />
      </div>

      <div className={styles.mainWrap}>
        <ITable
          key="order"
          columns={columns}
          data={{ list: clientList, pagination: {} }}
          onChange={handleTable}
        />
      </div>
      <Modal
        title="退款金额"
        visible={visiable}
        onOk={modalSubmit}
        onCancel={() => setVisiable(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="退款金额:"
            name="refundFee"
            rules={[
              {
                required: true,
                message: '请输入退款金额',
              },

            ]}
          >
            <Input className={styles.input} placeholder="请输入退款金额" type="number" />
          </Form.Item>

        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default Client;

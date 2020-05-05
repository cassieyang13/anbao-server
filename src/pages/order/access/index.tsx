import React, { useState, useRef, useEffect } from 'react';
import styles from '../index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Divider, Modal, Checkbox, Select, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import ITable from '@/components/ITable';
import TableSearch from '@/components/TableSearch';
import { getAccessList, addAccess, editAccess, deleteAccess } from '@/services/equipment';
import { Form, Input, Button, Col, Row } from 'antd';
import { getUserList } from '@/services/client';
import { getOrderList, refund, updateOrder } from '@/services/order';
import moment from 'moment';

// interface IParams {
//   orderId: string;
// }

const AccessCharge: React.FC = () => {
  const [form] = Form.useForm();
  const [formOrder] = Form.useForm();
  const columns: ColumnProps<any>[] = [
    {
      title: '序号',
      key: 'sortId',
      align: 'center',
      render: (val, _, index) => {
        return index + 1;
      },
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      align: 'center',
      render: value => {
        const orderObj = {
          0: '门禁',
          1: '充电',
          2: '充电+门禁',
        };
        return orderObj[value];
      },
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
          delete: '删除',
        };
        return statusType[value];
      },
    },
    {
      title: '临停押金',
      dataIndex: 'tempPrice',
      align: 'center',
    },
    {
      title: '实体卡押金',
      dataIndex: 'pledgePrice',
      align: 'center',
    },
    {
      title: '总价',
      dataIndex: 'sellingPrice',
      align: 'center',
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
      title: '用户名',
      dataIndex: 'userName',
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
          <span
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={() => handleModify(record)}
          >
            修改
          </span>
          {record.orderStatus === 'validity' ? (
            <>
              <Divider type="vertical" />
              <span
                style={{ color: '#1890ff', cursor: 'pointer' }}
                onClick={() => handleRefund(record)}
              >
                退款
              </span>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  const [clientList, setClientList] = useState<any[]>([]);
  const [param, setParam] = useState({
    orderType: 0,
    userPhone: '',
    startTime: moment()
      .days(-3)
      .format('YYYY-MM-DD HH:mm:ss'),
    endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    orderStatus: 'validity',
  });
  const [visiable, setVisiable] = useState(false);
  const [orderVisiable, setOrderVisiable] = useState(false);
  const [refundInfo, setRefundInfo] = useState<any>({
    orderId: '',
  });
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<any>({});
  const [showCount, setShowCount] = useState<any>({});
  const [showPrice, setShowPrice] = useState<any>({});

  useEffect(() => {
    getOrderData();
  }, [param]);

  function getOrderData() {
    setLoading(true);
    getOrderList(param).then((res: any) => {
      if (res) {
        setLoading(false);
        setClientList(res.data);
      }
    });
  }

  function handleModify(record: any) {
    setEdit({ ...record });

    setShowCount(record.orderType === 2 && record.parkType == 1);
    setShowPrice(record.orderType === 0 && record.parkType == 0);
    formOrder.setFieldsValue({
      parkType: record.parkType,
      orderStatus: record.orderStatus,
      totalCounts: record.totalCounts,
    });

    setOrderVisiable(true);
  }

  function handleTable() {}

  function handleSearch(values: any) {
    console.log(values);
    setParam({
      ...param,
      orderType: 0,
      orderStatus: values.orderStatus ? values.orderStatus : param.orderStatus,
      userPhone: values.userPhone,
      startTime: values.rangeTime
        ? moment(values.rangeTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : param.startTime,
      endTime: values.rangeTime
        ? moment(values.rangeTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : param.endTime,
    });
  }

  function handleRefund(record: any) {
    setRefundInfo({
      ...record,
    });
    // setVisiable(true);

    Modal.confirm({
      title: '提示',
      content: '确认退款？',
      onOk: () => {
        refund({
          orderId: record.orderId,
        }).then(res => {
          console.log(res);
          if (res && res.result) {
            modalSubmit(res.data.refundFee);
          }
        });
      },
    });
  }
  async function modalSubmit(price: any) {
    Modal.confirm({
      title: '提示',
      content: `退款金额为${price}`,
      onOk: () => {
        getOrderData();
      },
    });
    // const values = await form.validateFields();
    // console.log(values);
    // try {
    //   refund({
    //     orderId: refundInfo.orderId,
    //     refundFee: values.refundFee,
    //   }).then(res => {
    //     console.log(res);
    //    setVisiable(false)
    //   });
    // } catch (e) {
    //   console.log(e);
    // }
  }

  function validRefund(rule: any, value: any, callback: any) {
    const { pledgePrice, tempPrice } = refundInfo;
    if (value > pledgePrice + tempPrice) {
      return Promise.reject('退款金额不能大于临停押金和实体卡押金的总和');
    }
    return Promise.resolve();
  }

  async function modifyOrder() {
    const values = await formOrder.validateFields();
    try {
      const response = await updateOrder({
        orderId: edit.orderId,
        orderType: edit.orderType,
        parkType: values.parkType,
        orderStatus: values.orderStatus,
        arrearagePrice: values.arrearagePrice || '',
        nowCounts: values.nowCounts || '',
      });

      if (response) {
        message.success('修改成功');
        getOrderData();
        setOrderVisiable(false);
      }
    } catch (e) {}
  }

  function parkChange(value: any) {
    setShowCount(edit.orderType === 2 && value == 1);
    setShowPrice(edit.orderType === 0 && value == 0);
  }
  return (
    <PageHeaderWrapper>
      <div className={styles.searchWrap}>
        <TableSearch type={'order'} onSubmit={handleSearch} isShowAdd={false} />
      </div>

      <div className={styles.mainWrap}>
        <ITable
          loading={loading}
          key={'order'}
          columns={columns}
          data={{ list: clientList, pagination: {} }}
          onChange={handleTable}
        />
      </div>
      <Modal
        title="退款金额"
        visible={visiable}
        onOk={modalSubmit}
        forceRender
        onCancel={() => setVisiable(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="退款金额（退款金额不能大于临停押金和实体卡押金的总和）:"
            name="refundFee"
            rules={[
              {
                required: true,
                message: '请输入退款金额',
              },
              {
                validator: validRefund,
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入退款金额" type="number" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="修改订单"
        forceRender
        visible={orderVisiable}
        onOk={modifyOrder}
        onCancel={() => setOrderVisiable(false)}
      >
        <Form form={formOrder} layout="vertical">
          <Form.Item
            label="充电/停车类型："
            name="parkType"
            rules={[
              {
                required: true,
                message: '请选择充电/停车类型',
              },
            ]}
          >
            <Select placeholder="请选择充电/停车类型" onChange={parkChange}>
              <Select.Option value={0}>临停</Select.Option>
              <Select.Option value={1}>包月</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="订单状态："
            name="orderStatus"
            rules={[
              {
                required: true,
                message: '请选择订单状态',
              },
            ]}
          >
            <Select placeholder="请选择订单状态">
              <Select.Option value={'create'}>订单创建待支付</Select.Option>
              <Select.Option value={'validity'}>有效期内</Select.Option>
              <Select.Option value={'expired'}>订单过期</Select.Option>
              <Select.Option value={'delete'}>删除</Select.Option>
            </Select>
          </Form.Item>
          {showPrice ? (
            <Form.Item label="临停产生金额:" name="arrearagePrice">
              <Input className={styles.input} placeholder="请输入临停产生金额" type="number" />
            </Form.Item>
          ) : null}
          {showCount ? (
            <>
              <Form.Item label="总次数" name="totalCounts">
                <Input className={styles.input} type="text" disabled />
              </Form.Item>
              <Form.Item label="已使用次数：" name="nowCounts">
                <Input className={styles.input} placeholder="请输入已使用次数" type="number" />
              </Form.Item>{' '}
            </>
          ) : null}
        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default AccessCharge;
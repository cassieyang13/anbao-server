import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Divider, Modal, Checkbox, Select, message, Form, Input, Button, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import ITable from '@/components/ITable';
import TableSearch from '@/components/TableSearch';
import { getAccessList, addAccess, editAccess, deleteAccess } from '@/services/equipment';

import { getUserList } from '@/services/client';
import { getOrderList, refund, updateOrder } from '@/services/order';
import moment from 'moment';
import styles from '../index.less';
import { PaginationProps } from 'antd/lib/pagination';
import { standT } from '@/utils/utils';
import { ITableData, ComitListData } from '@/services/interface';
import { getComitList } from '@/services/village';

interface IParams {
  orderId: string;
}

const OrderCharge: React.FC = () => {
  const [form] = Form.useForm();
  const [formOrder] = Form.useForm();
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
      render: value => (value === 0 ? '门禁' : '充电'),
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
      render: value => {        
        return `${value}元`;
      },
    },
    {
      title: '实体卡押金',
      dataIndex: 'pledgePrice',
      align: 'center',
      render: value => {        
        return `${value}元`;
      },
    },
    {
      title: '总价',
      dataIndex: 'sellingPrice',
      align: 'center',
      render: value => {        
        return `${value}元`;
      },
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
          {record.orderStatus === 'validity' ? (<>
             <Divider type="vertical" />
            <span
              style={{ color: '#1890ff', cursor: 'pointer' }}
              onClick={() => handleRefund(record)}
            >
              退款
            </span></>
          ) : null}

        </div>
      ),
    },
  ];

  const validMeg = {};
  const [chargeOrderList, setOrderList] = useState<ITableData<any>>({list: [], pagination: {}});
  const [param, setParam] = useState({
    pageNo: 1,
    pageSize: 10,
    comitId: null,
    orderType: 1,
    userPhone: '',
    startTime: moment()
      .days(-3)
      .format('YYYY-MM-DD HH:mm:ss'),
    endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    orderStatus: 'validity',
  });
  const [visiable, setVisiable] = useState(false);
  const [refundInfo, setRefundInfo] = useState<IParams>({
    orderId: '',
  });
  const [orderVisiable, setOrderVisiable] = useState(false);

  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<any>({});
  const [showCount, setShowCount] = useState<any>({});
  const [showPrice, setShowPrice] = useState<any>({});
  const [sumPrice, setSumPricee] = useState(0);
  const [comitList, setComitList] = useState<ComitListData[]>([]);
  useEffect(() => {
    getOrderData();
  }, [param]);
  useEffect(() => {
    getComitData();
  }, []);
  function getComitData() {
    getComitList({ name: '', location: '' }).then(res => {
      if (res) {
        setComitList(res.data.communities);
        setParam({
          ...param,
          comitId: res.data.communities[0].comitId,
        })
      }
    });
  }

  function getOrderData() {
    setLoading(true);
    getOrderList(param).then((res: any) => {
      if (res && res.result === 0) {
        setLoading(false);
        // setClientList(res.data);
        const formatData = standT(res.data.chargeOrders, res.data.page);
        setOrderList(formatData);
        setSumPricee(res.data.sumPrice)
      }
    });
  }
  function handleModify(record: any) {
    setEdit({ ...record });

    setShowCount(record.orderType === 2 && Number(record.parkType) === 1);
    setShowPrice(record.orderType === 0 && Number(record.parkType) === 0);
    formOrder.setFieldsValue({
      parkType: record.parkType,
      orderStatus: record.orderStatus,
    });

    setOrderVisiable(true);
  }

  function handleSearch(values: any) {
    console.log(values);
    setParam({
      ...param,
      comitId: values.comitId,
      orderType: 1,
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

  function handleAdd() {
    // setVisiable(true);
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
            modalSubmit(res.data.refundFee)
          }
        });
      }
    })
  }
  async function modalSubmit(price: any) {
    Modal.confirm({
      title: '提示',
      content: `退款金额为${price}`,
      onOk: () => {
        getOrderData()
      }
    })
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
  // async function modalSubmit() {
  //   const values = await form.validateFields();
  //   console.log(values);
  //   try {
  //     refund({
  //       orderId: refundInfo.orderId,
  //       refundFee: values.refundFee,
  //     }).then(res => {
  //       console.log(res);
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
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
        setOrderVisiable(false)
      }
    } catch (e) {
      console.log(e)
    }
  }

  function parkChange(value: any) {
    setShowCount(edit.orderType === 2 && Number(value) === 1);
    setShowPrice(edit.orderType === 0 && Number(value) === 0);
  }

  function handleTable(pagination: PaginationProps) {
    const page = pagination.current || 1;
    const size = pagination.pageSize || 10;
    setParam({ ...param, pageNo: page, pageSize: size });
  }
  return (
    <PageHeaderWrapper>
      <div className={styles.searchWrap}  style={{backgroundColor: '#ffffff'}}>
      <div style={{padding:'20px'}}> 所有充电订单总价： {sumPrice}元</div>
        <TableSearch type="order" onSubmit={handleSearch} comitData={comitList} isShowAdd={false} />
      </div>

      <div className={styles.mainWrap}>
        <ITable
          key="order"
          columns={columns}
          data={chargeOrderList}
          onChange={handleTable}
          loading={loading}
        />
      </div>
      <Modal
        title="退款金额"
        visible={visiable}
        onOk={modalSubmit}
        onCancel={() => setVisiable(false)}
      >
        <Form form={form} layout="vertical">
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
              <Select.Option value="create">订单创建待支付</Select.Option>
              <Select.Option value="validity">有效期内</Select.Option>
              <Select.Option value="expired">订单过期</Select.Option>
              <Select.Option value="delete">删除</Select.Option>
            </Select>
          </Form.Item>
          {showPrice ? (
            <Form.Item label="临停产生金额:" name="arrearagePrice">
              <Input className={styles.input} placeholder="请输入临停产生金额" type="number" />
            </Form.Item>
          ) : null}
          {showCount ? (
            <Form.Item label="已使用次数：" name="nowCounts">
              <Input className={styles.input} placeholder="请输入已使用次数" type="number" />
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default OrderCharge;

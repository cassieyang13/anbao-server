import React, { useState, useRef, useEffect } from 'react';
import styles from '../index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Divider, Modal, Checkbox } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import ITable from '@/components/ITable';
import TableSearch from '@/components/TableSearch';
import { Form, Input, Button, Col, Row } from 'antd';
import { getOrderList, refund } from '@/services/order';
import moment from 'moment';
import { getLogList, getChargeLogList } from '@/services/log';

// interface IParams {
//   orderId: string;
// }

const ChargeLog: React.FC = () => {
  const [form] = Form.useForm();
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
      title: '手机',
      dataIndex: 'userPhone',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      align: 'center',
    },

    {
      title: '设备id',
      dataIndex: 'devId',
      align: 'center',
    },
    {
      title: '订单号',
      dataIndex: 'orderId',
      align: 'center',
    },
    // {
    //   title: '操作',
    //   dataIndex: 'direction',
    //   align: 'center',
    //   render: value => {
    //     return value === 0 ? '进门' : '出门';
    //   },
    // },

  ];

  const [logList, setLogList] = useState<any[]>([]);
  const [param, setParam] = useState({
    devId: 0,
    userPhone: '',
    startTime: moment()
      .days(-3)
      .format('YYYY-MM-DD HH:mm:ss'),
    endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
  });
  const [visiable, setVisiable] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLogData();
  }, [param]);

  function getLogData() {
    setLoading(true);
    getChargeLogList(param).then((res: any) => {
      if (res) {
        setLoading(false);
        setLogList(res.data);
      }
    });
  }

  function handleTable() {}

  function handleSearch(values: any) {
    console.log(values);
    setParam({
      ...param,
      devId: values.devId,
      userPhone: values.userPhone,
      startTime: values.rangeTime
        ? moment(values.rangeTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : param.startTime,
      endTime: values.rangeTime
        ? moment(values.rangeTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : param.endTime,
    });
  }

  async function modalSubmit() {
    const values = await form.validateFields();
    console.log(values);
    try {
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <PageHeaderWrapper>
      <div className={styles.searchWrap}>
        <TableSearch type={'log'} onSubmit={handleSearch} isShowAdd={false} />
      </div>

      <div className={styles.mainWrap}>
        <ITable
          loading={loading}
          key={'log'}
          columns={columns}
          data={{ list: logList, pagination: {} }}
          onChange={handleTable}
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
            label="退款金额（退款金额不能大于临停押金和实体卡押金的总和）:"
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

export default ChargeLog;

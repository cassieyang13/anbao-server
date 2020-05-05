import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, DatePicker, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { createOrder, orderPrice, comitDetail } from '@/services/order';
import moment from 'moment';
import { getComitList } from '@/services/village';
import { ComitListData } from '@/services/interface';

export default function CreateOrder() {
  const [form] = Form.useForm();
  const [param, setParam] = useState({
    devName: '',
    status: '',
    direction: undefined,
    comitId: undefined,
    qrCode: '',
  });
  const [orderType, setOrderType] = useState(0);
  const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 10 },
  };
  const [comitList, setComitList] = useState<ComitListData[]>([]);

  const [endtime, setEndTime] = useState<any>();
  const [vehType, setVehType] = useState<any>();
  const [batType, setBatType] = useState<any>();
  const [comitId, setComitId] = useState<any>();

  const [curVeh, setCurVeh] = useState<any>([]);
  const [parkType, setParkType] = useState<any>();
  const [pledgePrice, setPledgeParice] = useState<any>(0);

  useEffect(() => {
    getComitData();
  }, []);
  function getComitData() {
    getComitList(param).then(res => {
      if (res) {
        setComitList(res.data.communities);
      }
    });
  }
  async function submit() {
    const values = await form.validateFields();

    if (values) {
      const reqParams: any = {};

      // 充电+门禁
      if (values.orderType === 2) {
        reqParams.createTime = moment()
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss');
      }
      console.log({
        ...values,
        ...reqParams,
        endTime: moment(values.endTime).format('YYYY-MM-DD HH:mm:ss'),
      });
      const response = await createOrder({
        ...values,
        ...reqParams,
        endTime: moment(values.endTime)
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss'),
      });
      if (response) {
        message.success('创建成功');

        form.resetFields();
      }
    }
  }

  useEffect(() => {
    if (parkType === 1) {
      if (endtime && vehType && comitId) {
        getPrice();
      }
    } else {
      getTempPrice();
    }
  }, [endtime, vehType, batType, comitId]);

  function getTempPrice() {
    if (vehType) {
      const veh = curVeh.filter((item: any) => {
        return item.vehId === vehType;
      });
      console.log(veh[0].accessPrice);
      console.log(pledgePrice);

      form.setFieldsValue({
        accessPrice: veh[0].accessPrice,
        sellingPrice: veh[0].accessPrice + pledgePrice,
      });
    }
    // 临停
  }

  async function getPrice() {
    const values = await form.getFieldsValue();
    console.log(values);
    // 包月
    if (values.parkType === 1) {
      const priceRes = await orderPrice({
        createtime: moment().format('YYYY-MM-DD'),
        endtime: moment(values.endTime).format('YYYY-MM-DD'),
        vehType: values.vehType,
        comitId: values.comitId,
        batType: values.volt,
      });

      if (priceRes && priceRes.result === 0) {
        const { data } = priceRes;
        form.setFieldsValue({
          sellingPrice: data.sellingPrice,
          accessPrice: data.accessPrice,
        });
      }
    } else {
    }
  }

  async function handleComit(value: any) {
    setComitId(value);
    const formValues = await form.getFieldsValue();

    const res = await comitDetail({ comitId: value });
    if (res) {
      // 包月
      setCurVeh(res.data.community.vehicleList);
      setPledgeParice(res.data.community.pledgePrice);
      if (formValues.parkType === 1) {
        form.setFieldsValue({
          pledgePrice: res.data.community.pledgePrice,
        });
      } else {
        // 临停
        form.setFieldsValue({
          pledgePrice: res.data.community.pledgePrice,
        });
      }
    }
  }

  function disabledDate(current: any) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  function handleParkType(val: any) {
    setParkType(val);
    if (val === 0) {
      setOrderType(0)
      form.setFieldsValue({ orderType: 0 });
    }
  }
  return (
    <PageHeaderWrapper>
      <div style={{ width: '100%', padding: '20px', background: '#fff' }}>
        <Form {...formItemLayout} form={form} layout="horizontal">
          <Form.Item
            label="停车/充电类型:"
            name="parkType"
            rules={[
              {
                required: true,
                message: '请选择停车/充电类型',
              },
            ]}
          >
            <Select placeholder="请选择订单类型" onChange={handleParkType}>
              <Select.Option value={0}>临停</Select.Option>
              <Select.Option value={1}>包月</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="订单类型:"
            name="orderType"
            rules={[
              {
                required: true,
                message: '请选择订单类型',
              },
            ]}
          >
            <Select
              placeholder="请选择订单类型"
              onChange={(value: any) => setOrderType(value)}
              disabled={parkType === 0 ? true : false}
            >
              <Select.Option value={0}>门禁</Select.Option>
              <Select.Option value={2}>充电+门禁</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="选择小区:"
            name="comitId"
            rules={[
              {
                required: true,
                message: '请选择小区',
              },
            ]}
          >
            <Select placeholder="请选择小区" onChange={handleComit}>
              {comitList.map(item => {
                return (
                  <Select.Option key={item.comitId} value={item.comitId}>
                    {item.comitName}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="车辆类型:"
            name="vehType"
            rules={[
              {
                required: true,
                message: '请选择车辆类型',
              },
            ]}
          >
            <Select placeholder="请选择车辆类型" onChange={val => setVehType(val)}>
              {curVeh.map((item: any) => {
                return (
                  <Select.Option key={item.vehId} value={item.vehId}>
                    {item.vehName}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          {parkType === 1 ? (
            <Form.Item label="到期时间:">
              <Form.Item
              noStyle 
                name="endTime"
                rules={[
                  {
                    required: true,
                    message: '请选择到期时间',
                  },
                ]}
              >
                <DatePicker
                  style={{ width: '60%' }}
                  onChange={val => setEndTime(val)}
                  disabledDate={disabledDate}
                />
              </Form.Item>
              <span style={{ color: '#FF0000', marginLeft: '10px' }}>只选择到月底！</span>
            </Form.Item>
          ) : null}

          {/* <Form.Item
            label="订单状态:"
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
          <Form.Item
            label="支付状态:"
            name="payStatus"
            rules={[
              {
                required: true,
                message: '请选择支付状态',
              },
            ]}
          >
            <Select placeholder="请选择支付状态">
              <Select.Option value={'waitpaid'}>等待支付</Select.Option>
              <Select.Option value={'allpaid'}>完成支付</Select.Option>
              <Select.Option value={'refunding'}>发起退款</Select.Option>
              <Select.Option value={'refunded'}>已退款</Select.Option>
            </Select>
          </Form.Item> */}

          <Form.Item
            label="实体卡号:"
            name="cardNo"
            rules={[
              {
                required: true,
                message: '请输入实体卡号',
              },
            ]}
          >
            <Input placeholder="请输入实体卡号" />
          </Form.Item>

          <Form.Item
            label="姓名:"
            name="userName"
            rules={[
              {
                required: true,
                message: '请输入姓名',
              },
            ]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            label="用户手机:"
            name="userPhone"
            rules={[
              {
                required: true,
                message: '请输入用户手机',
              },
            ]}
            
          >
            <Input placeholder="请输入用户手机" />
          </Form.Item>
          <Form.Item
            label="房号:"
            name="userHouse"
            rules={[
              {
                required: true,
                message: '请输入房号',
              },
            ]}
          >
            <Input placeholder="请输入房号" />
          </Form.Item>
          {Number(orderType) === 2 && (vehType === 2 || vehType === 3)? (
            <Form.Item label="电瓶伏数:" name="volt">
              <Select placeholder="请输入电瓶伏数" onChange={val => setBatType(val)}>
                <Select.Option value={'48V'}>48V</Select.Option>
                <Select.Option value={'60V'}>60V</Select.Option>
                <Select.Option value={'72V'}>72V</Select.Option>
              </Select>
            </Form.Item>
          ) : null}
          <Form.Item
            label="押金:"
            name="pledgePrice"
            rules={[
              {
                required: true,
                message: '请输入押金',
              },
            ]}
          >
            <Input placeholder="请输入押金" disabled />
          </Form.Item>
          <Form.Item
            label="单价:"
            name="accessPrice"
            rules={[
              {
                required: true,
                message: '请输入单价',
              },
            ]}
          >
            <Input placeholder="请输入单价" disabled />
          </Form.Item>

          <Form.Item
            label="总价:"
            name="sellingPrice"
            rules={[
              {
                required: true,
                message: '请输入总价',
              },
            ]}
          >
            <Input placeholder="请输入总价" disabled />
          </Form.Item>
        </Form>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Button onClick={submit} type="primary">
            提交
          </Button>
        </div>
      </div>
    </PageHeaderWrapper>
  );
}

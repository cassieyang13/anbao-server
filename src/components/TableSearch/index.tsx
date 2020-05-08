import React from 'react';
import { Form, Input, Button, Col, Row, Select, DatePicker } from 'antd';
import moment from 'moment';
import { ComitListData } from '@/services/interface';

const { RangePicker } = DatePicker;

const styles = require('./index.less');

interface ITableSearch {
  type: string;
  onSubmit: (value: any) => void;
  onAdd?: () => void;
  isShowAdd?: boolean;
  comitData?: ComitListData[];
}

const TableSearch: React.FC<ITableSearch> = (props: ITableSearch) => {
  const [form] = Form.useForm();
  const { onSubmit, onAdd, type, isShowAdd = true, comitData = [] } = props;
  // const { validateFields, getFieldValue } = form;

  async function handleSubmit() {
    const values = await form.validateFields();
    try {
      onSubmit(values);
    } catch (e) {
      console.log(e);
    }
  }

  function renderDom() {
    switch (type) {
      case 'village':
        return renderVillage();
      case 'access':
        return renderAccess();
      case 'charge':
        return renderAccess();
      case 'client':
        return renderClient();
      case 'order':
        return renderOrder();
      case 'log':
        return renderLog();
      default:
        return renderVillage();
    }
  }

  function renderLog() {
    return (
      <Row className={styles.left}>

        <Col span={12}>
          <Form.Item label="设备id:" name="devId">
            <Input className={styles.input} placeholder="请输入设备id" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="时间范围:" name="rangeTime">
            <RangePicker
              showTime
              onChange={pickerChange}
              defaultValue={[moment().days(-3), moment()]}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="手机号:" name="userPhone">
            <Input className={styles.input} placeholder="请输入手机号" type="number" />
          </Form.Item>
        </Col>
      </Row>
    );
  }

  function pickerChange(dates: any) {
    console.log(dates);
  }
  function renderOrder() {
    // form.setFieldsValue({
    //   // orderStatus: 'validity',
    //   orderType: 0,
    //   rangeTime: [moment().days(-3), moment()],
    // });
    return (
      <Row className={styles.left}>
        {/* <Col span={12}>
          <Form.Item label="订单类型:" name="orderType">
            <Select placeholder="请选择订单类型">
              <Select.Option value={0}>门禁</Select.Option>
              <Select.Option value={1}>充电</Select.Option>
            </Select>
          </Form.Item>
        </Col> */}
        <Col span={12}>
          <Form.Item label="订单状态:" name="orderStatus">
            <Select defaultValue="validity" value="validity">
              {/* <Select.Option value={'create'}>订单创建待支付</Select.Option> */}
              <Select.Option value="validity">有效期内</Select.Option>
              <Select.Option value="expired">订单过期</Select.Option>
              {/* <Select.Option value={'delete'}>删除</Select.Option> */}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="时间范围:" name="rangeTime">
            <RangePicker
              showTime
              onChange={pickerChange}
              defaultValue={[moment().days(-3), moment()]}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="手机号:" name="userPhone">
            <Input className={styles.input} placeholder="请输入手机号" type="number" />
          </Form.Item>
        </Col>
      </Row>
    );
  }

  function renderClient() {
    return (
      <Row className={styles.left}>
        <Col span={12}>
          <Form.Item label="手机号:" name="userPhone">
            <Input className={styles.input} placeholder="请输入手机号" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="姓名:" name="userName">
            <Input className={styles.input} placeholder="请输入姓名" />
          </Form.Item>
        </Col>
      </Row>
    );
  }
  function renderVillage() {
    return (
      <Row className={styles.left}>
        <Col span={12}>
          <Form.Item label="小区名称:" name="comitName">
            <Input className={styles.input} placeholder="请输入小区名称" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="地址:" name="comitLocation">
            <Input className={styles.input} placeholder="请输入地址" />
          </Form.Item>
        </Col>
      </Row>
    );
  }

  function renderAccess() {
    return (
      <Row className={styles.left}>
        <Col span={12}>
          <Form.Item label="设备id:" name="devId">
            <Input className={styles.input} placeholder="请输入设备id" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="设备名称:" name="devName">
            <Input className={styles.input} placeholder="请输入设备名称" />
          </Form.Item>
        </Col>
        {
          type === 'charge' ? null : <Col span={12}>
          <Form.Item label="设备类型:" name="accessType">
          <Select placeholder="请选择设备类型">
              <Select.Option value={0}>人脸</Select.Option>
              <Select.Option value={1}>刷卡</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        }

        <Col span={12}>
          <Form.Item label="设备状态:" name="status">
            <Select placeholder="请选择设备状态">
              <Select.Option value={0}>离线</Select.Option>
              <Select.Option value={1}>在线</Select.Option>
            </Select>
            {/* <Input className={styles.input} placeholder="请输入设备状态" /> */}
          </Form.Item>
        </Col>
        {type === 'charge' ? null : (
          <Col span={12}>
            <Form.Item label="门禁设备方向:" name="direction">
              <Select placeholder="请选择门禁设备方向">
                <Select.Option value={0}>进</Select.Option>
                <Select.Option value={1}>出</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        )}
        <Col span={12}>
          <Form.Item label="选择小区:" name="comitId">
          <Select placeholder="请选择小区">
            {
              comitData && comitData.map(item => <Select.Option key={item.comitId} value={item.comitId}>{item.comitName}</Select.Option>)
            }
            </Select>
          </Form.Item>
        </Col>
      </Row>
    );
  }

  async function handleReset() {
    form.resetFields();
    const values = await form.validateFields();

    onSubmit({ ...values });
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 18 },
    },
  };

  return (
    <div className={styles.formWrapper}>
      <Form
        form={form}
        labelAlign="left"
        className={styles.formWrap}
        layout="horizontal"
        {...formItemLayout}
      >
        {renderDom()}
        <div className={styles.right}>
          <Button type="primary" onClick={handleSubmit}>
            查询
          </Button>
          <Button type="default" onClick={handleReset}>
            重置
          </Button>
        </div>
      </Form>
      {isShowAdd ? (
        <Button className={styles.newBtn} type="primary" onClick={onAdd}>
          新增
        </Button>
      ) : null}
    </div>
  );
};

export default TableSearch;

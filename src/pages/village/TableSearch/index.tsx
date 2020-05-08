import React from 'react';
import { Form, Input, Button, Col, Row } from 'antd';

import moment from 'moment';

const styles = require('./index.less');

interface ITableSearch {
  type: string;
  onSubmit: (value: any) => void;
  onAdd: () => void;
}

const TableSearch: React.FC<ITableSearch> = (props: ITableSearch) => {
  const [form] = Form.useForm();
  const { onSubmit, onAdd, type } = props;
  // const { validateFields, getFieldValue } = form;

  async function handleSubmit() {
    const values = await form.validateFields()
    try {
      onSubmit(values)
    } catch (e) {
      console.log(e);
    }
  }

  function renderDom() {
    switch (type) {
      case 'village':
        return renderVillage();
      default:
        return renderVillage();
    }
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

  function handleReset() {
    form.resetFields();
    onSubmit({});
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 16 },
    },
  };

  return (
    <div className={styles.formWrapper}>
      <Form form={form} labelAlign="left" className={styles.formWrap} layout="horizontal" {...formItemLayout}>
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
      <Button className={styles.newBtn} type="primary" onClick={onAdd}>
        新增
      </Button>
    </div>
  );
};

export default TableSearch;

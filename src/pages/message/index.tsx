import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import { Form, Input, Button, message } from 'antd';
import { getBannerShow, setBanner } from '@/services/message';

const Message: React.FC = () => {
  const [form] = Form.useForm();
  const [banner, setMessage] = useState('');

  useEffect(() => {
    getBanner();
  }, []);

  async function getBanner() {
    const res = await getBannerShow();
    if (res && res.result === 0) {
      setMessage(res.msg);
    }
  }

  async function submit() {
    const values: any = await form.validateFields();
    if (values) {
      const { banner } = values;

      const response = await setBanner({ banner });

      if(response && response.result === 0) {
          message.success('修改成功');
          getBanner()
      }
    }
  }
  return (
    <PageHeaderWrapper>
      <div className={styles.mainWrap}>
        <div className={styles.text}>当前消息通知：{banner}</div>

        <Form form={form} layout="horizontal">
          <Form.Item
            label="消息通知:"
            name="banner"
            rules={[
              {
                required: true,
                message: '请输入消息通知',
              },
            ]}
          >
            <Input style={{width: '500px'}} className={styles.input} placeholder="请输入消息通知" type="text" />
          </Form.Item>
        </Form>
        <Button type="primary" onClick={submit}>
          提交
        </Button>
      </div>
    </PageHeaderWrapper>
  );
};

export default Message;

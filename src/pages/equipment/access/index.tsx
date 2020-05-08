import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Divider, Modal, Checkbox, Select, Form, Input, Button, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import TableSearch from '@/components/TableSearch';
import { getAccessList, addAccess, editAccess, deleteAccess } from '@/services/equipment';

import { ComitListData } from '@/services/interface';
import { getComitList } from '@/services/village';
import ITable from '../../../components/ITable';
import styles from './index.less';

interface IParams {
  devName: string;
  status: string;
  direction: number | undefined;
  comitId: number | undefined;
  qrCode: string;
  devId?: number | undefined;
  accessType: number | undefined;
}

const Equipment: React.FC = () => {
  const [form] = Form.useForm();
  const columns: ColumnProps<any>[] = [
    {
      title: '序号',
      key: 'sortId',
      align: 'center',
      render: (val, _, index) => index + 1,
    },
    {
      title: '设备id',
      dataIndex: 'devId',
      align: 'center',
    },
    {
      title: '设备名称',
      dataIndex: 'devName',
      align: 'center',
    },
    {
      title: '设备类型',
      dataIndex: 'accessType',
      align: 'center',
      render: value => (value === 0 ? '人脸' : '刷卡'),
    },
    {
      title: '设备状态',
      dataIndex: 'status',
      align: 'center',
      render: value => (value === '0' ? '离线' : '在线'),
    },
    {
      title: '小区id',
      dataIndex: 'comitId',
      align: 'center',
    },
    {
      title: '门禁设备方向',
      dataIndex: 'direction',
      align: 'center',
      render: value => (value === 0 ? '进' : '出'),
    },
    // {
    //   title: '二维码',
    //   dataIndex: 'qrCode',
    //   align: 'center',
    // },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (value: any, record: any) => (
        <div className={styles.actionWrap}>
          <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => handleEdit(record)}>
            编辑
          </span>
          <Divider type="vertical" />
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
  const [AccessList, setAccessList] = useState<any[]>([]);
  const [param, setParam] = useState({
    devName: '',
    status: '',
    accessType: 0,
    direction: undefined,
    comitId: undefined,
    qrCode: '',
  });
  const [visiable, setVisiable] = useState(false);
  const [editData, setEditData] = useState<IParams>({
    devName: '',
    status: '',
    direction: undefined,
    comitId: undefined,
    qrCode: '',
    devId: undefined,
    accessType: undefined,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [comitList, setComitList] = useState<ComitListData[]>([]);
  const [comitParam, setComitParam] = useState({
    name: '',
    location: '',
  });
  useEffect(() => {
    getAccessData();
  }, [param]);

  useEffect(() => {
    getComitData();
  }, []);

  function getComitData() {
    getComitList(comitParam).then(res => {
      if (res) {
        setComitList(res.data.communities);
      }
    });
  }
  function getAccessData() {
    getAccessList(param).then((res: any) => {
      if (res) {
        setAccessList(res.data.accessDevices);
      }
    });
  }

  function handleEdit(record: any) {
    setIsEdit(true);
    console.log(record);
    form.setFieldsValue({
      devId: record.devId,
      devName: record.devName,
      status: record.status,
      direction: record.direction,
      comitId: record.comitId,
      qrCode: record.qrCode,
      accessType: record.accessType,
    });

    setEditData({
      devId: record.devId,
      devName: record.devName,
      status: record.status,
      direction: record.direction,
      comitId: record.comitId,
      qrCode: record.qrCode,
      accessType: record.accessType,
    });
    setVisiable(true);
  }

  function handleDelete(record: any) {
    console.log(record);

    Modal.confirm({
      title: '确认删除？',
      onOk: () => {
        deleteAccess({
          devId: record.devId,
        }).then((res: any) => {
          console.log(res);
          getAccessData();
        });
      },
    });
  }

  function handleTable() {}

  function handleSearch(values: any) {
    console.log(values);
    setParam({
      ...param,
      ...values,
    });
  }

  function handleAdd() {
    setVisiable(true);
    setIsEdit(false);
  }

  async function modalSubmit() {
    const values = await form.validateFields();

    try {
      if (isEdit) {
        console.log({
          ...values,
          comitId: values.comitId,
          devId: editData.devId,
          direction: Number(values.direction),
          accessType: Number(values.accessType),
        });
        // 编辑
        editAccess({
          ...values,
          status: 0,
          comitId: values.comitId,
          devId: editData.devId,
          direction: Number(values.direction),
          accessType: Number(values.accessType),
        }).then((res: any) => {
          getAccessData();
          form.resetFields();
          setVisiable(false);
        });
      } else {
        // 新增
        addAccess({
          ...values,
          comitId: Number(values.comitId),
          direction: Number(values.direction),
          status: 0,
        }).then((res: any) => {
          getAccessData();
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
  return (
    <PageHeaderWrapper>
      <div className={styles.searchWrap}>
        <TableSearch type="access" comitData={comitList} onSubmit={handleSearch} onAdd={handleAdd} />
      </div>

      <div className={styles.mainWrap}>
        <ITable
          key="access"
          columns={columns}
          data={{ list: AccessList, pagination: {} }}
          onChange={handleTable}
        />
      </div>
      <Modal
        title="新增/编辑门禁信息"
        visible={visiable}
        forceRender
        onOk={modalSubmit}
        onCancel={() => setVisiable(false)}
      >
        <Form form={form} layout="vertical" validateMessages={validMeg}>
          <Form.Item
            label="设备id:"
            name="devId"
            rules={[
              {
                required: true,
                message: '请输入设备id',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入设备id" disabled={isEdit} />
          </Form.Item>
          <Form.Item
            label="设备名称:"
            name="devName"
            rules={[
              {
                required: true,
                message: '请输入设备名称',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item label="门禁设备类型:" name="accessType" >
            <Select placeholder="请选择门禁设备类型" disabled={isEdit}>
              <Select.Option value={0}>人脸</Select.Option>
              <Select.Option value={1}>刷卡</Select.Option>
            </Select>
          </Form.Item>
          {/* <Form.Item label="设备状态:" name="status">
            <Select placeholder="请输入设备状态">
              <Select.Option value={'0'}>离线</Select.Option>
              <Select.Option value={'1'}>在线</Select.Option>
            </Select>

          </Form.Item> */}

          <Form.Item label="门禁设备方向:" name="direction">
            <Select placeholder="请选择门禁设备方向">
              <Select.Option value={0}>进</Select.Option>
              <Select.Option value={1}>出</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="选择小区:" name="comitId">
          <Select placeholder="请选择小区">
            {
              comitList.map(item => <Select.Option key={item.comitId} value={item.comitId}>{item.comitName}</Select.Option>)
            }
            </Select>
          </Form.Item>
          {/* <Form.Item label="二维码:" name="qrCode">
            <Input className={styles.input} placeholder="请输入二维码链接" />
          </Form.Item> */}
        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default Equipment;

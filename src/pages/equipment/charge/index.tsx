import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Divider, Modal, Checkbox, message, Select, Form, Input, Button, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import TableSearch from '@/components/TableSearch';
import { getChargeList, addCharge, editCharge, deleteCharge } from '@/services/equipment';

import { getComitList, comitQrCode } from '@/services/village';
import { ComitListData } from '@/services/interface';
import ImageComponents from '@/components/Image';
import ITable from '../../../components/ITable';
import styles from './index.less';


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
      title: '设备10进制id',
      dataIndex: 'devId10',
      align: 'center',
    },
    {
      title: '设备名称',
      dataIndex: 'devName',
      align: 'center',
    },
    {
      title: '设备状态',
      dataIndex: 'status',
      align: 'center',
      render: value => (value === '0' ? '离线' : '在线'),
    },
    
    {
      title: '充电二维码',
      dataIndex: 'qrCode',
      key: 'qrCode',
      align: 'center',
      render: (value: any) => (value ? <ImageComponents src={value} isPreview style={{ width: '50px', height: '50px' }} /> : null),
    },

    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (value: any, record: any) => (
        <div className={styles.actionWrap}>
          {/* <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => handleEdit(record)}>
            查看
          </span>
          <Divider type="vertical" /> */}
          <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => handleEdit(record)}>
            编辑二维码
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
  const [ChargeList, setChargeList] = useState<any[]>([]);
  const [param, setParam] = useState({
    devName: '',
    status: '',
    direction: undefined,
    comitId: undefined,
    qrCode: '',
  });
  const [visiable, setVisiable] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState<any>({
    devId: undefined,
    comitId: undefined,
  });
  const [comitList, setComitList] = useState<ComitListData[]>([]);
  const [comitParam, setComitParam] = useState({
    name: '',
    location: '',
  });
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    getChargeData();
  }, [param]);

  useEffect(() => {
    getComitData();
  }, []);

  function getComitData() {
    getComitList(comitParam).then(res => {
      if (res) {
        setComitList(res.data.communities);
        setParam({
          ...param,
          comitId: res.data.communities[0].comitId,
        })
      }
    });
  }
  function getChargeData() {
    getChargeList(param).then((res: any) => {
      if (res) {
        setChargeList(res.data.chargeDevices);
      }
    });
  }

  function handleEdit(record: any) {
    form.setFieldsValue({
      devName: record.devName,
      status: record.status,
      devId10: record.devId,
      comitId: record.comitId,
      qrCode: record.qrCode,
    })

    setQrCode(record.qrCode)
    setEditData({
      devId: record.devId,
      devId10: record.devId10,
      devName: record.devName,
      status: record.status,
      comitId: record.comitId,
      qrCode: record.qrCode,
    });
    setVisiable(true);
    setIsEdit(true)
  }

  function handleDelete(record: any) {
    console.log(record);

    Modal.confirm({
      title: '确认删除？',
      onOk: () => {
        deleteCharge({
          devId: record.devId,
        }).then((res: any) => {
          console.log(res);
          if (res.result === 0) {
            getChargeData()
            message.success('删除成功')
          }
        });
      },
    });
  }

  function handleTable() { }

  function handleSearch(values: any) {
    console.log(values);
    setParam({
      ...param,
      ...values,
    });
  }

  function handleAdd() {
    setVisiable(true);
    setIsEdit(false)
  }

  async function modalSubmit() {
    // if (isEdit) {
    //   message.info('当前只能查看，不可修改！')
    //   return;
    // }
    const values = await form.validateFields();
    console.log(values);
    try {
      if (isEdit) {
        // 编辑
        editCharge({
          ...values,
          comitId: Number(values.comitId),
          devId: editData.devId,
          qrCode,
        }).then((res: any) => {
          getChargeData();
          form.resetFields();
          setVisiable(false);
          setIsEdit(false)
        });
      } else {
        // 新增
        addCharge({
          ...values,
          status: 0,
          comitId: Number(values.comitId),
          // devId10: values.devId,
        }).then((res: any) => {
          console.log(res)
          getChargeData();
          form.resetFields();
          setVisiable(false);
          setIsEdit(false)
        });
      }
    } catch (e) {
      console.log(e);
    }
  }


  function validDevId(value: any, callback: any) {
    if (value.length !== 8) {
      callback('输入8位数的id')
    }
    callback()
  }

  async function handleQrCode(type: string) {
    const res = await comitQrCode({ comitId: editData.comitId, type, devId: editData.devId });
    if (res && res.result === 0) {
      setQrCode(res.data.qrcodePath);
      message.success('生成成功')
    }
  }
  return (
    <PageHeaderWrapper>
      <div className={styles.searchWrap}>
        <TableSearch type="charge" defaultData={param} comitData={comitList} onSubmit={handleSearch} onAdd={handleAdd} />
      </div>

      <div className={styles.mainWrap}>
        <ITable
          key="access"
          columns={columns}
          data={{ list: ChargeList, pagination: {} }}
          onChange={handleTable}
        />
      </div>
      <Modal
        title="新增充电信息"
        visible={visiable}
        onOk={modalSubmit}
        onCancel={() => { setVisiable(false); setIsEdit(false) }}

      >
        <Form
          form={form}
          layout="vertical"
          validateMessages={validMeg}
        >
          <Form.Item
            label="设备id:"
            name="devId10"
            rules={[
              {
                required: true,
                message: '请输入设备id',
              },
              // {
              //   validator: validDevId
              // }
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
            <Input className={styles.input} placeholder="请输入设备名称" disabled={isEdit} />
          </Form.Item>

          {/* <Form.Item label="设备状态:" name="status"
          rules={[
            {
              required: true,
              message: '请输入设备状态',
            },
          ]}>
            <Select placeholder="请选择设备状态">
              <Select.Option value={'0'}>离线</Select.Option>
              <Select.Option value={'1'}>在线</Select.Option>
            </Select>

          </Form.Item> */}

          <Form.Item label="选择小区:" name="comitId"
            rules={[
              {
                required: true,
                message: '请输入选择小区',
              },
            ]}>
            <Select placeholder="请选择小区" disabled={isEdit}>
              {
                comitList.map(item => <Select.Option key={item.comitId} value={item.comitId}>{item.comitName}</Select.Option>)
              }
            </Select>
          </Form.Item>
          {
            isEdit ? <Form.Item label="二维码:" >
              <ImageComponents canDelete src={qrCode} isPreview onQrCode={() => handleQrCode('charge')} onDelete={() => setQrCode('')} />
            </Form.Item> : null
          }

        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default Equipment;

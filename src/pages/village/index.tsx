import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Divider, Modal, Checkbox, message, Form, Input, Button, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { getComitList, addComit, eitComit, deleteComit, comitQrCode } from '@/services/village';

import { ITableData, ComitListData } from '@/services/interface';
import ImageComponents from '@/components/Image';
import TableSearch from './TableSearch';
import ITable from '../../components/ITable';
import styles from './index.less';

interface IParams {
  comitName: string;
  comitLocation: string;
  vehicleIds: any[];
  pledgePrice: number | string;
  openType: any[];
  tempPrice: number | string;
  comitId: number;
}

const Village: React.FC = () => {
  const [form] = Form.useForm();
  const columns: ColumnProps<any>[] = [
    {
      title: '序号',
      key: 'sortId',
      align: 'center',
      render: (val, _, index) => index + 1,
    },
    {
      title: '小区名称',
      dataIndex: 'comitName',
      key: 'comitName',
      align: 'center',
    },
    {
      title: '地址',
      dataIndex: 'comitLocation',
      key: 'comitLocation',
      align: 'center',
    },
    {
      title: '开门类型',
      dataIndex: 'openType',
      key: 'openType',
      align: 'center',
      render: (value: any) => value.map((item: any) => (
            <span key={`open${item}`}>{item === '0' ? '微信扫码/人脸识别' : '实体卡'}&nbsp;</span>
          )),
    },
    {
      title: '实体卡押金',
      dataIndex: 'pledgePrice',
      key: 'pledgePrice',
      align: 'center',
    },
    {
      title: '临停押金',
      dataIndex: 'tempPrice',
      key: 'tempPrice',
      align: 'center',
    },
    // {
    //   title: '区域联系人',
    //   dataIndex: 'project_user',
    //   key: 'project_user',
    //   align: 'center',
    // },
    // {
    //   title: '3月折扣',
    //   dataIndex: 'tempPrice',
    //   key: 'tempPrice',
    //   align: 'center',
    // },
    // {
    //   title: '6月折扣',
    //   dataIndex: 'tempPrice',
    //   key: 'tempPrice',
    //   align: 'center',
    // },
    {
      title: '车辆类型',
      dataIndex: 'vehicleList',
      align: 'center',
      render: (value: any) => value.map((item: any) => <span key={`veh${item.vehId}`}>{item.vehName}&nbsp;</span>),
    },
    {
      title: '小区二维码',
      dataIndex: 'qrCode',
      key: 'qrCode',
      align: 'center',
      render: (value: any) => (value ? <ImageComponents src={value} isPreview style={{ width: '50px', height: '50px' }} /> : null),
    },
    {
      title: '小区退款二维码',
      dataIndex: 'qrCodeRefund',
      key: 'qrCodeRefund',
      align: 'center',
      render: (value: any) => (value ? <ImageComponents src={value} isPreview style={{ width: '50px', height: '50px' }} /> : null),
    },
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
  const [comitList, setComitList] = useState<ComitListData[]>([]);
  const [param, setParam] = useState({
    name: '',
    location: '',
  });
  const [visiable, setVisiable] = useState(false);
  const [editData, setEditData] = useState<IParams>({
    comitName: '',
    comitLocation: '',
    vehicleIds: [],
    pledgePrice: '',
    openType: [],
    tempPrice: '',
    comitId: 0,
  });
  const [loading, setLoading] = useState(false);
  // const [haveQrCode, setQrCode] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [qrCodeRefund, setQrCodeRefund] = useState('');
  const [vehTypeArr, setVehTypeArr] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    console.log(window.document.location.href);
    console.log(window.document.location.pathname);
    getComitData();
  }, [param]);

  function getComitData() {
    setLoading(true);
    getComitList(param).then(res => {
      if (res) {
        setLoading(false);
        setComitList(res.data.communities);
      }
    });
  }

  useEffect(() => {
    console.log(editData);
    if (editData.comitId !== 0) {
      setVisiable(true);
    }
  }, [editData]);

  function handleEdit(record: any) {
    let bicyclePrice = 0;
    let batPrice = 0;
    let triPrice = 0;
    let motoPrice = 0;
    const { batteryList } = record;
    setIsEdit(true)

    const vehicleIdsArr = record.vehicleList.map((item: any) => {
      if (item.vehName === '自行车') {
        bicyclePrice = item.accessPrice;
      } else if (item.vehName === '电瓶车') {
        batPrice = item.accessPrice;
      } else if (item.vehName === '三轮车') {
        triPrice = item.accessPrice;
      } else {
        motoPrice = item.accessPrice;
      }
      return item.vehId;
    });

    if (record.qrCode) {
      setQrCode(record.qrCode);
    } else {
      setQrCode('');
    }
    if (record.qrCodeRefund) {
      setQrCodeRefund(record.qrCodeRefund)
    } else {
      setQrCodeRefund('')
    }

    setVehTypeArr([...vehicleIdsArr]);
    form.setFieldsValue({
      comitName: record.comitName,
      comitLocation: record.comitLocation,
      openType: record.openType,
      vehicleIds: vehicleIdsArr,
      pledgePrice: record.pledgePrice,
      tempPrice: record.tempPrice,
      comitId: record.comitId,
      discount12: record.discount12,
      discount3: record.discount3,
      discount6: record.discount6,
      projectUser: record.projectUser,
      projectPhone: record.projectPhone,
      bicyclePrice,
      batPrice,
      triPrice,
      motoPrice,
      bat48Price: batteryList[0] && batteryList[0].tempPrice,
      bat48PriceMonth: batteryList[0] && batteryList[0].countPrice,
      bat60Price: batteryList[1] && batteryList[1].tempPrice,
      bat60PriceMonth: batteryList[1] && batteryList[1].countPrice,
      bat72Price: batteryList[2] && batteryList[2].tempPrice,
      bat72PriceMonth: batteryList[2] && batteryList[2].countPrice,
    });
    setEditData({
      comitName: record.comitName,
      comitLocation: record.comitLocation,
      openType: record.openType,
      vehicleIds: vehicleIdsArr,
      pledgePrice: record.pledgePrice,
      tempPrice: record.tempPrice,
      comitId: record.comitId,
    });
  }

  function handleDelete(record: any) {
    Modal.confirm({
      title: '确认删除？',
      onOk: () => {
        deleteComit({
          comitId: record.comitId,
        }).then(res => {
          console.log(res);
        });
      },
    });
  }

  function handleTable() { }

  function handleSearch(values: any) {
    console.log(values);
    setParam({
      ...param,
      name: values.comitName,
      location: values.comitLocation,
    });
  }

  function handleAdd() {
    form.resetFields();
    form.setFieldsValue({});
    setIsEdit(false)
    setVisiable(true);
    setQrCode('');
    setQrCodeRefund('')
  }

  async function modalSubmit() {
    console.log(editData);
    const values = await form.validateFields();

    const vehicleList = [];

    if (values.bicyclePrice) {
      vehicleList.push({
        vehId: 1,
        accessPrice: Number(values.bicyclePrice),
      });
    }
    if (values.batPrice) {
      vehicleList.push({
        vehId: 2,
        accessPrice: Number(values.batPrice),
      });
    }
    if (values.triPrice) {
      vehicleList.push({
        vehId: 3,
        accessPrice: Number(values.triPrice),
      });
    }
    if (values.motoPrice) {
      vehicleList.push({
        vehId: 4,
        accessPrice: Number(values.motoPrice),
      });
    }
    const batteryList = [
      {
        batId: 1,
        tempPrice: Number(values.bat48Price),
        countPrice: Number(values.bat48PriceMonth),
      },
      {
        batId: 2,
        tempPrice: Number(values.bat60Price),
        countPrice: Number(values.bat60PriceMonth),
      },
      {
        batId: 3,
        tempPrice: Number(values.bat72Price),
        countPrice: Number(values.bat72PriceMonth),
      },
    ];

    const reqParams = {
      comitName: values.comitName,
      comitLocation: values.comitLocation,
      openType: values.openType,
      pledgePrice: Number(values.pledgePrice),
      tempPrice: Number(values.tempPrice),
      vehicleList,
      batteryList,
      discount3: values.discount3,
      discount6: values.discount6,
      discount12: values.discount12,
      projectUser: values.projectUser,
      projectPhone: values.projectPhone,
    };
    try {
      if (isEdit) {
        // 编辑
        eitComit({
          ...reqParams,
          comitId: editData.comitId,
          qrCode,
          qrCodeRefund,
        }).then(res => {
          if (res.result === 0) {
            getComitData();
            setVisiable(false);
            form.resetFields();
          }
        });
      } else {
        // 新增
        addComit({
          ...reqParams,
        }).then(res => {
          if (res.result === 0) {
            getComitData();
            setVisiable(false);
            form.resetFields();
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  function openTypeChange(value: any) {
    console.log(value);
  }

  function vehicleChange(value: any[]) {
    console.log(value);
    setVehTypeArr(value);
  }

  async function handleQrCode(type: string) {
    const res = await comitQrCode({ comitId: editData.comitId, type });
    if (res && res.result === 0) {
      if (type === 'access') {
        setQrCode(res.data.qrcodePath);
      } else {
        setQrCodeRefund(res.data.qrcodePath);
      }
      message.success('生成成功')
    }
  }

  const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
  };
  return (
    <PageHeaderWrapper>
      <div className={styles.searchWrap}>
        <TableSearch type="village" onSubmit={handleSearch} onAdd={handleAdd} />
      </div>

      <div className={styles.mainWrap}>
        <ITable
          loading={loading}
          key="village"
          columns={columns}
          data={{ list: comitList, pagination: {} }}
          onChange={handleTable}
        />
      </div>
      <Modal
        getContainer={false}
        forceRender
        title="新增/编辑小区信息"
        visible={visiable}
        onOk={modalSubmit}
        onCancel={() => {
          setVisiable(false);
          form.setFieldsValue({});
        }}
        destroyOnClose
        width={600}
      >
        <Form {...formItemLayout} form={form} layout="horizontal">
          <Form.Item
            label="小区名称:"
            name="comitName"
            rules={[
              {
                required: true,
                message: '请输入小区名称',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入小区名称" />
          </Form.Item>
          <Form.Item
            label="地址:"
            name="comitLocation"
            rules={[
              {
                required: true,
                message: '请输入地址',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入地址" />
          </Form.Item>
          <Form.Item
            label="开门类型:"
            name="openType"
            rules={[
              {
                required: true,
                message: '请选择开门类型',
              },
            ]}
          >
            <Checkbox.Group style={{ width: '100%' }} onChange={openTypeChange}>
              <Row>
                <Col span={12}>
                  <Checkbox value="0">微信扫码/人脸识别</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="1">实体卡</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            label="实体卡押金:"
            name="pledgePrice"
            rules={[
              {
                required: true,
                message: '请输入实体卡押金',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入实体卡押金" />
          </Form.Item>
          <Form.Item
            label="临停押金:"
            name="tempPrice"
            rules={[
              {
                required: true,
                message: '请输入临停押金',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入临停押金" />
          </Form.Item>
          <Form.Item
            label="车辆类型:"
            name="vehicleIds"
            rules={[
              {
                required: true,
                message: '请选择车辆类型',
              },
            ]}
          >
            <Checkbox.Group style={{ width: '100%' }} onChange={vehicleChange}>
              <Row>
                <Col span={6}>
                  <Checkbox value={1}>自行车</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value={2}>电瓶车</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value={4}>三轮车</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value={3}>摩托车</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          {vehTypeArr.includes(1) ? (
            <Form.Item
              label="自行车停车金额:"
              name="bicyclePrice"
              rules={[
                {
                  required: true,
                  message: '请输入自行车停车金额',
                },
              ]}
            >
              <Input className={styles.input} placeholder="请输入自行车停车金额" />
            </Form.Item>
          ) : null}
          {vehTypeArr.includes(2) ? (
            <Form.Item
              label="电瓶车停车金额:"
              name="batPrice"
              rules={[
                {
                  required: true,
                  message: '请输入电瓶车停车金额',
                },
              ]}
            >
              <Input className={styles.input} placeholder="请输入电瓶车停车金额" />
            </Form.Item>
          ) : null}
          {vehTypeArr.includes(4) ? (
            <Form.Item
              label="三轮车停车金额:"
              name="triPrice"
              rules={[
                {
                  required: true,
                  message: '请输入三轮车停车金额',
                },
              ]}
            >
              <Input className={styles.input} placeholder="请输入三轮车停车金额" />
            </Form.Item>
          ) : null}
          {vehTypeArr.includes(3) ? (
            <Form.Item
              label="摩托车停车金额:"
              name="motoPrice"
              rules={[
                {
                  required: true,
                  message: '请输入摩托车停车金额',
                },
              ]}
            >
              <Input className={styles.input} placeholder="请输入摩托车停车金额" />
            </Form.Item>
          ) : null}
          <Form.Item
            label="48V电瓶临时充电单价:"
            name="bat48Price"
            rules={[
              {
                required: true,
                message: '请输入48V电瓶临时充电单价',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入48V电瓶临时充电单价" />
          </Form.Item>
          <Form.Item
            label="48V电瓶包月单次单价 :"
            name="bat48PriceMonth"
            rules={[
              {
                required: true,
                message: '请输入48V电瓶包月单次单价',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入48V电瓶包月单次单价" />
          </Form.Item>
          <Form.Item
            label="60V电瓶临时充电单价:"
            name="bat60Price"
            rules={[
              {
                required: true,
                message: '请输入60V电瓶临时充电单价',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入60V电瓶临时充电单价" />
          </Form.Item>
          <Form.Item
            label="60V电瓶包月单次单价:"
            name="bat60PriceMonth"
            rules={[
              {
                required: true,
                message: '请输入60V电瓶包月单次单价',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入60V电瓶包月单次单价" />
          </Form.Item>
          <Form.Item
            label="72V电瓶临时充电单价:"
            name="bat72Price"
            rules={[
              {
                required: true,
                message: '请输入72V电瓶临时充电单价',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入72V电瓶临时充电单价" />
          </Form.Item>
          <Form.Item
            label="72V电瓶包月单次单价:"
            name="bat72PriceMonth"
            rules={[
              {
                required: true,
                message: '请输入72V电瓶包月单次单价',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入72V电瓶包月单次单价" />
          </Form.Item>
          <Form.Item
            label="3个月折扣:"
            name="discount3"
            rules={[
              {
                required: true,
                message: '请输入3个月折扣',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入3个月折扣，例：95即为95折" />
          </Form.Item>
          <Form.Item
            label="6个月折扣:"
            name="discount6"
            rules={[
              {
                required: true,
                message: '请输入6个月折扣',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入6个月折扣" />
          </Form.Item>
          <Form.Item
            label="12个月折扣:"
            name="discount12"
            rules={[
              {
                required: true,
                message: '请输入12个月折扣',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入12个月折扣" />
          </Form.Item>
          <Form.Item
            label="区域联系人:"
            name="projectUser"
            rules={[
              {
                required: true,
                message: '请输入区域联系人',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入区域联系人" />
          </Form.Item>
          <Form.Item
            label="联系人电话:"
            name="projectPhone"
            rules={[
              {
                required: true,
                message: '请输入联系人电话',
              },
            ]}
          >
            <Input className={styles.input} placeholder="请输入联系人电话" />
          </Form.Item>
          {isEdit ? (
            <>
              <Form.Item label="小区二维码:" >
                <ImageComponents canDelete src={qrCode} isPreview onQrCode={() => handleQrCode('access')} onDelete={() => setQrCode('')}/>
              </Form.Item>
              <Form.Item label="小区退款二维码:" >
                <ImageComponents canDelete src={qrCodeRefund} isPreview onQrCode={() => handleQrCode('refund')} onDelete={() => setQrCodeRefund('')} />
              </Form.Item>
            </>
          ) : null}
        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default Village;

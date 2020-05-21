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
      render: (value: any) =>
        value.map((item: any) => (
          <span key={`open${item}`}>{item === '0' ? '微信扫码/人脸识别' : '实体卡'}&nbsp;</span>
        )),
    },
    {
      title: '实体卡押金',
      dataIndex: 'pledgePrice',
      key: 'pledgePrice',
      align: 'center',
      render: value => {
        return `${value}元`;
      },
    },
    {
      title: '临停押金',
      dataIndex: 'tempPrice',
      key: 'tempPrice',
      align: 'center',
      render: value => {
        return `${value}元`;
      },
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
      render: (value: any) =>
        value.map((item: any) => <span key={`veh${item.vehId}`}>{item.vehName}&nbsp;</span>),
    },
    {
      title: '小区二维码',
      dataIndex: 'qrCode',
      key: 'qrCode',
      align: 'center',
      render: (value: any) =>
        value ? (
          <ImageComponents src={value} isPreview style={{ width: '50px', height: '50px' }} />
        ) : null,
    },
    {
      title: '小区退款二维码',
      dataIndex: 'qrCodeRefund',
      key: 'qrCodeRefund',
      align: 'center',
      render: (value: any) =>
        value ? (
          <ImageComponents src={value} isPreview style={{ width: '50px', height: '50px' }} />
        ) : null,
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
    let bicyclePriceMonth = 0;
    let batPriceMonth = 0;
    let batChargePrice = 0;
    let triPriceMonth = 0;
    let triChargePrice = 0;
    let motoPriceMonth = 0;
    const { batteryList } = record;
    setIsEdit(true);
    let bat48Price = 0;
    let bat60Price = 0;
    let bat72Price = 0;
    let triChargePriceMonth = 0;

    const vehicleIdsArr = record.vehicleList.map((item: any) => {
      if (item.vehName === '自行车') {
        bicyclePrice = item.accessPrice;
        bicyclePriceMonth = item.monthAccessPrice;
      } else if (item.vehName === '电瓶车') {
        batPrice = item.accessPrice;
        batPriceMonth = item.monthAccessPrice
        batChargePrice = item.chargePrice
      } else if (item.vehName === '三轮车') {
        triPrice = item.accessPrice;
        triPriceMonth = item.monthAccessPrice;
        triChargePrice = item.chargePrice;
      } else {
        motoPrice = item.accessPrice;
        motoPriceMonth = item.monthAccessPrice;
      }
      return item.vehId;
    });

    const batIdArr = record.batteryList.map((batItem: any) => {
      if (batItem.batId === 1) {
        bat48Price = batItem.monthChargePrice;
      } else if (batItem.batId === 2) {
        bat60Price = batItem.monthChargePrice;
      } else if (batItem.batId === 3) {
        bat72Price = batItem.monthChargePrice;
      }
      if (batItem.vehId === 3) {
        triChargePriceMonth = batItem.monthChargePrice;
      }
      return batItem.batId;

    })

    if (record.qrCode) {
      setQrCode(record.qrCode);
    } else {
      setQrCode('');
    }
    if (record.qrCodeRefund) {
      setQrCodeRefund(record.qrCodeRefund);
    } else {
      setQrCodeRefund('');
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
      bicyclePriceMonth,
      batPrice,
      batPriceMonth,
      batChargePrice,
      triPrice,
      triPriceMonth,
      triChargePrice,
      motoPrice,
      motoPriceMonth,
      bat48Price,
      bat60Price,
      bat72Price,
      triChargePriceMonth,
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
    setIsEdit(false);
    setVisiable(true);
    setQrCode('');
    setQrCodeRefund('');
  }

  async function modalSubmit() {
    console.log(editData);
    const values = await form.validateFields();

    const vehicleList = [];
    let batteryList: any[] = [];

    if (values.bicyclePrice) {
      vehicleList.push({
        vehId: 1,
        accessPrice: Number(values.bicyclePrice),
        chargePrice: 0,
        monthAccessPrice: values.bicyclePriceMonth,
      });
    }
    if (values.batPrice) {
      vehicleList.push({
        vehId: 2,
        accessPrice: Number(values.batPrice),
        chargePrice: Number(values.batChargePrice),
        monthAccessPrice: Number(values.batPriceMonth),
      });

      batteryList.push(
        {
          batId: 1,
          monthChargePrice: Number(values.bat48Price),
          vehId: 2,
        },
        {
          batId: 2,
          monthChargePrice: Number(values.bat60Price),
          vehId: 2,
        },
        {
          batId: 3,
          monthChargePrice: Number(values.bat72Price),
          vehId: 2,
        },
      )
    }
    if (values.triPrice) {
      vehicleList.push({
        vehId: 3,
        accessPrice: Number(values.triPrice),
        chargePrice: Number(values.triChargePrice),
        monthAccessPrice: Number(values.triPriceMonth),
      });

      batteryList.push(
        {
          batId: 3,
          monthChargePrice: Number(values.triChargePriceMonth),
          vehId: 3,
        },
      )
    }
    if (values.motoPrice) {
      vehicleList.push({
        vehId: 4,
        accessPrice: Number(values.motoPrice),
        monthAccessPrice: Number(values.motoPriceMonth),
      });
    }

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
      message.success('生成成功');
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
        width={700}
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
                  <Checkbox value={3}>三轮车</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value={4}>摩托车</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          {/* Start-------------- 临时停车费用 -------------- */}
          <Form.Item style={{ fontSize: '18px', fontWeight: 'bold' }} label="临时停车费用:"><div></div></Form.Item>
          <>
            {
              vehTypeArr.includes(1) ? <Form.Item
                label="自行车:"
                name="bicyclePrice"
                rules={[
                  {
                    required: true,
                    message: '请输入自行车临停单价',
                  },
                ]}
              >
                <Input className={styles.input} placeholder="请输入自行车临停单价" />
              </Form.Item> : null
            }
            {
              vehTypeArr.includes(2) ? <Form.Item
                label="电瓶车:"
                name="batPrice"
                rules={[
                  {
                    required: true,
                    message: '请输入电瓶车临停单价',
                  },
                ]}
              >
                <Input className={styles.input} placeholder="请输入电瓶车临停单价" />
              </Form.Item> : null
            }
            {
              vehTypeArr.includes(3) ? <Form.Item
                label="三轮车:"
                name="triPrice"
                rules={[
                  {
                    required: true,
                    message: '请输入三轮车临停单价',
                  },
                ]}
              >
                <Input className={styles.input} placeholder="请输入三轮车临停单价" />
              </Form.Item> : null
            }
            {
              vehTypeArr.includes(4) ? <Form.Item
                label="摩托车:"
                name="motoPrice"
                rules={[
                  {
                    required: true,
                    message: '请输入摩托车临停单价',
                  },
                ]}
              >
                <Input className={styles.input} placeholder="请输入摩托车临停单价" />
              </Form.Item> : null
            }
          </>
          {/* End-------------- 临时停车费用 -------------- */}
          {/* Start-------------- 临时充电费用（各伏数同价） -------------- */}
          <Form.Item style={{ fontSize: '18px', fontWeight: 'bold' }} label="临时充电费用（各伏数同价）:"><div></div></Form.Item>
          <>
            {
              vehTypeArr.includes(2) ? <Form.Item
                label="电瓶车:"
                name="batChargePrice"
                rules={[
                  {
                    required: true,
                    message: '请输入电瓶车临时充电单价',
                  },
                ]}
              >
                <Input className={styles.input} placeholder="请输入电瓶车临时充电单价" />
              </Form.Item> : null
            }
            {
              vehTypeArr.includes(3) ? <Form.Item
                label="三轮车:"
                name="triChargePrice"
                rules={[
                  {
                    required: true,
                    message: '请输入三轮车临时充电单价',
                  },
                ]}
              >
                <Input className={styles.input} placeholder="请输入三轮车临时充电单价" />
              </Form.Item> : null
            }
          </>

          {/* End-------------- 临时充电费用（各伏数同价） -------------- */}
          {/* Start-------------- 包月停车 -------------- */}
          <Form.Item style={{ fontSize: '18px', fontWeight: 'bold' }} label="包月停车费用"><div></div></Form.Item>
          <>
            {
              vehTypeArr.includes(1) ? <Form.Item
                label="自行车:"
                name="bicyclePriceMonth"
                rules={[
                  {
                    required: true,
                    message: '请输入自行车包月金额',
                  },
                ]}
              >
                <Input className={styles.input} placeholder="请输入自行车包月金额" />
              </Form.Item> : null
            }
            {
              vehTypeArr.includes(2) ? <Form.Item
                label="电瓶车:"
                name="batPriceMonth"
                rules={[
                  {
                    required: true,
                    message: '请输入电瓶车包月金额',
                  },
                ]}
              >
                <Input className={styles.input} placeholder="请输入电瓶车电瓶车包月金额" />
              </Form.Item> : null
            }
            {
              vehTypeArr.includes(3) ? <Form.Item
                label="三轮车:"
                name="triPriceMonth"
                rules={[
                  {
                    required: true,
                    message: '请输入三轮车包月金额',
                  },
                ]}
              >
                <Input className={styles.input} placeholder="请输入三轮车包月金额" />
              </Form.Item> : null
            }
            {
              vehTypeArr.includes(4) ? <Form.Item
                label="摩托车:"
                name="motoPriceMonth"
                rules={[
                  {
                    required: true,
                    message: '请输入摩托车包月金额',
                  },
                ]}
              >
                <Input className={styles.input} placeholder="请输入摩托车包月金额" />
              </Form.Item> : null
            }
          </>

          {/* End-------------- 包月停车 -------------- */}
          {/* Start-------------- 包月停车+充电 -------------- */}
          <Form.Item style={{ fontSize: '18px', fontWeight: 'bold' }} label="包月停车+充电费用"><div></div></Form.Item>
          <>
            {vehTypeArr.includes(2) ? (
              <>
                <Form.Item
                  label="48V电瓶:"
                  name="bat48Price"
                  rules={[
                    {
                      required: true,
                      message: '请输入48V电瓶包月停车充电价格',
                    },
                  ]}
                >
                  <Input className={styles.input} placeholder="请输入48V电瓶包月停车充电价格" />
                </Form.Item>
                <Form.Item
                  label="60V电瓶:"
                  name="bat60Price"
                  rules={[
                    {
                      required: true,
                      message: '请输入60V电瓶包月停车充电价格',
                    },
                  ]}
                >
                  <Input className={styles.input} placeholder="请输入60V电瓶包月停车充电价格" />
                </Form.Item>
                <Form.Item
                  label="72V电瓶:"
                  name="bat72Price"
                  rules={[
                    {
                      required: true,
                      message: '请输入72V电瓶包月停车充电价格',
                    },
                  ]}
                >
                  <Input className={styles.input} placeholder="请输入72V电瓶包月停车充电价格" />
                </Form.Item>
              </>
            ) : null}
            {vehTypeArr.includes(3) ? (
              <Form.Item
                label="三轮车:"
                name="triChargePriceMonth"
                rules={[
                  {
                    required: true,
                    message: '请输入三轮车包月停车充电价格',
                  },
                ]}
              >
                <Input className={styles.input} placeholder="请输入三轮车包月停车充电价格" />
              </Form.Item>
            ) : null}
          </>
          {/* End-------------- 包月停车+充电 -------------- */}        

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
              <Form.Item label="小区二维码:">
                <ImageComponents
                  canDelete
                  src={qrCode}
                  isPreview
                  onQrCode={() => handleQrCode('access')}
                  onDelete={() => setQrCode('')}
                />
              </Form.Item>
              <Form.Item label="小区退款二维码:">
                <ImageComponents
                  canDelete
                  src={qrCodeRefund}
                  isPreview
                  onQrCode={() => handleQrCode('refund')}
                  onDelete={() => setQrCodeRefund('')}
                />
              </Form.Item>
            </>
          ) : null}
        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default Village;

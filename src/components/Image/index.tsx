import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import styles from './index.less';

interface IImageProps {
  src: string;
  isPreview?: boolean;
  style?: any;
  onQrCode?: () => void;
  canDelete?: boolean;
  onDelete?: () => void;
}
export default function ImageComponents(props: IImageProps) {
  const {
    src,
    isPreview = false,
    style = { width: '200px', height: '200px' },
    onQrCode = () => { },
    onDelete = () => { },
    canDelete = false
  } = props;

  const [showDelete, setShow] = useState(false)

  const [visible, setVisible] = useState(false);
  function handlePreview() {
    if (!isPreview) {
      return;
    }
    setVisible(true);
  }

  function mouseOver() {
    if (!canDelete) {
      return
    }
    setShow(true)
  }

  return (
    <div className={styles.imgWrap}>
      {
        src ? <div className={styles.img} style={style} onMouseEnter={mouseOver} onMouseLeave={() => setShow(false)}>
          <img alt="二维码" src={src} onClick={handlePreview} style={style} />
          {
            showDelete ? <CloseCircleOutlined className={styles.icon} onClick={onDelete} /> : null
          }

        </div> : <Button type="primary" onClick={onQrCode}>生成二维码</Button>
      }

      <Modal title="右键保存图片" width={548} visible={visible} onCancel={() => setVisible(false)} onOk={() => setVisible(false)} destroyOnClose>
        <img alt="二维码" src={src} style={{ width: '100%', height: '500px' }} />
      </Modal>
    </div>
  );
}

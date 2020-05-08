import React, { useState, useRef, useEffect } from 'react';
import styles from './index.less';
import { Modal } from 'antd';

interface IImageProps {
  src: string;
  isPreview?: boolean;
  style?: any;
}
export default function ImageComponents(props: IImageProps) {
  const { src, isPreview = false, style = { width: '200px', height: '200px' } } = props;

  const [visible, setVisible] = useState(false);
  function handlePreview() {
    if (!isPreview) {
      return;
    }
    setVisible(true);
  }
  return (
    <div className={styles.imgWrap}>
      <img src={src} onClick={handlePreview} style={style} />
      <Modal title="右键保存图片" width={548} visible={visible} onCancel={() => setVisible(false)} destroyOnClose>
        <img src={src} style={{ width: '100%', height: '500px' }} />
      </Modal>
    </div>
  );
}

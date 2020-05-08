import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, message } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import logo from '@/assets/logo.png';
import { logout } from '@/services/login';
import UserStorage from '@/utils/storage';
import styles from './index.less';
import HeaderDropdown from '../HeaderDropdown';

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: CurrentUser;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      if (key === 'logout') {
        logout().then(res => {
          if (res.code === '10000') {
            UserStorage.removeUserInfo();
            UserStorage.removeUserToken();
            UserStorage.removeOsstoken();
            message.success('登出成功');
          }
        });
      }

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    router.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    const {
      currentUser = {
        avatar: logo,
        name: '系统管理员',
      },
    } = this.props;

    const userInfo = UserStorage.getUserInfo()
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {/* {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />} */}

        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={logo} alt="avatar" />
          <span className={styles.name}>{userInfo.name}</span>
        </span>
      </HeaderDropdown>
    )
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);

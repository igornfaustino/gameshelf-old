import React, { useMemo, useCallback } from 'react';

import { useHistory } from 'react-router-dom';
import { Layout, Input, Typography, Button } from 'antd';

import styles from './Header.module.scss';

const { Search } = Input;
const { Text } = Typography;
const { Header: HeaderAntd } = Layout;

const Header: React.FC = () => {
  const token = localStorage.getItem('token');
  const history = useHistory();

  const handleSearch = useCallback(
    (value) => {
      history.push(`/search?q=${value}`);
    },
    [history]
  );

  const handleLoginClick = useCallback(() => {
    history.push('/login');
  }, [history]);

  const handleList = useCallback(() => {
    history.push('/lists');
  }, [history]);

  const handleSingUpClick = useCallback(() => {
    history.push('/singup');
  }, [history]);

  const handleBrandClick = useCallback(() => history.push('/'), [history]);
  const handleLogout = useCallback(() => {
    localStorage.clear();
    return history.push('/');
  }, [history]);

  const search = useMemo(
    () => (
      <Search placeholder="input search text" onSearch={handleSearch} className={styles.search} />
    ),
    [handleSearch]
  );

  const menu = useMemo(() => {
    const offlineMenu = [
      <Button type="link" key="login" onClick={handleLoginClick}>
        Login
      </Button>,
      <Button type="link" key="singup" onClick={handleSingUpClick}>
        Sing Up
      </Button>,
    ];
    const onlineMenu = [
      <Button type="link" key="lists" onClick={handleList}>
        My Lists
      </Button>,
      <Button type="link" key="logout" onClick={handleLogout}>
        Logout
      </Button>,
    ];
    const hasToken = token || false;
    return hasToken ? onlineMenu : offlineMenu;
  }, [handleList, handleLoginClick, handleLogout, handleSingUpClick, token]);

  return (
    <HeaderAntd className={styles['site-page-header']}>
      <Button
        type="link"
        className={styles['header-title']}
        size="large"
        onClick={handleBrandClick}
      >
        GAMESHELF
      </Button>
      <div className={styles['header-menu']}>
        <div>{search}</div>
        <div>{menu}</div>
      </div>
    </HeaderAntd>
  );
};

export default Header;

import React, { useMemo, useCallback, useState, useEffect } from 'react';

import cx from 'classnames';
import { useHistory } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import { Layout, Input, Button } from 'antd';

import styles from './Header.module.scss';
import useWindowSize from '../hooks/useWindowsSize';

const { Search } = Input;
const { Header: HeaderAntd } = Layout;

const BREAKPOINT = 800;

const Header: React.FC = () => {
  const history = useHistory();
  const windowsSize = useWindowSize();
  const token = localStorage.getItem('token');

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isResponsiveMode, setIsResponsiveMode] = useState(false);

  const handleOpenMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleSearch = useCallback(
    (value) => {
      setIsMenuOpen(false);
      history.push(`/search?q=${value}`);
    },
    [history]
  );

  const handleLoginClick = useCallback(() => {
    setIsMenuOpen(false);
    history.push('/login');
  }, [history]);

  const handleList = useCallback(() => {
    setIsMenuOpen(false);
    history.push('/lists');
  }, [history]);

  const handleSingUpClick = useCallback(() => {
    setIsMenuOpen(false);
    history.push('/singup');
  }, [history]);

  const handleBrandClick = useCallback(() => {
    setIsMenuOpen(false);
    history.push('/');
  }, [history]);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    return history.push('/');
  }, [history]);

  const headerClassnames = useMemo(
    () =>
      isMenuOpen
        ? cx(styles['site-page-header'], styles['site-page-header--open'])
        : styles['site-page-header'],
    [isMenuOpen]
  );

  const search = useMemo(
    () => (
      <Search
        data-testid="search-bar"
        placeholder="search game..."
        onSearch={handleSearch}
        className={styles.search}
      />
    ),
    [handleSearch]
  );

  const menu = useMemo(() => {
    const offlineMenu = [
      <Button data-testid="login-menu" type="link" key="login" onClick={handleLoginClick}>
        Login
      </Button>,
      <Button data-testid="singup-menu" type="link" key="singup" onClick={handleSingUpClick}>
        Sing Up
      </Button>,
    ];
    const onlineMenu = [
      <Button data-testid="list-menu" type="link" key="lists" onClick={handleList}>
        My Lists
      </Button>,
      <Button data-testid="logout-menu" type="link" key="logout" onClick={handleLogout}>
        Logout
      </Button>,
    ];
    const hasToken = token || false;
    return hasToken ? onlineMenu : offlineMenu;
  }, [handleList, handleLoginClick, handleLogout, handleSingUpClick, token]);

  const responsiveMenu = useMemo(() => {
    if (!isResponsiveMode)
      return (
        <div className={styles['header-menu']}>
          <div>{search}</div>
          <div>{menu}</div>
        </div>
      );
    if (isMenuOpen)
      return (
        <>
          <MenuOutlined
            data-testid="colapse-menu"
            onClick={handleOpenMenu}
            className={cx(styles['open-menu-btn'], styles['open-menu-btn--collapsed'])}
          />
          <div className={cx(styles['header-menu'], styles['header-menu--collapsed'])}>
            <div>{search}</div>
            <div>{menu}</div>
          </div>
        </>
      );
    return (
      <>
        <MenuOutlined
          data-testid="colapse-menu"
          onClick={handleOpenMenu}
          className={styles['open-menu-btn']}
        />
      </>
    );
  }, [isResponsiveMode, search, menu, isMenuOpen, handleOpenMenu]);

  useEffect(() => {
    const [width] = windowsSize;
    setIsMenuOpen(false);
    setIsResponsiveMode(width < BREAKPOINT);
  }, [windowsSize]);

  return (
    <HeaderAntd className={headerClassnames}>
      <Button
        data-testid="brand"
        type="link"
        className={styles['header-title']}
        size="large"
        onClick={handleBrandClick}
      >
        GAMESHELF
      </Button>

      {responsiveMenu}
    </HeaderAntd>
  );
};

export default Header;

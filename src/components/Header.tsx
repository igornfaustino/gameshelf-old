import React, { useMemo, useCallback } from 'react';

import { Layout, Input, Typography } from 'antd';

import './Header.css';
import { useHistory } from 'react-router-dom';

const { Search } = Input;
const { Text, Title } = Typography;
const { Header: HeaderAntd } = Layout;

function Header() {
  const history = useHistory();

  const handleSearch = useCallback((value) => {
    history.push(`/search?q=${value}`);
  }, []);

  const search = useMemo(
    () => <Search placeholder="input search text" onSearch={handleSearch} className="search" />,
    []
  );

  const menu = useMemo(() => [<Text>Login</Text>, <Text>Sing up</Text>], []);

  return (
    <HeaderAntd className="site-page-header">
      <div>
        <Title level={1} className="header-title">
          GAMESHELF
        </Title>
      </div>
      <div>{search}</div>
    </HeaderAntd>
  );
}

export default Header;

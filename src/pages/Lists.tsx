import React, { useMemo, useState, useCallback, useEffect } from 'react';

import { gql } from 'apollo-boost';
import { Layout, Menu } from 'antd';
import { useQuery } from '@apollo/react-hooks';

import style from './Lists.module.scss';
import ListContent from './ListContent';
import { LIST_ICONS } from '../helpers/common';
import useWindowSize from '../hooks/useWindowsSize';

const GET_LISTS = gql`
  {
    lists {
      id
      name
    }
  }
`;

const { Content, Sider } = Layout;

interface ListData {
  id: number;
  name: string;
}

interface ListQuery {
  lists: ListData[];
}

const Lists: React.FC = () => {
  const { data } = useQuery<ListQuery>(GET_LISTS);
  const windowSize = useWindowSize();

  const [defaultListId, setDefaultListId] = useState('1');
  const [selectedListId, setSelectedListId] = useState('1');
  const [siderWidth, setSiderWidth] = useState(200);

  const handleClick = useCallback(({ key }) => {
    setSelectedListId(key);
  }, []);

  const menus = useMemo(
    () =>
      data?.lists.map((list) => {
        return (
          <Menu.Item key={list.id}>
            <img
              src={LIST_ICONS[list.name] || ''}
              alt={list.name}
              width={30}
              className={style.icon}
            />
            <span className={style.menuText}>{list.name}</span>
          </Menu.Item>
        );
      }),
    [data]
  );

  useEffect(() => {
    const firstListItem = data?.lists[0];
    if (!firstListItem) return;
    setDefaultListId(firstListItem.id.toString());
  }, [data]);

  useEffect(() => {
    console.log(selectedListId);
  }, [selectedListId]);

  useEffect(() => {
    const width = windowSize[0];
    if (width <= 600) return setSiderWidth(80);
    setSiderWidth(200);
  }, [windowSize]);

  return (
    <Layout className={style.content}>
      <Sider width={siderWidth} className={style.sider}>
        <div style={{ position: 'fixed', width: siderWidth }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[defaultListId]}
            onClick={handleClick}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%' }}
          >
            {menus}
          </Menu>
        </div>
      </Sider>
      <Content style={{ padding: '0 24px' }}>
        <ListContent listId={selectedListId} />
      </Content>
    </Layout>
  );
};

export default Lists;

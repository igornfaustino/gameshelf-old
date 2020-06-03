import React, { useMemo, useState, useCallback, useEffect } from 'react';

import { Layout, Menu } from 'antd';
import { useQuery } from '@apollo/react-hooks';

import styles from './Lists.module.scss';
import ListContent from './ListContent';
import { LIST_ICONS } from '../helpers/common';
import useWindowSize from '../hooks/useWindowsSize';
import { GET_LISTS } from '../helpers/queries';

const { Content, Sider } = Layout;

interface ListData {
  count: number;
  list: {
    id: number;
    name: string;
  };
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
      data?.lists.map(({ list, count }) => {
        return (
          <Menu.Item key={list.id}>
            <img
              src={LIST_ICONS[list.name] || ''}
              alt={list.name}
              width={30}
              className={styles.icon}
            />
            <span className={styles.menuText}>
              <span>{list.name}</span>
              <span>{count}</span>
            </span>
          </Menu.Item>
        );
      }),
    [data]
  );

  const siderStyle = useMemo(() => ({ width: siderWidth }), [siderWidth]);

  useEffect(() => {
    const firstListItem = data?.lists[0].list;
    if (!firstListItem) return;
    setDefaultListId(firstListItem.id.toString());
  }, [data]);

  useEffect(() => {
    const width = windowSize[0];
    if (width <= 730) return setSiderWidth(80);
    setSiderWidth(200);
  }, [windowSize]);

  return (
    <Layout className={styles.content}>
      <Sider width={siderWidth} className={styles.sider}>
        <div style={siderStyle} className={styles.menuWrapper}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[defaultListId]}
            onClick={handleClick}
            defaultOpenKeys={['sub1']}
          >
            {menus}
          </Menu>
        </div>
      </Sider>
      <Content className={styles.mainContent}>
        <ListContent listId={selectedListId} />
      </Content>
    </Layout>
  );
};

export default Lists;

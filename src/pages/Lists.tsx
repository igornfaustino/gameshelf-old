import React, { useMemo, useState, useCallback, useEffect } from 'react';

import { gql } from 'apollo-boost';
import { Layout, Menu } from 'antd';
import { useQuery } from '@apollo/react-hooks';

import style from './Lists.module.scss';
import ListContent from './ListContent';

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

  const [defaultListId, setDefaultListId] = useState('1');
  const [selectedListId, setSelectedListId] = useState('1');

  const handleClick = useCallback(({ key }) => {
    setSelectedListId(key);
  }, []);

  const menus = useMemo(
    () =>
      data?.lists.map((list) => {
        return <Menu.Item key={list.id}>{list.name}</Menu.Item>;
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

  return (
    <Layout className={style.content}>
      <Sider width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={[defaultListId]}
          onClick={handleClick}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%' }}
        >
          {menus}
        </Menu>
      </Sider>
      <Content style={{ padding: '0 24px', minHeight: 280 }}>
        <ListContent listId={selectedListId} />
      </Content>
    </Layout>
  );
};

export default Lists;

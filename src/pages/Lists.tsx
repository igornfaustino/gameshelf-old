import React, { useMemo } from 'react';

import { gql } from 'apollo-boost';
import { Layout, Menu } from 'antd';
import { useQuery } from '@apollo/react-hooks';

import style from './Lists.module.scss';

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

  const menus = useMemo(
    () =>
      data?.lists.map((list) => {
        return <Menu.Item key={list.id}>{list.name}</Menu.Item>;
      }),
    [data]
  );

  return (
    <Layout className={style.content}>
      <Sider width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%' }}
        >
          {menus}
        </Menu>
      </Sider>
      <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content>
    </Layout>
  );
};

export default Lists;

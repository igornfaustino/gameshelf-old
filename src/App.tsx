import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from 'antd';

import './App.css';
import Header from './components/Header';
import Routes from './routes';

const { Footer, Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Header />
        <Content style={{ padding: '0 100px', marginTop: 64 }}>
          <Routes />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          GameShelf ©2020 Created by Igor Neves Faustino
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;

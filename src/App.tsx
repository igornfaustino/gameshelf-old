import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from 'antd';

import './App.css';
import Header from './components/Header';
import Routes from './routes';

const { Footer, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout>
        <Header />
        <Content style={{ padding: '0 100px' }}>
          <Routes />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          GameShelf ©2020 Created by Igor Neves Faustino
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;

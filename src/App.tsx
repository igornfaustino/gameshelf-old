import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import { Layout } from 'antd';

import Header from './components/Header';
import Routes from './routes';

const { Footer } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ width: '100%' }}>
        <Header />
        <Routes />
        <Footer style={{ textAlign: 'center' }}>
          GameShelf ©2020 Created by Igor Neves Faustino{' '}
          <div>
            Icons made by{' '}
            <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
              Freepik
            </a>
            {', '}
            <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">
              Pixel perfect
            </a>
            {' and '}
            <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">
              Smashicons
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </div>
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;

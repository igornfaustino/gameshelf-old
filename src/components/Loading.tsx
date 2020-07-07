import React from 'react';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingProps {
  fontSize?: number;
}

const Loading: React.FC<LoadingProps> = ({ fontSize = 36 }) => {
  const antIcon = <LoadingOutlined style={{ fontSize }} spin />;
  return <Spin indicator={antIcon} />;
};

export default Loading;

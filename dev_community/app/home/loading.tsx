import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
// import './Loading.css'; // Add any additional styling you might need

const Loading: React.FC = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  return (
    <div className="loading-container min-h-screen h-full flex justify-center items-center">
      <Spin indicator={antIcon} size="large" />
    </div>
  );
};

export default Loading;
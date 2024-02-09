import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Total Active Time',
    children: 'Total Active Time',
  },
  {
    key: '2',
    label: 'Total Chat Sessions',
    children: 'Total Chat Sessions',
  },
  {
    key: '3',
    label: 'Total Calls',
    children: 'Total Calls',
  },
  {
    key: '4',
    label: 'Total Earning',
    children: 'Total Earning',
  },
];

const CounsellorTabs: React.FC = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;

export default CounsellorTabs;

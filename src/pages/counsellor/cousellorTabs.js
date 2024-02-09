import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const CounsellorTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    
    <div>
      <Tabs selectedIndex={activeTab} onSelect={handleTabChange}>
        <TabList>
          <Tab>Total Calls</Tab>
          <Tab>Total Active Time</Tab>
          <Tab>Commulative Total Minutes</Tab>
          <Tab>Total Chat Sessions</Tab>
          <Tab>Total Earning</Tab>
          <Tab>Earning of Current Month</Tab>
        </TabList>

        <TabPanel>
          {/* Content for Total Calls Tab */}
          <p>Total Calls received</p>
        </TabPanel>
        <TabPanel>
          {/* Content for Total Active Time Tab */}
          <p>Total Active Time</p>
        </TabPanel>
        <TabPanel>
          {/* Content for Commulative Total Minutes Tab */}
          <p>Commulative Total Minutes spent on call</p>
        </TabPanel>
        <TabPanel>
          {/* Content for Total Chat Sessions Tab */}
          <p>Total Chat Sessions</p>
        </TabPanel>
        <TabPanel>
          {/* Content for Total Earning Tab */}
          <p>Total Earning</p>
        </TabPanel>
        <TabPanel>
          {/* Content for Earning of Current Month Tab */}
          <p>Earning Of current month</p>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default CounsellorTabs;

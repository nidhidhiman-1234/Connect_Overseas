// import React, { useEffect, useState } from 'react';
// import { Tabs, List } from 'antd';
// import { firestore } from "../../config/firebase"; 
// import { collection, getDocs } from "firebase/firestore";

// const { TabPane } = Tabs;

// const items = [
//   {
//     key: '1',
//     label: 'Counsellor Reviews',
//     children: 'Counsellor Reviews',
//   },
//   {
//     key: '2',
//     label: 'Total Chat Sessions',
//     children: 'Total Chat Sessions',
//   },
//   {
//     key: '3',
//     label: 'Total Calls',
//     children: 'Total Calls',
//   },
//   {
//     key: '4',
//     label: 'Total Earning',
//     children: 'Total Earning',
//   },
//   {
//     key: '5',
//     label: 'Chat History',
//     children: 'Chat History',
//   },
//   {
//     key: '6',
//     label: 'Call History',
//     children: 'Call History',
//   },
// ];

// const CounsellorTabs = () => {
//   const [activeTab, setActiveTab] = useState('1');
//   const [chatData, setChatData] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userMessages, setUserMessages] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const chatCollection = collection(firestore, 'chatlist');
//       const querySnapshot = await getDocs(chatCollection);
//       const data = querySnapshot.docs.map(doc => doc.data().messages || []).flat(); 
//       // Sort messages by timestamp
//       data.sort((a, b) => a.stamp.toDate() - b.stamp.toDate());
//       setChatData(data); 
//     };

//     fetchData();

//     return () => {
//     };
//   }, []);

//   const handleTabChange = (key) => {
//     setActiveTab(key);
//     setSelectedUser(null);
//     setUserMessages([]);
//   };

//   const handleUserClick = (userId) => {
//     setSelectedUser(userId);
//     const filteredMessages = chatData.filter(item => (item.type === 'counsellor' || (item.type === 'user' && item.receiver_id === userId)));
//     setUserMessages(filteredMessages);
//   };

//   return (
//     <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={handleTabChange}>
//       {items.map(item => (
//         <TabPane tab={item.label} key={item.key}>
//           {item.key === '5' && (
//             <div className="chat-container">
//               {!selectedUser && (
//                 <List
//                   dataSource={chatData.filter(item => item.type === 'user').reduce((acc, cur) => {
//                     if (!acc.find(item => item.receiver_id === cur.receiver_id)) {
//                       acc.push(cur);
//                     }
//                     return acc;
//                   }, [])}
//                   renderItem={item => (
//                     <List.Item key={item.receiver_id} onClick={() => handleUserClick(item.receiver_id)}>
//                       <List.Item.Meta
//                         title={`User-${item.receiver_id}`}
//                         description="Click to view chat history"
//                       />
//                     </List.Item>
//                   )}
//                 />
//               )}
//               {selectedUser && (
//                 <List
//                   dataSource={userMessages}
//                   renderItem={item => (
//                     <List.Item className={`chat-message ${item.type === 'counsellor' ? 'sender' : 'receiver'}`} key={item.id}>
//                       <div className="message-content">
//                         <span className="message-text">{item.message}</span>
//                         <p><span className="message-timestamp">{item.stamp.toDate().toString()}</span></p>
//                       </div>
//                     </List.Item>
//                   )}
//                 />
//               )}
//             </div>
//           )}
//         </TabPane>
//       ))}
//     </Tabs>
//   );
// };

// export default CounsellorTabs;

// import React, { useEffect, useState } from 'react';
// import { Tabs, List } from 'antd';
// import { firestore } from "../../config/firebase"; 
// import { collection, getDocs } from "firebase/firestore";

// const { TabPane } = Tabs;

// const items = [
//   {
//     key: '1',
//     label: 'Counsellor Reviews',
//     children: 'Counsellor Reviews',
//   },
//   {
//     key: '2',
//     label: 'Total Chat Sessions',
//     children: 'Total Chat Sessions',
//   },
//   {
//     key: '3',
//     label: 'Total Calls',
//     children: 'Total Calls',
//   },
//   {
//     key: '4',
//     label: 'Total Earning',
//     children: 'Total Earning',
//   },
//   {
//     key: '5',
//     label: 'Chat History',
//     children: 'Chat History',
//   },
//   {
//     key: '6',
//     label: 'Call History',
//     children: 'Call History',
//   },
// ];

// const CounsellorTabs = () => {
//   const [activeTab, setActiveTab] = useState('1');
//   const [chatData, setChatData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const chatCollection = collection(firestore, 'chatlist');
//       const querySnapshot = await getDocs(chatCollection);
//       const data = querySnapshot.docs.map(doc => doc.data().messages || []).flat(); 
//       data.sort((a, b) => a.stamp.toDate() - b.stamp.toDate());
//       setChatData(data); 
//     };

//     fetchData();

//     return () => {
//     };
//   }, []);

//   const handleTabChange = (key) => {
//     setActiveTab(key);
//   };

//   return (
//     <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={handleTabChange}>
//       {items.map(item => (
//         <TabPane tab={item.label} key={item.key}>
//           {item.key === '5' && (
//             <div className="chat-container">
//               <List
//                 dataSource={chatData}
//                 renderItem={item => (
//                   <List.Item className={`chat-message ${item.type === 'counsellor' ? 'sender' : 'receiver'}`} key={item.id}>
//                     <div className="message-content">
//                       <span className="message-text">{item.message}</span>
//                       <p> <span className="message-timestamp">{item.stamp.toDate().toString()}</span></p>
                     
//                     </div>
//                   </List.Item>
//                 )}
//               />
//             </div>
//           )}
//         </TabPane>
//       ))}
//     </Tabs>
//   );
// };

// export default CounsellorTabs;


import React, { useEffect, useState } from 'react';
import { Tabs, List } from 'antd';
import { firestore } from "../../config/firebase"; 
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const { TabPane } = Tabs;

const items = [
  {
    key: '1',
    label: 'Counsellor Reviews',
    children: 'Counsellor Reviews',
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
  {
    key: '5',
    label: 'Chat History',
    children: 'Chat History',
  },
  {
    key: '6',
    label: 'Call History',
    children: 'Call History',
  },
];

const CounsellorTabs = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [chatData, setChatData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userMessages, setUserMessages] = useState([]);
  const [users, setUsers] = useState({});
  const [counsellor, setCounsellor] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const chatCollection = collection(firestore, 'chatlist');
      const querySnapshot = await getDocs(chatCollection);
      const data = querySnapshot.docs.map(doc => doc.data().messages || []).flat(); 
      data.sort((a, b) => a.stamp.toDate() - b.stamp.toDate());
      setChatData(data); 
    };

    fetchData();

    return () => {
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(firestore, 'users');
      const querySnapshot = await getDocs(usersCollection);
      const usersData = {};
      querySnapshot.forEach(doc => {
        usersData[doc.id] = doc.data().firstName;
      });
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const counsellorCollection = collection(firestore, 'councellors');
      const querySnapshot = await getDocs(counsellorCollection);
      const counsellorData = {};
      querySnapshot.forEach(doc => {
        counsellorData[doc.id] = doc.data().firstName;
      });
      setCounsellor(counsellorData);
    };

    fetchUsers();
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSelectedUser(null);
    setUserMessages([]);
  };

  const handleUserClick = async (userId) => {
    setSelectedUser(userId);
    const userDocRef = doc(firestore, 'users', userId);
    const userDocSnapshot = await getDoc(userDocRef);
    // const userName = userDocSnapshot.data().firstName;
    const filteredMessages = chatData.filter(item => (item.type === 'counsellor' || (item.type === 'user' && item.receiver_id === userId)));
    setUserMessages(filteredMessages);
  };

  return (
    <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={handleTabChange}>
      {items.map(item => (
        <TabPane tab={item.label} key={item.key}>
          {item.key === '5' && (
            <div className="chat-container">
              {!selectedUser && (
                <List
                  dataSource={chatData.filter(item => item.type === 'user').reduce((acc, cur) => {
                    if (!acc.find(item => item.receiver_id === cur.receiver_id)) {
                      acc.push(cur);
                    }
                    return acc;
                  }, [])}
                  renderItem={item => (
                    <List.Item key={item.receiver_id} onClick={() => handleUserClick(item.receiver_id)}>
                      <List.Item.Meta
                        title={`User-${users[item.receiver_id] || item.receiver_id}`} 
                        description="Click to view chat history"
                      />
                    </List.Item>
                  )}
                />
              )}
             {selectedUser && (
  <List
    dataSource={userMessages}
    renderItem={item => (
      <List.Item className={`chat-message ${item.type === 'counsellor' ? 'sender' : 'receiver'}`} key={item.id}>
        <div className="message-content">
        {item.type === 'counsellor' && (
            <p><strong>Counsellor:</strong> {counsellor[item.sender_id] || 'Unknown'}</p>
          )}
            {item.type === 'user' && (
            <p><strong>User:</strong> {users[item.receiver_id] || 'Unknown'}</p>
          )}
          <span className="message-text">{item.message}</span>
          <p><span className="message-timestamp">{item.stamp.toDate().toString()}</span></p>
          
        
        </div>
      </List.Item>
    )}
  />
)}

            </div>
          )}
        </TabPane>
      ))}
    </Tabs>
  );
};

export default CounsellorTabs;


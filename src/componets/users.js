import React, { useState, useEffect } from "react";
import { Button, Table, Space, Input,Radio,Modal } from "antd";
import Layout from "../layout/layout";
import { firestore }from "../config/firebase";

import { collection, getDocs,updateDoc,doc,getDoc } from 'firebase/firestore';
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";



const UserList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [initialData, setInitialData] = useState([]);
  const [displayedData, setDisplayedData] = useState(initialData.slice(0, 10));
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const handleStatusChange = (e, key) => {
    const updatedDisplayedData = displayedData.map((item) =>
      item.key === key ? { ...item, status: e.target.value } : item
    );
    setDisplayedData(updatedDisplayedData);
  };
  const showDeleteModal = (id) => {
    setUserToDelete(id);
    setDeleteModalVisible(true);
  };
  
  const hideDeleteModal = () => {
    setUserToDelete(null);
    setDeleteModalVisible(false);
  };

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  // const handleDeleteUser = async (id, e) => {
  //   e.stopPropagation();
  
  //   try {
  //     const userRef = doc(firestore, "users", id);
  //     console.log("Deleting user with ID:", id);
  
  //     const userSnapshot = await getDoc(userRef);
  //     if (userSnapshot.exists()) {
  //       await updateDoc(userRef, {
  //         isDeleted: true,
  //       });
  //       console.log("User successfully deleted.");
  //       fetchDataFromFirestore();
       
  //     } else {
  //       console.log("User not found with ID:", id);
  //     }
  //   } catch (error) {
  //     console.error("Error updating isDeleted:", error);
  //   }
  // };

  const handleDeleteUser = (id, e) => {
    e.stopPropagation();
    showDeleteModal(id);
  };
  
  const handleDeleteConfirmed = async () => {
    try {
      const userRef = doc(firestore, "users", userToDelete);
      const userSnapshot = await getDoc(userRef);
  
      if (userSnapshot.exists()) {
        await updateDoc(userRef, {
          isDeleted: true,
        });
  
        console.log("User successfully deleted.");
        fetchDataFromFirestore();
      } else {
        console.log("User not found with ID:", userToDelete);
      }
  
      hideDeleteModal();
    } catch (error) {
      console.error("Error updating isDeleted:", error);
    }
  };
  
  const handleDeleteCancelled = () => {
    hideDeleteModal();
  };


  const handleBlockUser = async (id, isBlocked, e) => {
    e.stopPropagation();
    console.log("Block button clicked for users with ID:", id);
    try {
      await updateDoc(doc(firestore, "users", id), {
        isBlocked: !isBlocked, 
      });
      fetchDataFromFirestore();
    } catch (error) {
      console.error("Error updating isBlocked:", error);
    }
  };
  

  const columns = [

    {
      title: "User ID",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      align: "center",
    },
    {
    title: "Last Name",
    dataIndex: "lastName",
    align: "center",
  },
  {
    title: "Phone Number ",
    dataIndex: "phone",
    align: "center",
  },
  {
    title: "Email",
    dataIndex: "email",
    align: "center",
  },
  {
    title: "City",
    dataIndex: "city",
    align: "center",
  },
  {
    title: "Country",
    dataIndex: "country",
    align: "center",
  },
  {
    title: "Interests",
    dataIndex: "country",
    align: "center",
  },
  {
    title: "Interests",
    dataIndex: "purpose",
    align: "center",
  },
  {
    title: "Total Minutes Spent On Calls",
    dataIndex: "total",
    align: "center",
  },
  {
    title: "Status",
    dataIndex: "isActive",
    align: "center",
    render: (text, record) => (
      <Space>
        <img src="/radiobtn.svg" />
        <span style={{ color: record.isActive ? "green" : "" , fontSize:'12px' }}>
        {record.isActive ? "Active" : "Disabled"}
      </span>
      </Space>
    ),
  },
  {
    dataIndex: "delete",
    align: "center",
    render: (text, record) => (
      <Space>
        <DeleteOutlined
          style={{ fontSize: "18px", cursor: "pointer" }}
          onClick={(e) => handleDeleteUser(record.id, e)}
        />
      </Space>
    ),
  },
  
    {
      dataIndex: "block",
      align: "center",
      render: (text, record) => (
        <Space>
          <Button
            type={record.isBlocked ? "default" : "primary"}
            danger={!record.isBlocked}
            onClick={(e) => handleBlockUser(record.id, record.isBlocked, e)}
          >
            {record.isBlocked ? "Unblock" : "Block"}
          </Button>
        </Space>
      ),
    },
  ];


  const loadAllData = () => {
    setDisplayedData(initialData);
    setTotalRecords(initialData.length);
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const fetchDataFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "users"));
      const firebaseData = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((counsellor) => !counsellor.isDeleted);
  
      setInitialData(firebaseData);
      setDisplayedData(firebaseData.slice(0, 10));
      setTotalRecords(firebaseData.length);
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);

    const filteredData = initialData.filter((item) =>
      item.firstName.toLowerCase().includes(value.toLowerCase())
    );
    setDisplayedData(filteredData);
    setTotalRecords(filteredData.length);
  };

  const handleDeleteAll = async () => {
    try {
      const selectedCounsellorIds = selectedRowKeys;
      for (const id of selectedCounsellorIds) {
        await updateDoc(doc(firestore, "users", id), {
          isDeleted: true,
        });
      }
      fetchDataFromFirestore();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Error updating isDeleted:", error);
    }
  };

  const shouldRenderViewAllButton = displayedData.length > 10;

  // const handleProfile = async () => {
  //   firestore()
  //     .collection('users')
  //     .doc(number)
  //     .get()
  //     .then(documentSnapshot => {
  //       if (documentSnapshot.exists) {
  //         console.log('User data: ', documentSnapshot.data());
  //         handleUserData(documentSnapshot.data());
  //         firestore()
  //           .collection('users')
  //           .doc(number)
  //           .update({
  //             isActive: true,
  //           })
  //           .then(() => {
  //             console.log('User updated!');
  //           });
  //       } else {
  //         firestore()
  //           .collection('users')
  //           .doc(number)
  //           .set({
  //             firstName: 'firstName',
  //             lastName: 'lastName',
  //             email: 'email',
  //             purpose: 'Study',
  //             phone: number,
  //             isActive: true,
  //             country: 'Canada',
  //           })
  //           .then(() => {
  //             console.log('doc written');
  //           });
  //       }
  //     });
  // };


  return (
    
    <div   style={{
      alignItems: "center",
      overflow: "auto",
      maxHeight: "100vh",
      paddingRight: "0px",
      width: "97.5%",     
    }}>
      <Layout />
      <Modal
  title="Confirm Deletion"
  open={isDeleteModalVisible}
  onOk={handleDeleteConfirmed}
  onCancel={handleDeleteCancelled}
  okText="Yes"
  cancelText="No"
>
  Are you sure you want to delete this user?
</Modal>
      <div style={{ marginTop: "-60px",alignItems: 'center', }}>
        <Input
        className="placeholder_search"
          prefix={
            <img
              src="/search.svg"
              style={{ width: "24px",height:'24px', marginRight: "8px", }}
            />
          }
          placeholder="Search"
          style={{
            flex: 1,
            width: "352px",
            height: "37px",
            borderRadius: "19px",
            background: " rgb(235,235,235)",
            marginBottom: "40px",
            border: "none",
            color:"black",
            paddingTop:'5px'
            
            
          }}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          
        />
       <img className="slider"
    src="/slider.svg"
    style={{ paddingLeft:'20px', marginBottom:'-9px' }}
  />
         
      </div>
  <div style={{ marginBottom: 16 }}>
        {/* <Button 
          style={{
            width: "173px",
            height: "43px",
            borderRadius: "22.5px",
            textAlign: "left",
            background: " rgba(24, 64, 125, 1)",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            color: "white",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: "500",
            lineHeight: "21px",
            textAlign: "center",
            letterSpacing: "-0.022em",
            border:'none',
            fontWeight: "medium",
          }}
        >
          + Add new User
        </Button> */}
        {/* <Button
          onClick={loadAllData}
          style={{
            color: "rgba(0, 0, 0, 1)",
            border: "none",
            marginLeft: "93.5%",
            Weight: "500",
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
            fontWeight: "bold",
          }}
        >
          View All
        </Button> */}
        {shouldRenderViewAllButton && (
          <Button
            onClick={loadAllData}
            style={{
              color: "rgba(0, 0, 0, 1)",
              border: "none",
              marginLeft: "93.5%",
              Weight: "500",
              fontSize: "12px",
              fontFamily: "Inter, sans-serif",
              fontWeight: "bold",
            }}
          >
            View All
          </Button>
        )}
        {hasSelected && (
          <Button
            onClick={handleDeleteAll}
            style={{
              color: "rgba(0, 0, 0, 1)",
              border: "none",
              Weight: "500",
              fontSize: "12px",
              fontFamily: "Inter, sans-serif",
              fontWeight: "bold",
            }}
          >
            Delete All
          </Button>
        )}
      </div>
     
  
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={displayedData}
        pagination={false}
        rowKey="id" 
      />
      <div  style={{
        marginTop:"30px",
            color: "rgba(0, 0, 0, 1)",
            Weight: "500",
            fontSize: "10px",
            fontFamily: "Inter, sans-serif",
            fontWeight: "medium",
          }} > Showing {displayedData.length} from {totalRecords} data</div>
    </div>
  
  );
};

export default UserList;

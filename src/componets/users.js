import React, { useState, useEffect,useRef } from "react";
import { useNavigate,useLocation  } from 'react-router-dom';
import { Button, Table, Space, Input,Radio,Modal, Form,Avatar } from "antd";
import Layout from "../layout/layout";
import { firestore, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import {  collection,
  getDocs,
  addDoc,
  updateDoc,
  getDoc,
  setDoc,
   doc } from 'firebase/firestore';
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined
} from "@ant-design/icons";



const UserList = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [initialData, setInitialData] = useState([]);
  const [displayedData, setDisplayedData] = useState(initialData.slice(0, 10));
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [addUserForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState("");
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateJoined: "",
    email: "",
    phone: "",
    profilePicture: "",
    city: "",
    state: "",
    totalEarning:"",
    activeTime:"",
    available:"",
    callCount:"",
    chatSessions:"",
    country:"",
    earningsMonth:"",
    isActive:"",
    isWaiting:"",
    rating:"",
    totalCallTime:"",
  });

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
    title: "Purpose",
    dataIndex: "purpose",
    align: "center",
  },
  // {
  //   title: "Total Minutes Spent On Calls",
  //   dataIndex: "total",
  //   align: "center",
  // },
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

  const handleAddUser = async () => {
    try {
      const values = await addUserForm.validateFields();
  
      const newData = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        city: values.city,
        email: values.email,
        isDeleted: false,
        image: selectedImage,
        country:values.country,
        isActive:false,
        isWaiting:false,
        purpose:values.purpose

      };
      const counsellorRef = doc(firestore, "users", values.phone);
  
      await setDoc(counsellorRef, newData);
  
      addUserForm.resetFields();
      setIsModalVisible(false);
  
      fetchDataFromFirestore();
    } catch (error) {
      console.error("Error adding new users:", error);
    }
  };
 
  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("Selected File:", selectedFile);
    if (selectedFile) {
      const uniqueFilename = `${Date.now()}-${uuidv4()}`;
      const storageRef = ref(storage, `avatars/${uniqueFilename}`);

      uploadBytes(storageRef, selectedFile)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then((downloadURL) => {
          console.log("Download URL:", downloadURL);
          setSelectedImage(downloadURL);

          setSelectedItem("");
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };
  
  
  const handleEditIconClick = (e,record) => {
    e.stopPropagation();
    setSelectedUser(record);
    fileInputRef.current.click();
  };


  const rowClassName = (record, index) => {
    return "pointer-cursor";
  };

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
        <Button 
         onClick={() => setIsModalVisible(true)}
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
        </Button>
    
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
          <Modal
          title="Add New User"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={handleAddUser}
        >
          <div>
            <Avatar
              size={64}
              icon={<UserOutlined />}
              style={{ position: 'relative' }}
              onClick={handleEditIconClick}
              src={selectedImage} alt="Selected"
            >
            
            </Avatar>
        
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
               onChange={(e) => handleFileInputChange(e)}
              
            />
        
            <EditOutlined style={{ marginLeft: '-7px' }} />
    </div>

         
          <Form form={addUserForm} initialValues={{}}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please enter First Name" },
                {
                  pattern: /^[a-zA-Z]+$/,
                  message: "Please enter only letters in the First Name field",
                },
              ]}
            >
              <Input
               type="text"
               inputMode="text"/>
            </Form.Item>
            <Form.Item label="Last Name" name="lastName">
              <Input />
            </Form.Item>
        
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                {
                  pattern: emailRegex,
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone"
              type="tel"
              rules={[
                { required: true, message: "Please enter Phone Number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              ]}
            >
              <Input maxLength={10} />
            </Form.Item>

            <Form.Item
              label="Purpose"
              name="purpose"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Country"
              name="country"
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
     
  
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={displayedData}
        pagination={false}
        rowKey="id" 
        rowClassName={rowClassName}
        onRow={(record) => ({
          onClick: () => {
            if (!record.isBlocked) {
              setSelectedUser(record);
              navigate('/user', { state: { selectedUser: record } });
            }
          
          },
        })}
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

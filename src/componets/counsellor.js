import React, { useState, useEffect,useRef } from "react";
import { useNavigate,useLocation  } from 'react-router-dom';
import {
  Button,
  Table,
  Input,
  Modal,
  Form,
  Space,
  DatePicker,
  Avatar,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Layout from "../layout/layout";
import { firestore, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  getDoc,
  setDoc,
   doc
} from "firebase/firestore";

import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

const CounsellorList = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [initialData, setInitialData] = useState([]);
  const [displayedData, setDisplayedData] = useState(initialData.slice(0, 10));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addCounsellorForm] = Form.useForm();
  const [updateCounsellorForm] = Form.useForm();
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);


  
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
  });
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const showDeleteModal = (id) => {
    setUserToDelete(id);
    setDeleteModalVisible(true);
  };
  
  const hideDeleteModal = () => {
    setUserToDelete(null);
    setDeleteModalVisible(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (e, key) => {
    const updatedDisplayedData = displayedData.map((item) =>
      item.key === key ? { ...item, status: e.target.value } : item
    );
    setDisplayedData(updatedDisplayedData);
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

  // const handleDeleteCounsellor = async (id, e) => {
  //   e.stopPropagation();

  //   try {
  //     await updateDoc(doc(firestore, "councellors", id), {
  //       isDeleted: true,
  //     });
  //     fetchDataFromFirestore();
  //   } catch (error) {
  //     console.error("Error updating isDeleted:", error);
  //   }
  // };

  const handleDeleteCounsellor = (id, e) => {
    e.stopPropagation();
    showDeleteModal(id);
  };
  
  const handleDeleteConfirmed = async () => {
    try {
      const userRef = doc(firestore, "councellors", userToDelete);
      const userSnapshot = await getDoc(userRef);
  
      if (userSnapshot.exists()) {
        await updateDoc(userRef, {
          isDeleted: true,
        });
  
        console.log("councellor successfully deleted.");
        fetchDataFromFirestore();
      } else {
        console.log("councellors not found with ID:", userToDelete);
      }
  
      hideDeleteModal();
    } catch (error) {
      console.error("Error updating isDeleted:", error);
    }
  };
  

  const handleDeleteCancelled = () => {
    hideDeleteModal();
  };


  const handleBlockCounsellor = async (id, isBlocked, e) => {
    e.stopPropagation();
    console.log("Block button clicked for counsellor with ID:", id);
    try {
      await updateDoc(doc(firestore, "councellors", id), {
        isBlocked: !isBlocked,
      });
      fetchDataFromFirestore();
    } catch (error) {
      console.error("Error updating isBlocked:", error);
    }
  };

  const columns = [
    {
      title: "Counsellor ID",
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
      title: "Date Joined",
      dataIndex: "dateJoined",
      align: "center",
    },
    {
      title: "Total Calls received",
      dataIndex: "callCount",
      align: "center",
    },
    {
      title: "Total active time",
      dataIndex: "activeTime",
      align: "center",
    },
    {
      title: "Commutative Total minutes spent on call",
      dataIndex: "totalCallTime",
      align: "center",
    },
    {
      title: "Total chats sessions",
      dataIndex: "chatSessions",
      align: "center",
    },

    {
      title: "Total Earning",
      dataIndex: "totalEarning",
      align: "center",
    },
    {
      title: "Earning Of current month",
      dataIndex: "earningsMonth",
      align: "center",
    },
    {
      title: "Available",
      dataIndex: "available",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
    },
    {
      title: "Phone Number ",
      dataIndex: "phone",
      align: "center",
    },
    {
      title: "City",
      dataIndex: "city",
      align: "center",
    },
    {
      title: "State",
      dataIndex: "state",
      align: "center",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      align: "center",
      render: (text, record) => (
        <Space>
          <img src="/radiobtn.svg" />
          <span
            style={{ color: record.isActive ? "green" : "", fontSize: "12px" }}
          >
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
            onClick={(e) => handleDeleteCounsellor(record.id, e)}
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
            onClick={(e) =>
              handleBlockCounsellor(record.id, record.isBlocked, e)
            }
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

  // const fetchDataFromFirestore = async () => {
  //   try {
  //     const querySnapshot = await getDocs(collection(firestore, "councellors"));
  //     const firebaseData = querySnapshot.docs
  //       .map((doc) => ({ id: doc.id, ...doc.data() }))
  //       .filter((counsellor) => !counsellor.isDeleted);
  //       console.log(firebaseData, "counsellor data");
  //     setInitialData(firebaseData);
  //     setDisplayedData(firebaseData.slice(0, 10));
  //     setTotalRecords(firebaseData.length);
  //   } catch (error) {
  //     console.error("Error fetching data from Firebase:", error);
  //   }
  // };
  
  const fetchDataFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "councellors"));
      const firebaseData = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((counsellor) => !counsellor.isDeleted);
  
      console.log(firebaseData, "counsellor data");
  
      const updatedFirebaseData = firebaseData.map((counsellor) => {
        const timestampObject = counsellor.dateJoined;
  
        if (timestampObject && timestampObject.seconds && timestampObject.nanoseconds !== undefined) {
          const dateJoined = new Date(timestampObject.seconds * 1000 + timestampObject.nanoseconds / 1e6);
          return {
            ...counsellor,
            dateJoined: dateJoined.toISOString().split('T')[0],
          };
        } else {
          return counsellor;
        }
      });
  
      setInitialData(updatedFirebaseData);
      setDisplayedData(updatedFirebaseData.slice(0, 10));
      setTotalRecords(updatedFirebaseData.length);
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
    }
  };
  

  const handleSearch = (value) => {
    setSearchText(value);

    const filteredData = initialData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setDisplayedData(filteredData);
    setTotalRecords(filteredData.length);
  };

  const handleDeleteAll = async () => {
    try {
      const selectedCounsellorIds = selectedRowKeys;
      for (const id of selectedCounsellorIds) {
        await updateDoc(doc(firestore, "councellors", id), {
          isDeleted: true,
        });
      }
      fetchDataFromFirestore();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Error updating isDeleted:", error);
    }
  };

  // const handleUpdateCounsellor = async () => {
  //   try {
  //     const values = await updateCounsellorForm.validateFields();
  //     const updatedData = {
  //       firstName: values.firstName,
  //       lastName: values.lastName,
  //       dateJoined: values.dateJoined.toDate(), 
  //       email: values.email,
  //       phone: values.phone,
  //       city: values.city,
  //       state: values.state,
  //     };

  //     await updateDoc(
  //       doc(firestore, "councellors", selectedUser.id),
  //       updatedData
  //     );

  //     updateCounsellorForm.setFieldsValue(updatedData);

  //     setEditModal(false);
  //     fetchDataFromFirestore();
  //   } catch (error) {
  //     console.error("Error updating counsellor:", error);
  //   }
  // };

  const rowClassName = (record, index) => {
    return "pointer-cursor";
  };


  // const handleAddCounsellor = async () => {
  //   try {
  //     const values = await addCounsellorForm.validateFields();
  
  //     const newData = {
  //      id: values.phone,
  //       firstName: values.firstName,
  //       lastName: values.lastName,
  //       dateJoined: values.dateJoined.toDate(),
  //       phone: values.phone,
  //       city: values.city,
  //       state: values.state,
  //       email: values.email,
  //       isDeleted: false,
  //       image: selectedImage
  //     };
  
  //     newData.id = values.phone;
  
  //     const docRef = await addDoc(collection(firestore, "councellors"), newData);
  
  //     addCounsellorForm.resetFields();
  //     setIsModalVisible(false);
  
  //     fetchDataFromFirestore();
  //   } catch (error) {
  //     console.error("Error adding new counsellor:", error);
  //   }
  // };
  

  const handleAddCounsellor = async () => {
    try {
      const values = await addCounsellorForm.validateFields();
  
      const newData = {
        firstName: values.firstName,
        lastName: values.lastName,
        dateJoined: values.dateJoined.toDate(),
        phone: values.phone,
        city: values.city,
        state: values.state,
        email: values.email,
        isDeleted: false,
        image: selectedImage
      };
      const counsellorRef = doc(firestore, "councellors", values.phone);
  
      await setDoc(counsellorRef, newData);
  
      addCounsellorForm.resetFields();
      setIsModalVisible(false);
  
      fetchDataFromFirestore();
    } catch (error) {
      console.error("Error adding new counsellor:", error);
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


  const shouldRenderViewAllButton = displayedData.length > 10;

  return (
    <div
      style={{
        alignItems: "center",
        overflow: "auto",
        maxHeight: "100vh",
        paddingRight: "0px",
        width: "97.5%",
      }}
    >
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
      <div style={{ marginTop: "-60px", alignItems: "center" }}>
        <Input
          className="placeholder_search"
          prefix={
            <img
              src="/search.svg"
              style={{ width: "24px", height: "24px", marginRight: "8px" }}
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
            color: "black",
            paddingTop: "5px",
          }}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <img
          className="slider"
          src="/slider.svg"
          style={{ paddingLeft: "20px", marginBottom: "-9px" }}
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
            background: "rgba(24, 64, 125, 1)",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            color: "white",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: "500",
            lineHeight: "21px",
            textAlign: "center",
            letterSpacing: "-0.022em",
            border: "none",
            fontWeight: "medium",
          }}
        >
          + Add new Counsellor
        </Button>
        {/* <Button
          onClick={loadAllData}
          style={{
            color: "rgba(0, 0, 0, 1)",
            border: "none",
            marginLeft: "110.5%",
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
              // marginLeft: "8.5%",
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
          title="Add New Counsellor"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={handleAddCounsellor}
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

         
          <Form form={addCounsellorForm} initialValues={{}}>
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
              label="Date Joined"
              name="dateJoined"
              rules={[{ required: true, message: "Please enter Joined Date" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                placeholder="Select Date"
                disabledDate={(current) =>
                  current && current > moment().endOf("day")
                }
              />
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
              label="City"
              name="city"
              // rules={[{ required: true, message: "Please enter City" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="State"
              name="state"
              // rules={[{ required: true, message: "Please enter State" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>

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
                navigate('/counsellor', { state: { selectedUser: record } });
              }
            
            },
          })}
        />
        <div
          style={{
            marginTop: "30px",
            color: "rgba(0, 0, 0, 1)",
            Weight: "500",
            fontSize: "10px",
            fontFamily: "Inter, sans-serif",
            fontWeight: "medium",
          }}
        >
          {" "}
          Showing {displayedData.length} from {totalRecords} data
        </div>
      </div>
    </div>
  );
};

export default CounsellorList;

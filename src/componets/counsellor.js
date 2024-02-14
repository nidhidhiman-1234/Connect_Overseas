import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Table,
  Input,
  Modal,
  Form,
  Space,
  DatePicker,
  Avatar,
  Radio,
} from "antd";

import { StarOutlined, StarFilled } from "@ant-design/icons";
import Layout from "../layout/layout";
import { firestore, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import {
  collection,
  getDocs,
  updateDoc,
  getDoc,
  setDoc,
  doc,
} from "firebase/firestore";

import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";

const CounsellorList = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [initialData, setInitialData] = useState([]);
  const [displayedData, setDisplayedData] = useState(initialData.slice(0, 10));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addCounsellorForm] = Form.useForm();
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);
  const [isStateModalVisible, setIsStateModalVisible] = useState(false);
  const [enteredCity, setEnteredCity] = useState("");
  const [enteredState, setEnteredState] = useState("");
  const [stateSearchText, setStateSearchText] = useState("");
  const { RangePicker } = DatePicker;
  const [statusFilter, setStatusFilter] = useState(null);
  const [isFilterListVisible, setIsFilterListVisible] = useState(false);
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
    totalEarning: "",
    activeTime: "",
    available: "",
    callCount: "",
    chatSessions: "",
    country: "",
    earningsMonth: "",
    isActive: "",
    isWaiting: "",
    rating: "",
    totalCallTime: "",
    price: "",
  });
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [order, setOrder] = useState({ name: 'asc', total: 'asc' });
  const [filtersApplied, setFiltersApplied] = useState(false);

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

  const handleFeatureChange = async (record, e) => {
    e.stopPropagation();
    try {
      const updatedIsFeatured = !record.isFeatured;
      await updateDoc(doc(firestore, "councellors", record.id), {
        isFeatured: updatedIsFeatured,
      });
      fetchDataFromFirestore();
    } catch (error) {
      console.error("Error updating isFeatured:", error);
    }
  };


  
  useEffect(() => {
    const sortData = (column, order) => {
      const sortedData = [...initialData].sort((a, b) => {
        if (order === 'asc') {
          return a[column] > b[column] ? 1 : -1;
        } else {
          return a[column] < b[column] ? 1 : -1;
        }
      });
      return sortedData;
    };
  
    const sortedData = sortData(selectedItem, order[selectedItem]);
  
    setDisplayedData(sortedData);
  }, [initialData, order, selectedItem]);


  const handleClick = (column) => {
    setOrder(prev => {
      const newOrder = prev[column] === 'asc' ? 'desc' : 'asc';
      return { ...prev, [column]: newOrder };
    });
    setSelectedItem(column);
  };

  function getArrow(order) {
    if (order === 'asc') return '↑';
    return '↓';
  }

  const columns = [
    {
      title: "Featured Councellor",
      dataIndex: "isFeatured",
      align: "center",
      render: (text, record) => (
        <span
          onClick={(e) => handleFeatureChange(record, e)}
          style={{ cursor: "pointer" }}
        >
          {record.isFeatured ? (
            <StarFilled style={{ color: "blue" }} />
          ) : (
            <StarOutlined />
          )}
        </span>
      ),
    },
    {
      title: "Counsellor ID",
      dataIndex: "id",
      align: "center",
    },
    {
      title: (
        <div onClick={() => handleClick('firstName')}>
          First Name {getArrow(order.firstName)}
        </div>
      ),
      dataIndex: "firstName",
      align: "center",
    },
 
    {
      title: (
        <div onClick={() => handleClick('lastName')}>
         Last Name {getArrow(order.lastName)}
        </div>
      ),
      dataIndex: "lastName",
      align: "center",
    },
  
    {
      title: (
        <div onClick={() => handleClick('dateJoined')}>
         Date Joined {getArrow(order.dateJoined)}
        </div>
      ),
      dataIndex: "dateJoined",
      align: "center",
    },
    {
      title: (
        <div onClick={() => handleClick('callCount')}>
          Total Calls received {getArrow(order.callCount)}
        </div>
      ),
      dataIndex: "callCount",
      align: "center",
    },
   
    {
      title: (
        <div onClick={() => handleClick('activeTime')}>
          Total active time {getArrow(order.activeTime)}
        </div>
      ),
      dataIndex: "activeTime",
      align: "center",
    },
    {
      title: (
        <div onClick={() => handleClick('totalCallTime')}>
         Commutative Total minutes spent on call {getArrow(order.totalCallTime)}
        </div>
      ),
      dataIndex: "totalCallTime",
      align: "center",
    },
    {
      title: (
        <div onClick={() => handleClick('chatSessions')}>
          Total chats sessions {getArrow(order.chatSessions)}
        </div>
      ),
      dataIndex: "chatSessions",
      align: "center",
    },

    {
      title: (
        <div onClick={() => handleClick('totalEarning')}>
          Total Earning {getArrow(order.totalEarning)}
        </div>
      ),
      dataIndex: "totalEarning",
      align: "center",
    },
    {
      title: (
        <div onClick={() => handleClick('earningsMonth')}>
          Earning Of current month {getArrow(order.earningsMonth)}
        </div>
      ),
      dataIndex: "earningsMonth",
      align: "center",
    },
 
    {
      title: (
        <div onClick={() => handleClick('Email')}>
          Email {getArrow(order.Email)}
        </div>
      ),
      dataIndex: "Email",
      align: "center",
    },
 
    {
      title: (
        <div onClick={() => handleClick('phone')}>
          Phone Number {getArrow(order.phone)}
        </div>
      ),
      dataIndex: "phone",
      align: "center",
    },
    {
      title: (
        <div onClick={() => handleClick('city')}>
        City {getArrow(order.city)}
        </div>
      ),
      dataIndex: "city",
      align: "center",
    },
    {
      title: (
        <div onClick={() => handleClick('state')}>
        State {getArrow(order.state)}
        </div>
      ),
      dataIndex: "state",
      align: "center",
    },
  
    {
      title: (
        <div onClick={() => handleClick('rating')}>
        Rating {getArrow(order.rating)}
        </div>
      ),
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

  const fetchDataFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "councellors"));
      const firebaseData = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((counsellor) => !counsellor.isDeleted);

      console.log(firebaseData, "counsellor data");

      const updatedFirebaseData = firebaseData.map((counsellor) => {
        const timestampObject = counsellor.dateJoined;

        if (
          timestampObject &&
          timestampObject.seconds &&
          timestampObject.nanoseconds !== undefined
        ) {
          const dateJoined = new Date(
            timestampObject.seconds * 1000 + timestampObject.nanoseconds / 1e6
          );
          return {
            ...counsellor,
            dateJoined: dateJoined.toISOString().split("T")[0],
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

    const filteredData = initialData.filter(
      (item) =>
        `${item.firstName} ${item.lastName}`
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        item.firstName.toLowerCase().includes(value.toLowerCase()) ||
        item.lastName.toLowerCase().includes(value.toLowerCase()) ||
        item.id.toLowerCase().includes(value.toLowerCase()) ||
        item.email.toLowerCase().includes(value.toLowerCase()) ||
        item.city.toLowerCase().includes(value.toLowerCase()) ||
        item.state.toLowerCase().includes(value.toLowerCase()) ||
        item.phone.includes(value)
    );
    setDisplayedData(filteredData);
    setTotalRecords(filteredData.length);
  };

  const handleImageClick = () => {
    console.log("Image clicked");
    setIsFilterListVisible((prevState) => !prevState);
  };

  const handleDateFilter = (dates, dateStrings) => {
    if (dates) {
      const startDate = dates[0].format("YYYY-MM-DD");
      const endDate = dates[1].format("YYYY-MM-DD");

      console.log("Start date:", startDate);
      console.log("End date:", endDate);

      const filteredData = initialData.filter((item) => {
        const itemDate = moment(item.dateJoined, "YYYY-MM-DD");
        return itemDate.isBetween(startDate, endDate, null, "[]");
      });

      setDisplayedData(filteredData);
      setTotalRecords(filteredData.length);
      setIsDatePickerVisible(false);
      setFiltersApplied(true);
    }
  };

  const handleDatePickerClick = () => {
    setIsDatePickerVisible((prevState) => !prevState);
    setIsFilterListVisible(false);
  };

  const handleStatusClick = () => {
    setIsStatusModalVisible((prevState) => !prevState);
    setIsFilterListVisible(false);
  };

  const handleStatusFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);

    console.log("Selected status:", selectedStatus);

    const filteredCounselors = initialData.filter((counselor) => {
      return counselor.isActive === (selectedStatus === "active");
    });

    console.log("Filtered counselors:", filteredCounselors);

    setDisplayedData(filteredCounselors);
    setTotalRecords(filteredCounselors.length);
    setIsStatusModalVisible(false);
    setFiltersApplied(true);
  };

  const handleStateFilter = (state) => {
    const filteredCounselors = initialData.filter((counselor) =>
      counselor.state.toLowerCase().includes(state.toLowerCase())
    );
    setDisplayedData(filteredCounselors);
    setStateSearchText("");
  };

  const handleEnterPress1 = (e) => {
    if (e.key === "Enter") {
      setIsStateModalVisible(false);
      handleStateFilter(enteredState);
      setIsFilterListVisible(false);
      setStateSearchText("");
    }
  };

  const handleCityFilter = (city) => {
    const filteredCounselors = initialData.filter((counselor) =>
      counselor.city.toLowerCase().includes(city.toLowerCase())
    );
    setDisplayedData(filteredCounselors);
    setStateSearchText("");
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      setIsCityModalVisible(false);
      handleCityFilter(enteredCity);
      setIsFilterListVisible(false);
      setStateSearchText("");
    }
  };

  const handleCityClick = () => {
    setIsCityModalVisible((prevState) => !prevState);
    setStateSearchText("");
    setIsFilterListVisible(false);
    setFiltersApplied(true);
  };

  const handleStateClick = () => {
    setIsStateModalVisible((prevState) => !prevState);
    setIsFilterListVisible(false);
    setFiltersApplied(true);
    setStateSearchText("");
  };

  const handleFeaturedCounsellorClick = () => {
    const featuredCounselors = initialData.filter(
      (counselor) => counselor.isFeatured
    );
    setDisplayedData(featuredCounselors);
    setIsFilterListVisible(false);
    setFiltersApplied(true);
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

  const rowClassName = (record, index) => {
    return "pointer-cursor";
  };

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
        image: selectedImage,
        totalEarning: "10000",
        activeTime: "200",
        available: true,
        callCount: "26",
        chatSessions: "5",
        country: "india",
        earningsMonth: "1000",
        isActive: false,
        rating: "5",
        totalCallTime: "400",
        isWaiting: "false",
        price: "10",
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

  const handleEditIconClick = (e, record) => {
    e.stopPropagation();
    setSelectedUser(record);
    fileInputRef.current.click();
  };

  const shouldRenderViewAllButton = displayedData.length > 10;

  const clearFilters = () => {
    setStatusFilter(null);
    fetchDataFromFirestore();
    setFiltersApplied(false);
    setStateSearchText("");
  };

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

      <div
        style={{ marginTop: "-60px", alignItems: "center", display: "flex" }}
      >
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
            width: "352px",
            height: "37px",
            borderRadius: "19px",
            background: "rgb(235, 235, 235)",
            border: "none",
            marginBottom: "40px",
            color: "black",
            paddingTop: "5px",
          }}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <img
          className="slider"
          src="/slider.svg"
          onClick={handleImageClick}
          alt="Filter"
          style={{ cursor: "pointer" }}
        />

        {isFilterListVisible && (
          <div
            style={{
              // position: "fixed",
              marginBottom:"-169px",
              marginLeft: "20px",
              border: "1px solid #ccc",
              padding: "10px",
              backgroundColor: "#fff",
              zIndex: 1000,
            }}
          >
            <p onClick={handleDatePickerClick}>Date of Joined</p>

            <p onClick={handleStatusClick}>Status</p>

            <p onClick={handleFeaturedCounsellorClick}>
              Featured Counsellor List
            </p>

            <p onClick={handleCityClick}>City</p>

            <p onClick={handleStateClick}>State</p>
          </div>
        )}
      </div>

      <Modal
        title="Select Date Range"
        visible={isDatePickerVisible}
        onCancel={handleDatePickerClick}
        footer={null}
      >
        <RangePicker onChange={handleDateFilter} />
      </Modal>

      <Modal
        title="Select Status"
        visible={isStatusModalVisible}
        onCancel={handleStatusClick}
        footer={null}
      >
        <Radio.Group onChange={handleStatusFilterChange} value={statusFilter}>
          <Radio value="active">Active</Radio>
          <Radio value="disabled">Disabled</Radio>
        </Radio.Group>
      </Modal>

      <Modal
        title="Select City"
        visible={isCityModalVisible}
        onCancel={handleCityClick}
        footer={null}
      >
        <input
          type="text"
          placeholder="Enter City"
          value={enteredCity}
          onChange={(e) => setEnteredCity(e.target.value)}
          onKeyPress={handleEnterPress}
        />
      </Modal>

      <Modal
        title="Select State"
        visible={isStateModalVisible}
        onCancel={handleStateClick}
        footer={null}
      >
        <input
          type="text"
          placeholder="Enter State"
          value={enteredState}
          onChange={(e) => setEnteredState(e.target.value)}
          onKeyPress={handleEnterPress1}
        />
      </Modal>

      <div>
        {filtersApplied && (
          <Button
            style={{
              backgroundColor: "#18407D",
              color: "white",
              bottom: "71px",
              left: "451px",
              borderRadius: "15px",
            }}
           
            onClick={() => {
              console.log("Clear filters button clicked");
              clearFilters();
            }}
          >
            Clear Filters
          </Button>
        )}
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
              style={{ position: "relative" }}
              onClick={handleEditIconClick}
              src={selectedImage}
              alt="Selected"
            ></Avatar>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleFileInputChange(e)}
            />

            <EditOutlined style={{ marginLeft: "-7px" }} />
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
              <Input type="text" inputMode="text" />
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
                navigate("/counsellor", { state: { selectedUser: record } });
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

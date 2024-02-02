import React, { useState, useEffect,useRef } from "react";
import { useNavigate,useLocation } from 'react-router-dom';
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
import Layout from "../../layout/layout";
import { firestore, storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL,deleteObject  } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc
} from "firebase/firestore";

import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

const UpdateCounsellor = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedUser = location.state?.selectedUser || null;
  const [updateCounsellorForm] = Form.useForm();
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
 
  const [initialData, setInitialData] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      updateCounsellorForm.setFieldsValue(selectedUser);
      setSelectedImage(selectedUser.image);
    }
  }, [selectedUser]);

  const handleUpdateCounsellor = async () => {
    try {
      const values = await updateCounsellorForm.validateFields();
      const updatedData = {
        firstName: values.firstName,
        lastName: values.lastName,
        dateJoined: values.dateJoined,
        email: values.email,
        phone: values.phone,
        city: values.city,
        state: values.state,
        image: selectedImage,
      };

      await updateDoc(
        doc(firestore, "councellors", selectedUser.id),
        updatedData
      );
      navigate('/counsellorlist'); 

    } catch (error) {
      console.error("Error updating counsellor:", error);
    }
  };

  const fetchDataFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "councellors"));
      const firebaseData = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((counsellor) => !counsellor.isDeleted);
      setInitialData(firebaseData);
     console.log(firebaseData,"new data profile")
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
    }
  };

  
  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  
  // const handleFileInputChange = (e) => {
  //   const selectedFile = e.target.files[0];
  
  //   if (selectedFile) {
  //     const uniqueFilename = `${Date.now()}-${uuidv4()}`;
  //     const storageRef = ref(storage, `avatars/${uniqueFilename}`);
  
  //     uploadBytes(storageRef, selectedFile)
  //       .then((snapshot) => {
  //         console.log("Image uploaded successfully:", snapshot);
  //         return getDownloadURL(snapshot.ref);
  //       })
  //       .then((downloadURL) => {
  //         console.log("Download URL:", downloadURL);
  //         setSelectedImage(downloadURL);
  
  //         const adminDocRef = doc(firestore, "councellors", selectedUser.id);
  
  //         updateDoc(adminDocRef, {
  //           image: downloadURL,
  //         })
  //           .then(() => {
  //             console.log("Image URL updated in Firestore");
  //           })
  //           .catch((error) => {
  //             console.error("Error updating image URL in Firestore:", error);
  //           });
  //       })
  //       .catch((error) => {
  //         console.error("Error uploading image:", error);
  //       });
  //   }
  // };
  

  const handleFileInputChange = async (e) => {
    const selectedFile = e.target.files[0];
  
    if (selectedFile) {
      let oldImageUrl = null;
      const adminDocRef = doc(firestore, "councellors", selectedUser.id);
      const adminDocSnapshot = await getDoc(adminDocRef);
  
      if (adminDocSnapshot.exists()) {
        const data = adminDocSnapshot.data();
        oldImageUrl = data.image || null;
      }
  
      if (oldImageUrl) {
        const oldImageRef = ref(storage, oldImageUrl);
        try {
          await deleteObject(oldImageRef);
          console.log("Old image deleted successfully");
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }
  
      const uniqueFilename = `${Date.now()}-${uuidv4()}`;
      const storageRef = ref(storage, `avatars/${uniqueFilename}`);
  
      uploadBytes(storageRef, selectedFile)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then((downloadURL) => {
          console.log("Download URL:", downloadURL);
          setSelectedImage(downloadURL);
  
          return updateDoc(adminDocRef, {
            image: downloadURL,
          });
        })
        .then(() => {
          console.log("Image URL updated in Firestore");
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };
  


  const handleEditIconClick = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
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
      <div style={{ marginTop: "-60px", alignItems: "center" ,width: "50%" }}>
        
            <Form
              form={updateCounsellorForm}
              onFinish={handleUpdateCounsellor}
            >
             
         
                   <div >
               
            <Avatar
         
              size={64}
              icon={<UserOutlined />}
              style={{ position: 'relative',
                width: '64px',
                height: '64px',
                lineHeight: '64px',
                fontSize: '32px',
                marginBottom: '28px',
            }}
              onClick={handleEditIconClick}
              src={selectedImage} alt="Selected"
              
            >
            
            </Avatar>
        
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
              
            />
        
            <EditOutlined style={{ marginLeft: '-7px' }} />
            
    </div>
 

       {/* {initialData.map((counselor) => (
                   <div key={counselor.id}>
               
            <Avatar
         
              size={64}
              icon={<UserOutlined />}
              style={{ position: 'relative',
                width: '64px',
                height: '64px',
                lineHeight: '64px',
                fontSize: '32px',
                marginBottom: '28px',
            }}
            onClick={() => handleEditIconClick(counselor)}
                src={counselor.id === selectedUser?.id ? selectedImage : counselor.image}
                alt={`${counselor.firstName}`}
              >
            
            </Avatar>
        
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
              
            />
        
            <EditOutlined style={{ marginLeft: '-7px' }} />
            
    </div>
 ))} */}

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
                 inputMode="text"
                 />
              </Form.Item>
              <Form.Item label="Last Name" name="lastName">
                <Input />
              </Form.Item>

               <Form.Item
              label="Date Joined"
              name="dateJoined"
              
            >
              {/* <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                placeholder="Select Date"
                disabledDate={(current) =>
                  current && current > moment().endOf("day")
                }
              /> */}
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
                rules={[
                  { required: true, message: "Please enter Phone Number" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit phone number",
                  },
                ]}
              >
                <Input 
                type="phone"
                maxLength={10} />
              </Form.Item>
              <Form.Item label="City" name="city">
                <Input />
              </Form.Item>
              <Form.Item label="State" name="state">
                <Input />
              </Form.Item>
              <div style={{ textAlign: "right" }}>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
                {/* <Button onClick={() => setEditModal(false)}>Cancel</Button> */}
              </div>
            </Form>
    
      </div>
    </div>
  );
};

export default UpdateCounsellor;

import React, { useState, useEffect, useRef } from "react";
import Layout from "../../layout/layout";
import { Form, Input, Button, message, Upload } from "antd";
// import { UploadOutlined,SmileOutlined  } from "@ant-design/icons";
import RatingStars from "react-rating-stars-component";
import { useNavigate, useLocation } from "react-router-dom";
import { firestore, storage } from "../../config/firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    getDoc
  } from "firebase/firestore";

const AddAdvertisement = ({}) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleFormSubmit = async (values) => {
        try {
          const docRef = await addDoc(collection(firestore, "advertisements"), {
            title: values.title,
            description: values.description,
          });
    
          console.log("Advertisement added with ID: ", docRef.id);
    
          message.success("Advertisement added successfully!");
    
          navigate('/dashboard');
        } catch (error) {
          console.error("Error adding advertisement: ", error.message);
          message.error("Failed to add advertisement. Please try again.");
        }
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
      <h2>Add Advertisement</h2>

      <Form
        form={form}
        clabelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleFormSubmit}
        initialValues={{ rating: 0 }}
      >
         {/* <Form.Item label="Logo" name="logo">
          <Upload>
            <Button icon={<UploadOutlined />}>Upload Logo</Button>
          </Upload>
        </Form.Item> */}

        <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter the title!' }]}>
          <Input style={{ width: "50%", height: 50 }} />
        </Form.Item>

        {/* <Form.Item label="Rating" name="rating">
          <RatingStars
            count={5}
            size={24}
            value={0} 
            // onChange={(newValue) => form.setFieldsValue({ rating: newValue })}
          />
        </Form.Item> */}

        <Form.Item  label="Content description"
          name="description"  rules={[
            {
              required: true,
              message: "Please enter content!",
            },
            {
              max: 140,
              message: "Content should be maximum 140 characters!",
            },
          ]}>
          <Input.TextArea
            style={{ width: "100%", height: 100 }}
            
          />
        </Form.Item>

        <Form.Item>

        <Button
            type="primary"
            htmlType="submit"
           
          >
            Add Advertisement
          </Button>
          
        </Form.Item>

      </Form>
    </div>
  );
};

export default AddAdvertisement;


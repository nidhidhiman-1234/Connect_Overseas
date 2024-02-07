import React, { useState } from "react";
import Layout from "../../layout/layout";
import { Form, Input, Button, message, Upload } from "antd";
import RatingStars from "react-rating-stars-component";
import { useNavigate } from "react-router-dom";
import { firestore, storage } from "../../config/firebase";
import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { UploadOutlined, SmileOutlined } from "@ant-design/icons";

const AddAdvertisement = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [logo, setLogo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [link, setLink] = useState("");
  const [fileList, setFileList] = useState([]);

  // const handleFormSubmit = async () => {
  //   try {

  //     console.log("Current image state:", logo);
  //     const newPost = {
  //       timestamp: serverTimestamp(),
  //       title,
  //       rating,
  //       description,
  //       link,
  //     };

  //     if (Array.isArray(logo)) {
  //       const logoUrls = await Promise.all(
  //         logo.map(async (image) => {
  //           const uniqueFilename = `${Date.now()}-${uuidv4()}`;
  //           const storageRef = ref(storage, `AdvtImages/${uniqueFilename}`);
  //           await uploadBytes(storageRef, image);
  //           return getDownloadURL(storageRef);
  //         })
  //       );

  //       newPost.logo = logoUrls;
  //     } 
  //     await addDoc(collection(firestore, "advertisements"), newPost);

  //     form.resetFields();
  //     setTitle("");
  //     setDescription("");
  //     setRating(0);
  //     setLogo(null);
  //     setFileList([]);
  //     message.success("Advertisement added successfully!");

  //     navigate("/advertisements");
  //   } catch (error) {
  //     console.error("Error adding new advertisement:", error);
  //     message.error(
  //       "Failed to add advertisement. Please check the form fields and try again."
  //     );
  //   }
  // };


  const handleFormSubmit = async () => {
    try {
      console.log("Current image state:", logo);
      const newPost = {
        timestamp: serverTimestamp(),
        title,
        rating,
        description,
        link,
      };
  
      if (Array.isArray(logo)) {
        const logoUrl = await uploadLogo(logo[0]); 
        newPost.logo = logoUrl;
      }
  
      await addDoc(collection(firestore, "advertisements"), newPost);
  
      form.resetFields();
      setTitle("");
      setDescription("");
      setRating(0);
      setLogo(null);
      message.success("Advertisement added successfully!");
  
      navigate("/advertisements");
    } catch (error) {
      console.error("Error adding new advertisement:", error);
      message.error(
        "Failed to add advertisement. Please check the form fields and try again."
      );
    }
  };
  
  const uploadLogo = async (file) => {
    const uniqueFilename = `${Date.now()}-${uuidv4()}`;
    const storageRef = ref(storage, `AdvtImages/${uniqueFilename}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };


  return (
    <div>
      <Layout />
      <h2>Add Advertisement</h2>

      <Form
        form={form}
        onFinish={handleFormSubmit}
        initialValues={{ rating: 0 }}
      >

      <Form.Item label="Logo" name="logo" rules={[{ required: true, message: "Upload logo!" }]}>
  <Upload
    beforeUpload={(file) => {
      setLogo([file]); 
      return false; 
    }}
    fileList={logo ? [logo[0]] : []} 
    onRemove={() => setLogo(null)}
  >
    <Button icon={<UploadOutlined />} >
      Upload Logo
    </Button>
  </Upload>
</Form.Item>

        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the title!" }]}
        >
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>

        <Form.Item label="Rating" name="rating">
          <RatingStars
            count={5}
            size={24}
            value={rating}
            onChange={(newRating) => setRating(newRating)}
          />
        </Form.Item>

        <Form.Item
          label="Content description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please enter content!",
            },
            {
              max: 140,
              message: "Content should be maximum 140 characters!",
            },
          ]}
        >
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Link"
          name="link"
          rules={[{ required: true, message: "Please enter the link!" }]}
        >
          <Input value={link} onChange={(e) => setLink(e.target.value)} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Advertisement
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddAdvertisement;

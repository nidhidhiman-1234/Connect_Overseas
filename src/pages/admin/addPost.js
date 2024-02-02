import React, { useState, useEffect, useRef } from "react";
import Layout from "../../layout/layout";
import { Form, Input, Button, message, Upload } from "antd";
import { UploadOutlined,SmileOutlined  } from "@ant-design/icons";
import { firestore, storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate, useLocation } from "react-router-dom";
import EmojiPicker from "react-emoji-picker";
import emojify from "emoji-dictionary";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import CustomInputWithEmoji from "../../utils/emojis";
import Linkify from 'react-linkify';

const AddPost = ({}) => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [inputValue1, setInputValue1] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  // const handleAddPost = async () => {
  //   try {
  //     const values = await form.validateFields();

  //     // if (values.title === undefined || values.content === undefined) {
  //     //   throw new Error("Title and Content are required fields");
  //     // }

  //     const newPost = {
  //       title: values.title,
  //       content: values.content,
  //       timestamp: serverTimestamp(),
  //     };

    
  //     if (values.image) {
  //       const uniqueFilename = `${Date.now()}-${uuidv4()}`;
  //       const storageRef = ref(storage, `postImages/${uniqueFilename}`);

  //       const contentType = values.image.type;
  //       const metadata = { contentType };

  //       await uploadBytes(storageRef, values.image, metadata);

  //       const downloadURL = await getDownloadURL(storageRef);
  //       console.log("Download URL:", downloadURL);

  //       newPost.image = downloadURL;
  //       setPreviewImage(downloadURL);
  //     }

  //     await addDoc(collection(firestore, "posts"), newPost);
  //     navigate("/dashboard");
  //     form.resetFields();
  //     message.success("Post added successfully!");
  //     console.log("inputValue1 after:", inputValue1);
  //   } catch (error) {
  //     console.error("Error adding new post:", error);
  //     message.error(
  //       "Failed to add post. Please check the form fields and try again."
  //     );
  //   }
  // };

  // const handleAddPost = async (e) => {
  //   try {
  //     const values = await form.validateFields();
      
  //     const newPost = {
  //       title: values.title,
  //       content: values.content,
  //       timestamp: serverTimestamp(),
  //     };
  
  //     const selectedFile = values.image[0];
  //     console.log("Selected File:", selectedFile);
  
  //     if (selectedFile) {
  //       const uniqueFilename = `${Date.now()}-${uuidv4()}`;
  //       const storageRef = ref(storage, `postImages/${uniqueFilename}`);
  
  //       await uploadBytes(storageRef, selectedFile);
  
  //       const downloadURL = await getDownloadURL(storageRef);
  //       console.log("Download URL:", downloadURL);
  
  //       newPost.image = downloadURL;
  //     }
  
  //     await addDoc(collection(firestore, "posts"), newPost);
      
  //     form.resetFields();
  //     message.success("Post added successfully!");
      
  //     navigate("/dashboard");
  //   } catch (error) {
  //     console.error("Error adding new post:", error);
  //     message.error(
  //       "Failed to add post. Please check the form fields and try again."
  //     );
  //   }
  // };
  
  const handleAddPost = async () => {
    try {
      const values = await form.validateFields();
      const newPost = {
        timestamp: serverTimestamp(),
      };
  
      if (values.title) {
        newPost.title = values.title;
      }
  
      if (values.content) {
        newPost.content = values.content;
      }
  
      const selectedFile = values.image ? values.image[0] : null;
  console.log(values.image ,"values.image values.image ")
      if (selectedFile) {
        const uniqueFilename = `${Date.now()}-${uuidv4()}`;
        const storageRef = ref(storage, `postImages/${uniqueFilename}`);
  console.log(storageRef,"storageRefstorageRef")
        await uploadBytes(storageRef, selectedFile);
  
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Download URL:", downloadURL);
  
        newPost.image = downloadURL;
      }
  
      await addDoc(collection(firestore, "posts"), newPost);
  
      form.resetFields();
      message.success("Post added successfully!");
  
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding new post:", error);
      message.error(
        "Failed to add post. Please check the form fields and try again."
      );
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
      <h2>Add Post</h2>

      <Form
        form={form}
        onFinish={handleAddPost}
        clabelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="Title"
          name="title"
          // rules={[{ required: true, message: "Please enter the title" }]}
        >
            {/* <CustomInputWithEmoji inputValue={inputValue} setInputValue={setInputValue} /> */}
         
            <Input style={{ width: "50%", height: 50 }} /> 
        </Form.Item>
        <Form.Item
  label="Content"
  name="content"
  // rules={[{ required: true, message: "Please enter the content" }]}
>
  {/* <div style={{ display: "flex" }}>
    <CustomInputWithEmoji
      inputValue={inputValue1}
      setInputValue={setInputValue1}
    />
  </div> */}
    <Input.TextArea style={{ width: "100%", height: 200 }} /> 
</Form.Item>
        
<Form.Item label="Image" name="image" getValueFromEvent={(e) => e.fileList}>
  <Upload
    accept="image/*"
    showUploadList={false}
    beforeUpload={() => false}
    onPreview={(file) => setPreviewImage(file.url)}
  >
    <Button style={{ marginBottom: "20px" }} icon={<UploadOutlined />}>
      Upload Image
    </Button>
  </Upload>
</Form.Item>


        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Post
          </Button>
        </Form.Item>

        {previewImage && (
  <div>
    <p>Preview:</p>
    <img src={previewImage} alt="Preview" style={{ maxWidth: "100%" }} />
  </div>
)}
      </Form>
    </div>
  );
};

export default AddPost;

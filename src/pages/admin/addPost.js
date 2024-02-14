import React, { useState, useEffect, useRef } from "react";
import Layout from "../../layout/layout";
import { Form, Input, Button, message, Upload } from "antd";
import { UploadOutlined,SmileOutlined  } from "@ant-design/icons";
import { firestore, storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";



const AddPost = ({}) => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [images, setImages] = useState([]);

 
  const handleAddPost = async () => {
    try {
      console.log("Current image state:", images);
  
      const newPost = {
        timestamp: serverTimestamp(),
      };
  
      if (title) {
        newPost.title = title;
      }
  
      if (content) {
        newPost.content = content;
      }
  
      if (images.length > 0) {
        const imageUrls = await Promise.all(
          images.map(async (image) => {
            const uniqueFilename = `${Date.now()}-${uuidv4()}`;
            const storageRef = ref(storage, `postImages/${uniqueFilename}`);
            await uploadBytes(storageRef, image);
            return getDownloadURL(storageRef);
          })
        );
  
        newPost.images = imageUrls;
      }
  
      await addDoc(collection(firestore, "posts"), newPost);
  
      form.resetFields();
      setTitle("");
      setContent("");
      setImages(null);
      setPreviewImage(null);
      setFileList([]);
      message.success("Post added successfully!");
  
      navigate("/posts");
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
        <Form.Item label="Title" name="title" 
        rules={[{max: 250,message: "Title should be maximum 250 characters!",
      },]}>
  <Input
    style={{ width: "50%", height: 50, overflow: "hidden", whiteSpace: "nowrap" }}
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    
  />
</Form.Item>
<Form.Item label="Content" name="content">
  <Input.TextArea
    style={{ width: "100%", height: 200, overflow: "hidden", whiteSpace: "nowrap" }}
    value={content}
    onChange={(e) => setContent(e.target.value)}
  />
</Form.Item>


<Form.Item label="Image" name="image" getValueFromEvent={() => []}>
  <Upload
    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
    listType="picture"
    defaultFileList={[...fileList]}
    className="upload-list-inline"
    onPreview={(file) => setPreviewImage(file.url)}
    onChange={(info) => {
      const newFileList = [...info.fileList];

      if (newFileList.length > 3) {
        newFileList.splice(0, newFileList.length - 3);
      }

      const newImages = newFileList
        .filter((file) => file.status === "done")
        .map((file) => file.originFileObj);

      setFileList(newFileList);
      setImages(newImages);
    }}
  >
    <Button style={{ marginBottom: "20px" }} icon={<UploadOutlined />}>
      Upload Image
    </Button>
  </Upload>
</Form.Item>


        <Form.Item>

        <Button
            type="primary"
            htmlType="submit"
            disabled={!(title || content || images.length>0)}
          >
            Add Post
          </Button>
          
        </Form.Item>

      </Form>
    </div>
  );
};

export default AddPost;


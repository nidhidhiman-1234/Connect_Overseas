import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Input, Button, Upload } from "antd";
import { firestore, storage } from "../../config/firebase";
import { v4 as uuidv4 } from "uuid";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { UploadOutlined } from "@ant-design/icons";

const PostModal = ({ isOpen, onClose, selectedPost }) => {
  const [form] = Form.useForm();
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    form.resetFields();
    if (selectedPost) {
      form.setFieldsValue({
        title: selectedPost.title,
        content: selectedPost.content,
      });
      setSelectedImages(selectedPost.images || []);
    } else {
      setSelectedImages([]);
    }
  }, [selectedPost, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const post = {
        title: values.title,
        content: values.content,
        timestamp: serverTimestamp(),
        images: selectedImages,
      };

      if (selectedPost) {
        await updateDoc(
          doc(collection(firestore, "posts"), selectedPost.id),
          post
        );
      } else {
        await addDoc(collection(firestore, "posts"), post);
      }
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleImageChange = async (info) => {
    const { fileList } = info;
    const uploadedImages = fileList.map((file) => file.originFileObj);

    if (uploadedImages.length > 0) {
      try {
        const newImageUrls = await Promise.all(
          uploadedImages.map(async (image) => {
            const uniqueFilename = `${Date.now()}-${uuidv4()}`;
            const storageRef = ref(storage, `postImages/${uniqueFilename}`);
            await uploadBytes(storageRef, image);
            return getDownloadURL(storageRef);
          })
        );

        setSelectedImages((prevImages) => [...prevImages, ...newImageUrls]);
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((image, index) => index !== indexToRemove)
    );
  };

  return (
    <Modal
      title={selectedPost ? "Edit Post" : "Create Post"}
      visible={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSave}>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Content" name="content" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Images">
          <Upload
            onChange={handleImageChange}
            beforeUpload={() => false}
            multiple
          >
            <Button icon={<UploadOutlined />}>Upload Images</Button>
          </Upload>
        </Form.Item>
        <div style={{ marginTop: "16px" }}>
          {selectedImages.map((imageUrl, index) => (
            <div key={index}>
              <img
                src={imageUrl}
                alt={`Uploaded Image ${index}`}
                style={{ width: "100px", height: "100px", marginRight: "8px" }}
              />
              <Button type="link" onClick={() => handleRemoveImage(index)}>
                Remove
              </Button>
            </div>
          ))}
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PostModal;

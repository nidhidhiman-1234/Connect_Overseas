import React, { useState, useEffect, useContext } from "react";

import { Modal, Form, Input, Button } from "antd";
import { firestore, storage } from "../../config/firebase";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
  } from "firebase/firestore";

const PostModal = ({ isOpen, onClose, selectedPost }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    if (selectedPost) {
      form.setFieldsValue({
        title: selectedPost.title,
        content: selectedPost.content,
      });
    }
  }, [selectedPost, form]);

    const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const post = {
        title: values.title,
        content: values.content,
        timestamp: serverTimestamp(),
      };

      if (selectedPost) {
        await updateDoc(doc(collection(firestore, "posts"), selectedPost.id), post);
      } else {
        await addDoc(collection(firestore, "posts"), post);
      }

      onClose(); 
      window.location.reload();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };


  return (
    <Modal
      title={selectedPost ? "Edit Post" : "Create Post"}
      open={isOpen}
      onCancel={onClose}
      onOk={handleSave}
      footer={null}
    >
      <Form form={form} onFinish={handleSave}>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Content" name="content" rules={[{ required: true }]}>
            
          <Input.TextArea />
        </Form.Item>
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

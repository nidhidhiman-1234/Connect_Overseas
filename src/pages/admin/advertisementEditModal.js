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

const AdvertisementModal = ({ isOpen, onClose, selectedAdvertisement }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    if (selectedAdvertisement) {
      form.setFieldsValue({
        title: selectedAdvertisement.title,
        description: selectedAdvertisement.description,
        rating:selectedAdvertisement.rating,
        link:selectedAdvertisement.link,
      });
    }
  }, [selectedAdvertisement, form]);

    const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const advertisement = {
        title: values.title,
        description: values.description,
        timestamp: serverTimestamp(),
        rating:values.rating,
        link:values.link,
      };

      if (selectedAdvertisement) {
        await updateDoc(doc(collection(firestore, "advertisements"), selectedAdvertisement.id), advertisement);
      } else {
        await addDoc(collection(firestore, "advertisements"), advertisement);
      }

      onClose(); 
      window.location.reload();
    } catch (error) {
      console.error("Error saving advertisement:", error);
    }
  };


  return (
    <Modal
      title={selectedAdvertisement ? "Edit Post" : "Create Post"}
      open={isOpen}
      onCancel={onClose}
      onOk={handleSave}
      footer={null}
    >
      <Form form={form} onFinish={handleSave}>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Rating" name="rating" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
       
        <Form.Item label="Link" name="link" rules={[{ required: true }]}>
          <Input />
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

export default AdvertisementModal;

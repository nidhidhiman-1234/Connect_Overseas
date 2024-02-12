import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { firestore, storage } from "../../config/firebase";
import { UploadOutlined } from '@ant-design/icons';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    getDoc,
} from "firebase/firestore";

const AdvertisementModal = ({ isOpen, onClose, selectedAdvertisement }) => {
    const [form] = Form.useForm();
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        form.resetFields();
        if (selectedAdvertisement) {
            form.setFieldsValue({
                title: selectedAdvertisement.title,
                description: selectedAdvertisement.description,
                rating: selectedAdvertisement.rating,
                link: selectedAdvertisement.link,
            });
            setSelectedImages(selectedAdvertisement.logo || []);
        } else {
            setSelectedImages([]);
        }
    }, [selectedAdvertisement, form]);


    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const advertisement = {
                title: values.title,
                description: values.description,
                timestamp: serverTimestamp(),
                rating: values.rating,
                link: values.link,
                logo: selectedImages,
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

        const handleLogoChange = async (info) => {
        const { fileList } = info;
        const uploadedImages = fileList.map(file => file.originFileObj);
    
        if (uploadedImages.length > 0) {
            try {
                const newImageUrls = await Promise.all(
                    uploadedImages.map(async (image) => {
                        const uniqueFilename = `${Date.now()}-${uuidv4()}`;
                        const storageRef = ref(storage, `AdvtImages/${uniqueFilename}`);
                        await uploadBytes(storageRef, image);
                        return getDownloadURL(storageRef);
                    })
                );
    
                setSelectedImages(newImageUrls);
                console.log(newImageUrls, "Newly uploaded image URLs");
    
            } catch (error) {
                console.error("Error uploading images:", error);
            }
        }
    };


    
    return (
        <Modal
            title={selectedAdvertisement ? "Edit Post" : "Create Post"}
            visible={isOpen}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} onFinish={handleSave}>
   

{/* <Form.Item label="Logo">
    <Upload
        onChange={handleLogoChange}
        beforeUpload={() => false}
        multiple
    >
        <Button icon={<UploadOutlined />}>Upload Images</Button>
    </Upload>
    </Form.Item>
    <div style={{ marginTop: '16px' }}>
    {Array.isArray(selectedImages) && selectedImages.map((index) => (
    <img key={index}  />
))}
    </div>
    {/* <div style={{ marginTop: '16px' }}>
    {Array.isArray(selectedImages) && selectedImages.map((imageUrl, index) => (
        <img key={index} src={imageUrl} alt={`Uploaded Image ${index}`} style={{ width: '100px', height: '100px', marginRight: '8px' }} />
    ))}
</div> */} 
<Form.Item label="Logo">
    <Upload
        onChange={handleLogoChange}
        beforeUpload={() => false}
        multiple={false}
    >
        <Button icon={<UploadOutlined />}>Upload Images</Button>
    </Upload>
</Form.Item>



                <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true }]}
                >
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


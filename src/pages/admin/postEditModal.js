// import React, { useState, useEffect, useContext } from "react";

// import { Modal, Form, Input, Button,Upload } from "antd";
// import { firestore, storage } from "../../config/firebase";
// import {
//     collection,
//     addDoc,
//     updateDoc,
//     doc,
//     serverTimestamp,
//   } from "firebase/firestore";
//   import { UploadOutlined } from '@ant-design/icons';

// const PostModal = ({ isOpen, onClose, selectedPost }) => {
//   const [form] = Form.useForm();
//   const [selectedImage, setSelectedImage] = useState(null);

//   useEffect(() => {
//     form.resetFields();
//     if (selectedPost) {
//       form.setFieldsValue({
//         title: selectedPost.title,
//         content: selectedPost.content,
//       });
//     }
//   }, [selectedPost, form]);

//     const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//       const post = {
//         title: values.title,
//         content: values.content,
//         timestamp: serverTimestamp(),
//         images: selectedImage,
//       };

//       if (selectedPost) {
//         await updateDoc(doc(collection(firestore, "posts"), selectedPost.id), post);
//       } else {
//         await addDoc(collection(firestore, "posts"), post);
//       }

//       onClose(); 
//       window.location.reload();
//     } catch (error) {
//       console.error("Error saving post:", error);
//     }
//   };


//   return (
//     <Modal
//       title={selectedPost ? "Edit Post" : "Create Post"}
//       open={isOpen}
//       onCancel={onClose}
//       onOk={handleSave}
//       footer={null}
//     >
//       <Form form={form} onFinish={handleSave}>
//         <Form.Item label="Title" name="title" rules={[{ required: true }]}>
//           <Input />
//         </Form.Item>
//         <Form.Item label="Content" name="content" rules={[{ required: true }]}>
            
//           <Input.TextArea />
//         </Form.Item>
//         <Form.Item label="Images">
//                     <Upload
//                         // onChange={handleImageChange}
//                         beforeUpload={() => false}
//                         multiple
//                     >
//                         <Button icon={<UploadOutlined />}>Upload Images</Button>
//                     </Upload>
//                 </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit">
//             Save
//           </Button>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default PostModal;

import React, { useState, useEffect,useRef} from "react";
import { Modal, Form, Input, Button, Upload } from "antd";
import { firestore, storage } from "../../config/firebase";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL,deleteObject  } from "firebase/storage";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import { UploadOutlined } from '@ant-design/icons';

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
                await updateDoc(doc(collection(firestore, "posts"), selectedPost.id), post);
            } else {
                await addDoc(collection(firestore, "posts"), post);
            }
            onClose();
        } catch (error) {
            console.error("Error saving post:", error);
        }
    };
    
    const handleImageChange = async (info) => {
        const { fileList } = info;
        const uploadedImages = fileList.map(file => file.originFileObj);
    
        if (uploadedImages.length > 0) {
            const newImageUrls = await Promise.all(
                uploadedImages.map(async (image) => {
                    const uniqueFilename = `${Date.now()}-${uuidv4()}`;
                    const storageRef = ref(storage, `postImages/${uniqueFilename}`);
                    await uploadBytes(storageRef, image);
                    return getDownloadURL(storageRef);
                })
            );
    
            setSelectedImages(newImageUrls);
        } 
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

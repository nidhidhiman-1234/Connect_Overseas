// import React, { useState, useEffect, useContext } from "react";

// import { Modal, Form, Input, Button,Upload  } from "antd";
// import { firestore, storage } from "../../config/firebase";
// import { UploadOutlined } from '@ant-design/icons';
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { v4 as uuidv4 } from "uuid";
// import {
//     collection,
//     addDoc,
//     updateDoc,
//     doc,
//     serverTimestamp,
//   } from "firebase/firestore";

// const AdvertisementModal = ({ isOpen, onClose, selectedAdvertisement }) => {
//   const [form] = Form.useForm();
//   const [logoFile, setLogoFile] = useState(null);
//   useEffect(() => {
//     form.resetFields();
//     if (selectedAdvertisement) {
//       form.setFieldsValue({
//         title: selectedAdvertisement.title,
//         description: selectedAdvertisement.description,
//         rating:selectedAdvertisement.rating,
//         link:selectedAdvertisement.link,
//       });
//     }
//   }, [selectedAdvertisement, form]);

//   //   const handleSave = async () => {
//   //   try {
//   //     const values = await form.validateFields();
//   //     const advertisement = {
//   //       title: values.title,
//   //       description: values.description,
//   //       timestamp: serverTimestamp(),
//   //       rating:values.rating,
//   //       link:values.link,
//   //     };

//   //     if (selectedAdvertisement) {
//   //       await updateDoc(doc(collection(firestore, "advertisements"), selectedAdvertisement.id), advertisement);
//   //     } else {
//   //       await addDoc(collection(firestore, "advertisements"), advertisement);
//   //     }

//   //     onClose(); 
//   //     window.location.reload();
//   //   } catch (error) {
//   //     console.error("Error saving advertisement:", error);
//   //   }
//   // };

//   useEffect(() => {
//     if (selectedAdvertisement && selectedAdvertisement.logo) {
//       setLogoFile(null);
//     }
//   }, [selectedAdvertisement]);

//   const handleLogoChange = (info) => {
//     if (info.file.status === 'done') {
//       setLogoFile(info.file.originFileObj);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//       const advertisement = {
//         title: values.title,
//         description: values.description,
//         timestamp: serverTimestamp(),
//         rating: values.rating,
//         link: values.link,
//       };
//       if (logoFile) {
//         const logoUrl = await uploadLogo(logoFile);
//         advertisement.logo = logoUrl;
//       } else if (selectedAdvertisement && selectedAdvertisement.logo) {
//         advertisement.logo = selectedAdvertisement.logo;
//       }


//       if (selectedAdvertisement) {
//         await updateDoc(
//           doc(collection(firestore, "advertisements"), selectedAdvertisement.id),
//           advertisement
//         );
//       } else {
//         await addDoc(collection(firestore, "advertisements"), advertisement);
//       }

//       onClose();
//       window.location.reload();
//     } catch (error) {
//       console.error("Error saving advertisement:", error);
//     }
//   };

//   const uploadLogo = async (file) => {
//     const uniqueFilename = `${Date.now()}-${uuidv4()}`;
//     const storageRef = ref(storage, `AdvtImages/${uniqueFilename}`);
//     await uploadBytes(storageRef, file);
//     return getDownloadURL(storageRef);
//   };

//   return (
//     <Modal
//       title={selectedAdvertisement ? "Edit Post" : "Create Post"}
//       open={isOpen}
//       onCancel={onClose}
//       onOk={handleSave}
//       footer={null}
//     >
//       <Form form={form} onFinish={handleSave}>

//       <Form.Item label="Logo">
//       <Upload
//             onChange={handleLogoChange}
//             beforeUpload={() => false} 
//           >
//             <Button icon={<UploadOutlined />}>Upload Logo</Button>
//           </Upload>
         
//         </Form.Item>


//         <Form.Item label="Title" name="title" rules={[{ required: true }]}>
//           <Input />
//         </Form.Item>
//         <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            
//           <Input.TextArea />
//         </Form.Item>
//         <Form.Item label="Rating" name="rating" rules={[{ required: true }]}>
//           <Input />
//         </Form.Item>
       
//         <Form.Item label="Link" name="link" rules={[{ required: true }]}>
//           <Input />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit">
//             Save
//           </Button>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default AdvertisementModal;


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
    const [logoFile, setLogoFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        form.resetFields();
        if (selectedAdvertisement) {
            form.setFieldsValue({
                title: selectedAdvertisement.title,
                description: selectedAdvertisement.description,
                rating: selectedAdvertisement.rating,
                link: selectedAdvertisement.link,
            });
            setImageUrl(selectedAdvertisement.logo); 
        }
    }, [selectedAdvertisement, form]);

    const handleLogoChange = (info) => {
        if (info.file.status === "done") {
            setLogoFile(info.file.originFileObj);
            const url = URL.createObjectURL(info.file.originFileObj);
            setImageUrl(url);
        }
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            let logoUrl = imageUrl;

            if (logoFile) {
                logoUrl = await uploadLogo(logoFile);
            }

            const advertisement = {
                title: values.title,
                description: values.description,
                timestamp: serverTimestamp(),
                rating: values.rating,
                link: values.link,
                logo: logoUrl,
            };

            if (selectedAdvertisement) {
                await updateAdvertisement(selectedAdvertisement.id, advertisement);
            } else {
                await addAdvertisement(advertisement);
            }

            onClose();
            window.location.reload(); 
        } catch (error) {
            console.error("Error saving advertisement:", error);
        }
    };

    const uploadLogo = async (file) => {
      try {
        console.log("Uploading logo...");
        const uniqueFilename = `${Date.now()}-${uuidv4()}`;
        const storageRef = ref(storage, `AdvtImages/${uniqueFilename}`);
        console.log("Storage reference:", storageRef);
    
        await uploadBytes(storageRef, file);
        console.log("Upload successful.");
    
        const downloadUrl = await getDownloadURL(storageRef);
        console.log("Download URL:", downloadUrl);
    
        return downloadUrl;
      } catch (error) {
        console.error("Error uploading logo:", error);
        throw error;
      }
    };
    

    const addAdvertisement = async (advertisement) => {
        try {
            await addDoc(collection(firestore, "advertisements"), advertisement);
        } catch (error) {
            console.error("Error adding advertisement:", error);
            throw error;
        }
    };

    const updateAdvertisement = async (advertisementId, advertisement) => {
        try {
            await updateDoc(
                doc(collection(firestore, "advertisements"), advertisementId),
                advertisement
            );
        } catch (error) {
            console.error("Error updating advertisement:", error);
            throw error;
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
                <Form.Item label="Logo">
                    <Upload
                        onChange={handleLogoChange}
                        beforeUpload={() => false}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Upload Logo</Button>
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


import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form } from "antd";
import { TextField, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { PlusOutlined } from "@ant-design/icons";
import Layout from "../../layout/layout";
import { firestore, storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL,deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc
} from "firebase/firestore";

import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

const AdminProfile = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedUser = location.state?.adminDetails || null;

  const [selectedItem, setSelectedItem] = useState("");
  const fileInputRef = useRef(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [firebaseData, setFirebaseData] = useState([]);
  const [adminDetails, setAdminDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const fetchDataFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "admin"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched data from Firestore:", data);
      return data;
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
      return [];
    }
  };

  useEffect(() => {
    setUnsavedChanges(
      adminDetails.firstName !== "" ||
        adminDetails.lastName !== "" ||
        adminDetails.email !== "" ||
        adminDetails.phone !== "" ||
        selectedImage !== null
    );
  }, [adminDetails, selectedImage]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDataFromFirestore();
      setFirebaseData(data);
  
      const firstAdmin = data.length > 0 ? data[0] : null;
  
      if (firstAdmin) {
        setSelectedItem(firstAdmin.id);
        setAdminDetails({
          firstName: firstAdmin.firstName,
          lastName: firstAdmin.lastName,
          email: firstAdmin.email,
          phone: firstAdmin.phone,
        });
      }
    };
  
    fetchData();
  }, []);
  

  const handleSave = async () => {
    try {
      if (!selectedItem) {
        console.error("No selected item to save.");
        return;
      }
  
      const adminDocRef = doc(firestore, "admin", selectedItem);
  
      const updateData = {
        firstName: adminDetails.firstName,
        lastName: adminDetails.lastName,
        email: adminDetails.email,
        phone: adminDetails.phone,
      };
  
      if (selectedImage) {
        updateData.image = selectedImage;
      }
  
      await updateDoc(adminDocRef, updateData);
  
      navigate("/dashboard");
      console.log("Admin details updated successfully.");
      setIsDirty(false);
    } catch (error) {
      console.error("Error updating admin details:", error);
    }
  };
  

  const handleEditIconClick = (e, adminId) => {
    e.stopPropagation();

    if (adminId !== undefined) {
      console.log("Edit icon clicked for admin ID:", adminId);
      setSelectedItem(adminId);

      const selectedAdmin = firebaseData.find((admin) => admin.id === adminId);

      setAdminDetails({
        firstName: selectedAdmin.firstName,
        lastName: selectedAdmin.lastName,
        email: selectedAdmin.email,
        phone: selectedAdmin.phone,
      });

      fileInputRef.current.click();
    } else {
      console.error("Admin ID is undefined.");
    }
  };

  // const handleFileInputChange = (e) => {
  //   console.log("File input change event:", e);
  //   const selectedFile = e.target.files[0];

  //   if (selectedFile && selectedItem) {
  //     const uniqueFilename = `${Date.now()}-${uuidv4()}`;
  //     const storageRef = ref(storage, `avatars/${uniqueFilename}`);

  //     uploadBytes(storageRef, selectedFile)
  //       .then((snapshot) => getDownloadURL(snapshot.ref))
  //       .then((downloadURL) => {
  //         console.log("Download URL:", downloadURL);
  //         setSelectedImage(downloadURL);
  //         const adminDocRef = doc(firestore, "admin", selectedItem);

  //         updateDoc(adminDocRef, {
  //           image: downloadURL,
  //         })
  //           .then(() => {
  //             console.log("Image URL updated in Firestore");
  //           })
  //           .catch((error) => {
  //             console.error("Error updating image URL in Firestore:", error);
  //           });
  //       })
  //       .catch((error) => {
  //         console.error("Error uploading image:", error);
  //       });
  //   }
  // };
  const handleFileInputChange = (e) => {
    console.log("File input change event:", e);
    const selectedFile = e.target.files[0];
  
    if (selectedFile && selectedItem) {
      let oldImageUrl = null;
      const adminDocRef = doc(firestore, "admin", selectedItem);
  
      getDoc(adminDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            oldImageUrl = data.image || null;
  
            if (oldImageUrl) {
              const oldImageRef = ref(storage, oldImageUrl);
              return deleteObject(oldImageRef);
            }
          }
        })
        .then(() => {
          const uniqueFilename = `${Date.now()}-${uuidv4()}`;
          const storageRef = ref(storage, `avatars/${uniqueFilename}`);
  
          return uploadBytes(storageRef, selectedFile);
        })
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then((downloadURL) => {
          console.log("Download URL:", downloadURL);
          setSelectedImage(downloadURL);
  
          return updateDoc(adminDocRef, {
            image: downloadURL,
          });
        })
        .then(() => {
          console.log("Image URL updated in Firestore");
        })
        .catch((error) => {
          console.error("Error handling file input change:", error);
        });
    }
  };
  

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;

    setAdminDetails((prevDetails) => ({
      ...prevDetails,
      [fieldName]: value,
    }));

    setIsDirty(true);
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
      <div
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 800,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
{firebaseData.map((admin) => (
  <div key={admin.id}>
    <Avatar
      alt={admin.firstName}
      src={admin.image}
      style={{
        width: "80px",
        height: "80px",
        border: "2px solid",
        position: "relative",
        borderColor:"white"
      }}
    />
    {admin.id !== undefined && admin.id !== null && (
      <IconButton
        style={{
          position: "relative",
                    bottom: "30px",
                    left: "40px",
                    color: "black",
        }}
        onClick={(e) => handleEditIconClick(e, admin.id)}
      >
        <EditIcon />
      </IconButton>
    )}
    <input
      type="file"
      ref={fileInputRef}
      style={{ display: "none" }}
      onChange={handleFileInputChange}
    />

  </div>
))}

          <>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            style={{ width: "60%" }}
            value={adminDetails.firstName}
            onChange={(e) => handleInputChange(e, "firstName")}
          />

          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            style={{ width: "60%" }}
            value={adminDetails.lastName}
            onChange={(e) => handleInputChange(e, "lastName")}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            style={{ width: "60%" }}
            value={adminDetails.email}
            onChange={(e) => handleInputChange(e, "email")}
          />

          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            style={{ width: "60%" }}
            value={adminDetails.phone}
            onChange={(e) => handleInputChange(e, "phone")}
          />
        </>
    
        <div>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!isDirty} 
            style={{
              width: "20%",
              height: "60%",
              marginLeft: "145px",
              marginTop: "15px",
            }}
          >
            Save
          </Button>
        </div>
        
      </div>
    </div>
  );
};

export default AdminProfile;

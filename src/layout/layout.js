import React, { useState, useEffect, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import { useNavigate,useLocation  } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Avatar,
  Box,
  ListItemText,
  Modal,
  TextField,
  Button,
  input,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
// import CounsellorList from "./counsellor";
import { Link } from "react-router-dom";
import { firestore, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

export default function Layout(props: Props) {
  const navigate = useNavigate();
  const { window } = props;
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };


  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [firebaseData, setFirebaseData] = useState([]);
  const [adminDetails, setAdminDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (firebaseData.length > 0 && selectedItem) {
      const selectedAdmin = firebaseData.find(
        (admin) => admin.id === selectedItem
      );
      if (selectedAdmin) {
        setAdminDetails({
          firstName: selectedAdmin.firstName || "",
          lastName: selectedAdmin.lastName || "",
          email: selectedAdmin.email || "",
          phone: selectedAdmin.phone || "",
        });
      }
    }
  }, [selectedItem, firebaseData]);

  const handleSave = async () => {
    try {
      const adminDocRef = doc(firestore, "admin", selectedItem);
      await updateDoc(adminDocRef, {
        name: adminDetails.name,
        lastName: adminDetails.lastName,
        email: adminDetails.email,
        phone: adminDetails.phone,
        image: selectedImage,
      });

      handleCloseModal();
    } catch (error) {
      console.error("Error updating admin details:", error);
    }
  };

  const handleAvatarClick = (admin) => {
    console.log("Selected admin:", admin);
    setSelectedItem(admin.id);
    setAdminDetails({
      firstName: admin.firstName || "",
      lastName: admin.lastName || "",
      email: admin.email || "",
      phone: admin.phone || "",
    });
    navigate('/admin');
    // setOpenModal(true);
  };


  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const fileInputRef = useRef(null);

  const handleEditIconClick = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const uniqueFilename = `${Date.now()}-${uuidv4()}`;
      const storageRef = ref(storage, `avatars/${uniqueFilename}`);

      uploadBytes(storageRef, selectedFile)
        .then((snapshot) => {
          console.log("Image uploaded successfully:", snapshot);
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("Download URL:", downloadURL);
          setSelectedImage(downloadURL);

          const adminDocRef = doc(firestore, "admin", selectedItem);

          updateDoc(adminDocRef, {
            image: downloadURL,
          })
            .then(() => {
              console.log("Image URL updated in Firestore");
            })
            .catch((error) => {
              console.error("Error updating image URL in Firestore:", error);
            });
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };

  const fetchDataFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "admin"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFirebaseData(data);
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
    }
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const myStyles = {
    width: "124px",
    height: "33.29px",
    top: "30px",
    left: "52px",
    position: "absolute",
    color: "white",
    objectFit: "cover",
  };

  const itemImages = {
    Dashboard: "/dashboard.svg",
    Counsellors: "/counsellor.svg",
    Users: "/user.svg",
    Universities: "/uni.svg",
    Posts: "/uni.svg",
    Advertisements: "/uni.svg",
    Notification: "/bell.svg",
    Settings: "/settings.svg",
  };

  const drawer = (
    <Box className="sidebar">
      <Toolbar />

      <Box style={myStyles}>
        <img src={"/logo.svg"} />
        <img src={"/logo_name.svg"} />
      </Box>

      <List style={{ alignItems: "center" }}>
        {Object.entries(itemImages).map(([text, imagePath]) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={Link}
              to={
                text === "Counsellors"
                  ? "/counsellorlist"
                  : text === "Dashboard"
                  ? "/dashboard"
                  : text === "Users"
                  ? "/userlist"
                  : text === "Posts"
                  ? "/posts"
                  : text === "Advertisements"
                  ? "/advertisements"
                  : "/"
              }
              style={{
                color: selectedItem === text ? " #18407c" : "white",
                backgroundColor: selectedItem === text ? "white" : "",
                marginTop: text === "Notification" ? "240px" : "8px",
                borderRadius: "10px",
                display: "flex",
                marginLeft: "23px",
                marginRight: "23px",
                alignItems: "center",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "16px",
                fontFamily: "Inter, sans-serif",
                fontWeight: "600",
              }}
              onClick={() => setSelectedItem(text)}
            >
              <ListItemIcon>
                <img
                  src={imagePath}
                  style={{
                    width: "24px",
                    height: "24px",
                    display: "block",
                    margin: "auto",
                    color: "#18407c",
                    filter:
                      selectedItem === text
                        ? "brightness(0.8) invert(1) hue-rotate(15deg)"
                        : "",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box
        style={{
          position: "absoloute",
        }}
      >
        <Divider
          style={{
            width: "202px",
            height: "1px",
            marginLeft: "18px",
            // marginTop: "38px",
            backgroundColor: "rgba(217, 217, 217, 1)",
          }}
        />
        <>
          <List
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "3px",
            }}
          >
            {firebaseData.map((admin) => (
              <ListItem key={admin.id} disablePadding>
                <ListItemButton
                 onClick={() => handleAvatarClick(admin)}>
                  <ListItemIcon>
                    <Avatar
                      alt={admin.firstName}
                      src={admin.image}
                      style={{
                        width: "58px",
                        height: "58px",
                        border: "1px solid",
                        borderColor:"white"
                      }}
                     
                    />
                  </ListItemIcon>
                  <Box>
                    <ListItemText
                      style={{
                        marginLeft: "20px",
                        fontSize: "16px",
                        fontFamily: "Inter, sans-serif",
                      }}
                      primary="Admin Name"
                    />
                    <ListItemText
                      style={{
                        marginLeft: "20px",
                        fontSize: "12px",
                        fontFamily: "Inter, sans-serif",
                      }}
                      primary={admin.firstName}
                    />
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
 
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          onTransitionEnd={handleDrawerTransitionEnd}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
      </Box>
    </Box>
  );
}

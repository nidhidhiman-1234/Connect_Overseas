import React, { useState, useEffect, useContext } from "react";
import Layout from "../../layout/layout.js";
import { Box, Typography, Paper, Button, IconButton } from "@mui/material";
import { firestore, storage } from "../../config/firebase.js";
import { useNavigate, useLocation } from "react-router-dom";
import AdvertisementModal from "./advertisementEditModal.js";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Card, Space, Rate,Switch,Modal } from "antd";
import { Delete, Edit } from "@mui/icons-material";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
 
} from "firebase/firestore";

const Advertisement = () => {
  const navigate = useNavigate();
  const [select, setSelect] = useState(false);
  const maxContentLength = 140;
  const [advertisements, setAdvertisements] = useState([]);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [switchState, setSwitchState] = useState(true);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedAdvertisementId, setSelectedAdvertisementId] = useState(null);  

  const truncateContent = (content) => {
    if (content?.length > maxContentLength) {
      return content.substring(0, maxContentLength) + "...";
    }
    return content;
  };

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const advertisementsCollection = await getDocs(collection(firestore, "advertisements"));
        const snapshot = advertisementsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
        console.log("Fetched Advertisements:", snapshot);
        setAdvertisements(snapshot);
      } catch (error) {
        console.error("Error fetching advertisements:", error);
      }
    };
  
    fetchAdvertisements();
  }, []);

  
  const handleContactNowClick = (link) => {
    if (link) {
      window.open(link, "_blank");
    } else {
      console.log("No link available for this advertisement.");
    }
  };
  
  const handleDeleteAdvertisement = async (advertisementId) => {
    try {
      await deleteDoc(doc(firestore, "advertisements", advertisementId));
      setAdvertisements((prevAdvertisements) =>
        prevAdvertisements.filter((ad) => ad.id !== advertisementId)
      );
      console.log("Advertisement deleted successfully");
    } catch (error) {
      console.error("Error deleting advertisement:", error);
    }
  };

  const handleDeleteClick = (advertisementId) => {
    setSelectedAdvertisementId(advertisementId);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteDoc(doc(firestore, "advertisements", selectedAdvertisementId));
      setAdvertisements((prevAdvertisements) =>
        prevAdvertisements.filter((ad) => ad.id !== selectedAdvertisementId)
      );
      console.log("Advertisement deleted successfully");
      setDeleteModalVisible(false);
    } catch (error) {
      console.error("Error deleting advertisement:", error);
    }
  };

  const handleDeleteCancelled = () => {
    setDeleteModalVisible(false);
  };


  
  const handleEditClick = (advertisement) => {
    setSelectedAdvertisement(advertisement);
    setModalOpen(true);
  };

  const handleChange = async (checked, advertisementId) => {
    try {
      const advertisementRef = doc(firestore, "advertisements", advertisementId);
      await updateDoc(advertisementRef, {
        active: checked,
      });
      console.log("Advertisement updated successfully");
      setAdvertisements(prevAdvertisements =>
        prevAdvertisements.map(advertisement => {
          if (advertisement.id === advertisementId) {
            return { ...advertisement, active: checked };
          }
          return advertisement;
        })
      );
    } catch (error) {
      console.error("Error updating advertisement:", error);
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
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirmed}
        onCancel={handleDeleteCancelled}
        okText="Yes"
        cancelText="No"
      >
        Are you sure you want to delete this advertisement?
      </Modal>

      <Space direction="vertical" size={16}>
      <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: "20px", marginTop: "25px" }}
          onClick={() => {
            navigate("/advertisement");
          }}
        >
          Add New Advertisement
        </Button>
        
      {advertisements.map((advertisement) => (
        <Card
        key={advertisement.id}
        style={{
          width: "100%",
          maxWidth: 550,
          borderRadius: 20,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          position: "relative",
          border: "2px solid #e8e8e8",
          backgroundColor: "#122534",
          color: "white",
        }}
      >
        <div style={{ position: "relative", display: "flex" }}>
          <div style={{ flex: "1" }}>
            <Space>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked={advertisement.active}
                checked={advertisement.active}
                onChange={(checked) => handleChange(checked, advertisement.id)}
              />
              {advertisement.active ? "Active" : "Inactive"}
            </Space>
          </div>
  
          <div style={{ position: "absolute", top: 0, right: 0 }}>
            <IconButton
              style={{ color: "#1976D2" }}
              onClick={() => handleEditClick(advertisement)}
            >
              <Edit />
            </IconButton>
            <AdvertisementModal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              selectedAdvertisement={selectedAdvertisement}
            />
            <IconButton
              style={{ color: "#1976D2" }}
              onClick={() => handleDeleteClick(advertisement.id)}
            >
              <Delete />
            </IconButton>
          </div>
        </div>
  
        <div style={{ display: "flex", padding: "10px", overflow: "hidden" }}>
          <div style={{ flex: "1", marginRight: "60px",display: "flex", justifyContent: "center", alignItems: "center"  }}>
            <div style={{ width: "80%" }}>
              <img src={advertisement.logo} alt="Logo" style={{ width: "150%" }} />
            </div>
          </div>
          <div style={{ flex: "2",wordWrap: "break-word", wordBreak: "break-all" }}>
            <h2>{advertisement.title}</h2>
  
            <div className="star" style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <Rate value={advertisement.rating} style={{ color: "#FFD700" }} disabled />
            </div>
  
            <p style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
              {truncateContent(advertisement.description)}
            </p>
  
            <Button
              style={{ backgroundColor: "#23488B", color: "white", height: "40px", width: "216px" }}
              type="primary"
              onClick={() => handleContactNowClick(advertisement.link)}
            >
              Contact Now
            </Button>
          </div>
        </div>
      </Card>
          ))}
      </Space>

    </div>
  );
};
export default Advertisement;

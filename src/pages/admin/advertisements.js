import React, { useState, useEffect, useContext } from "react";
import Layout from "../../layout/layout.js";
import { Box, Typography, Paper, Button, IconButton } from "@mui/material";
import { firestore, storage } from "../../config/firebase.js";
import { useNavigate, useLocation } from "react-router-dom";

import { Card, Space, Rate } from "antd";
import { StarFilled } from "@ant-design/icons";

import {
  collection,
  getDocs,
 
} from "firebase/firestore";

const Advertisement = () => {
  const navigate = useNavigate();
  const [select, setSelect] = useState(false);
  const maxContentLength = 140;
  const [advertisements, setAdvertisements] = useState([]);

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
            width: "250%",
            maxWidth: 550,
            maxHeight: 400,
            borderRadius: 20,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            position: "relative",
            border: "2px solid #e8e8e8",
            backgroundColor: "#122534",
            color: "white",
          }}
        >
          <div style={{ padding: "10px", overflow: "hidden" }}>
            
          <div style={{ position: "absolute", top: 60, left: 30, width: "60%" }}>
      <img src={advertisement.logo} alt="Logo" style={{ width: "50%" }} />
    </div>
            <div style={{ marginLeft: "45%", padding: "10px", color: "white" }}>
            <h2>{advertisement.title}</h2>

            <div
        className="star"
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <Rate
          value={advertisement.rating}
          style={{ color: '#FFD700' }}
          disabled
        />
      </div>

              <p style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
                 {truncateContent(advertisement.description)}
              </p>

              <Button
  style={{
    backgroundColor: "#23488B",
    color: "white",
    height: "40px",
    width: "216px",
  }}
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

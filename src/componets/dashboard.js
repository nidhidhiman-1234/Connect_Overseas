import React, { useState, useEffect, useContext } from "react";
import Layout from "../layout/layout.js";
import { Box, Typography, Paper, Button, IconButton } from "@mui/material";
import { firestore, storage } from "../config/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import PostModal from "../pages/admin/postEditModal.js";
import Linkify from "react-linkify";
import { Link } from "react-router-dom";
import ImageModal from "../utils/ImageModal.js";
import { Card, Space, Rate } from "antd";
import { StarFilled } from "@ant-design/icons";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [rating, setRating] = useState(5);
  const [select, setSelect] = useState(false);
  const maxContentLength = 140;
  const [advertisements, setAdvertisements] = useState([]);

  const handleCardClick = (advertisementId) => {
    console.log(`Card clicked for advertisement with ID: ${advertisementId}`);
  };
  const handleStarClick = (value) => {
    setRating(value);
    setSelect(true)
  };

  const truncateContent = (content) => {
    if (content?.length > maxContentLength) {
      return content.substring(0, maxContentLength) + "...";
    }
    return content;
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  console.log("===============", rating);

  const renderStars = () => (
    <Rate
      // allowHalf
      value={rating}
      onChange={(value) => handleStarClick(value)}
      style={{ color: select ? '#FFD700' : 'white', cursor: 'pointer' }}
    />
  )

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsQuery = query(
          collection(firestore, "posts"),
          orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(postsQuery);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(data);
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(firestore, "posts", postId));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
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

  const activeAdvertisements = advertisements.filter(advertisement => advertisement.active);

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
     
      
        <h2>  Advertisements</h2>
        {activeAdvertisements.map((advertisement) => (
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
     
            <div style={{ position: "relative" }}>
            
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
          </div>
        </Card>
          ))}
      </Space>

      <Box className="dashboard">

      <h2>posts</h2>
        {posts.map((post) => (
          <Paper
            key={post.id}
            elevation={3}
            style={{
              padding: "20px",
              textAlign: "center",
              maxWidth: "600px",
              margin: "20px",
              height: "300px",
              position: "relative",
              borderRadius: "15px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              overflow: "auto",
            }}
          >
            <style>
              {`
      ::-webkit-scrollbar {
        width: 7px;
      }

      ::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 6px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: #555;
      }

      ::-webkit-scrollbar-track {
        background-color: #ddd;
        border-radius: 8px;
      }
    `}
            </style>
            <Typography
              variant="subtitle2"
              style={{
                position: "absolute",
                top: "10px",
                left: "20px",
                color: "#555",
              }}
            >
              {new Date(post.timestamp?.seconds * 1000).toLocaleString()}
            </Typography>
          
            <Typography
              style={{
                marginBottom: "20px",
                marginTop: "10px",
                // overflow: "hidden",
                // textOverflow: "ellipsis",
                maxHeight: "3em",
                // whiteSpace: "nowrap",
              }}
              variant="h5"
            >
              {post.title}
            </Typography>
            {/* <Typography variant="body1">
            <Linkify>{post.content}</Linkify>
            </Typography> */}

            <Typography
              variant="body1"
              style={{
                // overflow: "hidden",
                // textOverflow: "ellipsis",
                maxHeight: "4em",
                // whiteSpace: "nowrap",
              }}
            >
              <Linkify
                componentDecorator={(decoratedHref, decoratedText, key) => (
                  <Link to={decoratedHref} target="_blank" key={key}>
                    {decoratedText}
                  </Link>
                )}
              >
                {post.content}
              </Linkify>
            </Typography>

            {post.images && post.images?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {post.images?.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Post Image ${index + 1}`}
                    style={{
                      maxWidth: "100%",
                      margin: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleImageClick(imageUrl)}
                  />
                ))}
              </div>
            )}
          </Paper>
        ))}
        <ImageModal imageUrl={selectedImage} onClose={handleCloseImageModal} />
      </Box>
    </div>
  );
};
export default Dashboard;

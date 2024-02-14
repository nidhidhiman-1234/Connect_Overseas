import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Paper, Button, IconButton } from "@mui/material";
import Layout from "../../layout/layout.js";
import { firestore, storage } from "../../config/firebase.js";
import { useNavigate, useLocation } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import PostModal from "../../pages/admin/postEditModal.js";
import Linkify from "react-linkify";
import { Link } from "react-router-dom";
import ImageModal from "../../utils/ImageModal.js";
import { Card, Space, Rate } from "antd";

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

const Post = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);


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
    

      <Box className="dashboard">
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: "20px", marginTop: "25px" }}
          onClick={() => {
            navigate("/post");
          }}
        >
          Add New Post
        </Button>
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
            <IconButton
              style={{
                position: "absolute",
                top: "10px",
                left: "500px",
                color: "black",
              }}
              onClick={() => handleEditClick(post)}
            >
              <Edit />
            </IconButton>
            <PostModal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              selectedPost={selectedPost}
            />
            <IconButton
              style={{
                position: "absolute",
                top: "10px",
                right: "20px",
                color: "black",
              }}
              color="secondary"
              onClick={() => handleDeletePost(post.id)}
            >
              <Delete />
            </IconButton>
            <Typography
  style={{
    marginBottom: "20px",
    marginTop: "10px",
    maxHeight: "150em", 
    overflow: "hidden",
  }}
  variant="h5"
>
  {post.title}
</Typography>

<Typography
  variant="body1"
  style={{
    maxHeight: "250em", 
    overflow: "hidden",
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



            {post.images && Array.isArray(post.images) && post.images.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {post.images.map((imageUrl, index) => (
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
export default Post;

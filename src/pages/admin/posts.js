import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, IconButton, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Layout from "../../layout/layout.js";
import { firestore } from "../../config/firebase.js";
import { useNavigate } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import PostModal from "../../pages/admin/postEditModal.js";
import Linkify from "react-linkify";
import { Link } from "react-router-dom";
import ImageModal from "../../utils/ImageModal.js";
import {
  Modal,
} from "antd";

import {
  collection,
  getDocs,
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
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

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

  const handleDeleteClick = (postId) => {
    setSelectedPostId(postId);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteDoc(doc(firestore, "posts", selectedPostId));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== selectedPostId));
      setDeleteModalVisible(false);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleDeleteCancelled = () => {
    setDeleteModalVisible(false);
  };

  return (
    <div>
      <Layout />
    
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirmed}
        onCancel={handleDeleteCancelled}
        okText="Yes"
        cancelText="No"
      >
        Are you sure you want to delete this post?
      </Modal>

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
              padding: "28px",
              textAlign: "center",
              maxWidth: "600px",
              margin: "20px",
              height: "300px",
              position: "relative",
              borderRadius: "15px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              overflow: "auto",
              scrollbarWidth: "thin", 
    scrollbarColor: "#ccc #f4f4f4",
            }}
          >
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
              onClick={() => handleDeleteClick(post.id)}
            >
              <Delete />
            </IconButton>
            <Typography
              style={{
                marginBottom: "20px",
                marginTop: "10px",
                maxHeight: "150em",
                overflow: "hidden",
                wordWrap: "break-word", wordBreak: "break-all"
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
                wordWrap: "break-word", wordBreak: "break-all"
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
      </Box>
      <ImageModal imageUrl={selectedImage} onClose={handleCloseImageModal} />
    </div>
  );
};

export default Post;


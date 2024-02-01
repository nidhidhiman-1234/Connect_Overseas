import React, { useState, useEffect, useContext } from "react";
import Layout from "../layout/layout.js";
import { Box, Typography, Paper, Button, IconButton} from "@mui/material";
import { firestore, storage } from "../config/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { Delete,Edit } from "@mui/icons-material";
import PostModal from "../pages/admin/postEditModal.js";
import Linkify from 'react-linkify'; 
import { Link } from "react-router-dom";

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

  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const navigate = useNavigate();

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
          style={{ marginBottom: "20px" }}
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
             <IconButton  style={{
                position: "absolute",
                top: "10px",
                left: "500px",
                color: "black",
              }}
              onClick={() => handleEditClick(post)}>
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
              style={{ marginBottom: "20px", marginTop: "10px" }}
              variant="h5"
            >
              {post.title}
            </Typography>
            {/* <Typography variant="body1">
            <Linkify>{post.content}</Linkify>
            </Typography> */}

            <Typography variant="body1">
              <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                <Link to={decoratedHref} target="_blank" key={key}>
                  {decoratedText}
                </Link>
              )}>
                {post.content}
              </Linkify>
            </Typography>


            {post.postImage && (
              <img
                src={post.postImage}
                alt="Post Image"
                style={{ maxWidth: "100%", marginTop: "10px" }}
              />
            )}
          </Paper>
        ))}
      </Box>
    </div>
  );
};
export default Dashboard;

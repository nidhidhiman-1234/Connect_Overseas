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
    

    </div>
  );
};
export default Dashboard;

import React, { useState, useEffect, useContext } from "react";
import Layout from "../layout/layout.js";
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';

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
      <div
          style={{
            position: "absolute",
            top: "25%",
            // left: "-11px", 
            marginLeft:"-9px",
            transform: "translateY(-50%)",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            backgroundColor: "grey",
          }}
        />
      <div
        style={{
          width: "250px",
          height: "250px", 
          border: "1px solid grey",
          borderRadius: "14px",
          position: "relative",
        }}
      >
       <div
       style={{
       marginTop:"22px",
       marginLeft:"21px",
       fontSize:"18px",
      fontWeight:"550",

      }}>Top Counsellor</div>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Space wrap size={16}>
      <Avatar size={80} icon={<UserOutlined />} />
    </Space>
        </div>
   
      </div>
    </div>
  );
};
export default Dashboard;


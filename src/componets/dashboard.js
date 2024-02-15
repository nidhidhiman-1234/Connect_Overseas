import React, { useState, useEffect, useContext } from "react";
import Layout from "../layout/layout.js";
import { UserOutlined,LeftOutlined,RightOutlined} from '@ant-design/icons';
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
    position: "fixed",
    top: "25%",
    left: "283px", 
    transform: "translateY(-50%)",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#ECECEC",
    zIndex: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <LeftOutlined style={{ color: "black" }} />
</div>

<div
  style={{
    position: "fixed",
    top: "25%",
    right:"71.5%",
    transform: "translateY(-50%)",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#ECECEC",
    zIndex: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <RightOutlined style={{ color: "black" }} />
</div>
      <div
        style={{
          width: "250px",
          height: "250px", 
          border: "1px solid grey",
          borderRadius: "14px",
          position: "relative",
          marginLeft:"10px",
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
      <div
        style={{
          width: "502px",
          height: "161px", 
          border: "1px solid grey",
          borderRadius: "9px",
          position: "relative",
          marginLeft:"10px",
          marginTop:"72px",
          boxShadow: "2px 8px 16px rgba(217, 217, 217, 0.5)",
          backgroundColor: "#ffffff",
        }}
      >
        </div>
    </div>
  );
};
export default Dashboard;


import React, { useState } from 'react';
import Layout from "../../layout/layout";
import { Card, Space, Rate, Button } from 'antd';
import { StarFilled } from '@ant-design/icons';

const Advertisement = () => {
    const [rating, setRating] = useState(0);
    const maxContentLength = 140; 
    const handleCardClick = (value) => {
      setRating(value);
    };
  
    const handleStarClick = (value) => {
      setRating(value);
    };


    const truncateContent = (content) => {
        if (content.length > maxContentLength) {
          return content.substring(0, maxContentLength) + '...';
        }
        return content;
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
      <Card 
        style={{ 
          width: '250%', 
          maxWidth: 500,
          maxHeight:400,
          borderRadius: 20,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          border: '2px solid #e8e8e8', 
        }}
        onClick={() => handleCardClick(rating === 0 ? 1 : 0)}
      >
        <div style={{ padding: '10px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 130, left: 80, width: '20%' }}>
            <img src="your-logo-url" alt="Logo" style={{ maxWidth: '100%' }} />
          </div>    

          <div style={{ marginLeft: '45%', padding: '10px' }}>
            <h2>Your Title</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Rate allowHalf value={rating} onChange={handleStarClick} />
              <span style={{ marginLeft: '8px' }}>{rating > 0 ? rating + ' ' : ''}<StarFilled style={{ color: '#FFD700' }} /></span>
            </div>
            <p style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
              {truncateContent('Card contentsssssssssssssssssssssssss')}
            </p>
           
            <Button style={{ backgroundColor: '#23488B', color: 'white',height: '40px', 
    width: '216px',  }} type="primary">
Contact Now
</Button>
          </div>
        </div>
      </Card>
    </Space>
  </div>
);
    }
export default Advertisement;
import React, { useState, useEffect } from "react";
import Layout from "../layout/layout.js";
import {
  UserOutlined,
  LeftOutlined,
  RightOutlined,
  StarOutlined,
  StarFilled,
  DeleteOutlined,
} from "@ant-design/icons";
import { Avatar, Space, Popconfirm } from "antd";
import { firestore } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const [currentCounselorIndex, setCurrentCounselorIndex] = useState(0);
  const [activeCounselorsCount, setActiveCounselorsCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const counselors = [{ name: "1" }, { name: "2" }, { name: "3" }];
  useEffect(() => {
    const fetchActiveCounselors = async () => {
      try {
        const counsellorRef = collection(firestore, "councellors");
        const snapshot = await getDocs(counsellorRef);
        let activeCount = 0;
        snapshot.forEach((doc) => {
          const counselorData = doc.data();
          if (counselorData.isActive) {
            activeCount++;
          }
        });
        setActiveCounselorsCount(activeCount);
      } catch (error) {
        console.error("Error fetching active counsellors: ", error);
      }
    };

    fetchActiveCounselors();
  }, []);

  const handleLeftClick = () => {
    console.log("leftclick");
    setCurrentCounselorIndex((prevIndex) =>
      prevIndex === 0 ? counselors.length - 1 : prevIndex - 1
    );
  };

  const handleRightClick = () => {
    console.log("rightclick");
    setCurrentCounselorIndex((prevIndex) =>
      prevIndex === counselors.length - 1 ? 0 : prevIndex + 1
    );
  };

  const rating = 3;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <StarFilled key={i} style={{ color: "#FFA629", fontSize: "12px" }} />
        );
      } else {
        stars.push(<StarOutlined key={i} style={{ fontSize: "12px" }} />);
      }
    }
    return stars;
  };

  const handleDelete = (index) => {
    const updatedReviews = [...reviews];
    updatedReviews.splice(index, 1);
    setReviews(updatedReviews);
  };

  return (
    <div style={{ display: "flex", overflow: "hidden" }}>
      <Layout />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "50px",
          maxHeight: "calc(100vh - 50px)",
          width: "50%",
        }}
      >
        <div
          style={{
            width: "250px",
            height: "250px",
            border: "1px solid rgba(235, 235, 235, 1)",
            borderRadius: "14px",
            position: "relative",
            marginLeft: "-371px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              marginTop: "19px",
              marginLeft: "21px",
              fontSize: "18px",
              fontWeight: "550",
            }}
          >
            Top Counsellor
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Space wrap size={16}>
              <Avatar size={80} icon={counselors[currentCounselorIndex].name} />
            </Space>
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: "-7px",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: "#ECECEC",
              zIndex: "2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={handleLeftClick}
          >
            <LeftOutlined style={{ color: "black" }} />
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              right: "-6px",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: "#ECECEC",
              zIndex: "2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={handleRightClick}
          >
            <RightOutlined style={{ color: "black" }} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              marginTop: "90px",
              position: "relative",
              marginLeft: "10px",
              marginBottom: "20px",
              padding: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ marginTop: "41px", fontSize: "10px" }}>Earning</p>
                <div
                  style={{
                    position: "absolute",
                    width: "49px",
                    height: "7px",
                    top: "60px",
                    left: "58px",
                    transform: "translateY(-50%)",
                    backgroundImage:
                      "linear-gradient(to right, black 50%, rgba(217, 217, 217, 1) 50%)",
                  }}
                ></div>
              </div>
              <div
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    marginTop: "42px",
                    fontSize: "10px",
                    marginRight: "76px",
                  }}
                >
                  Live
                </p>
                <div
                  style={{
                    position: "absolute",
                    width: "49px",
                    height: "7px",
                    top: "60px",
                    left: "166px",
                    transform: "translateY(-50%)",
                    backgroundImage:
                      "linear-gradient(to right, black 50%, rgba(217, 217, 217, 1) 50%)",
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              marginTop: "-85px",
              position: "relative",
              marginLeft: "10px",
              marginBottom: "20px",
              padding: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ marginTop: "41px", fontSize: "10px" }}>Call</p>
                <div
                  style={{
                    position: "absolute",
                    width: "49px",
                    height: "7px",
                    top: "60px",
                    left: "58px",
                    transform: "translateY(-50%)",
                    backgroundImage:
                      "linear-gradient(to right, black 50%, rgba(217, 217, 217, 1) 50%)",
                  }}
                ></div>
              </div>
              <div
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    marginTop: "42px",
                    fontSize: "10px",
                    marginRight: "76px",
                  }}
                >
                  Chat
                </p>
                <div
                  style={{
                    position: "absolute",
                    width: "49px",
                    height: "7px",
                    top: "60px",
                    left: "166px",
                    transform: "translateY(-50%)",
                    backgroundImage:
                      "linear-gradient(to right, black 50%, rgba(217, 217, 217, 1) 50%)",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            width: "228px",
            height: "177px",
            border: "1px solid rgba(235, 235, 235, 1)",
            borderRadius: "14px",
            position: "relative",
            marginLeft: "-371px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              marginTop: "19px",
              marginLeft: "21px",
              fontSize: "16px",
              fontWeight: "550",
            }}
          >
            Active Counsellors
          </div>

          <div
            style={{
              marginTop: "19px",
              marginLeft: "21px",
              fontSize: "48px",
              fontWeight: "500",
              letterSpacing: "-0.022em",
            }}
          >
            {activeCounselorsCount || 0}
          </div>

          <div
            style={{
              marginTop: "-10px",
              marginLeft: "21px",
              fontSize: "16px",
              fontWeight: "500",
              letterSpacing: "-0.022em",
            }}
          >
            +5.11 %
          </div>
        </div>
      </div>

      {/* /////////////////////////////////////////////counselor reviews//////////////////////////////////////// */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "320px",
          maxHeight: "calc(100vh - 50px)",
          width: "50%",
          marginLeft: "4%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{ fontSize: "18px", fontWeight: "600", marginTop: "-280px" }}
          >
            Counsellor Reviews
          </div>

          <div className="review-container">
            <div className="ellips">
              <Popconfirm
                title="Are you sure you want to delete this review?"
                onConfirm={() => handleDelete()}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined style={{ fontSize: "16px" }} />
              </Popconfirm>
            </div>
            <div className="review-content">
              <div className="avatar-container">
                <Avatar shape="square" size={92} icon={<UserOutlined />} />
              </div>
              <div className="text-container">
                <p style={{ margin: "0", fontSize: "16px" }}>name</p>
                <p style={{ margin: "-5px 0 0 0", fontSize: "14px" }}>
                  {renderStars()}
                </p>
                <p
                  style={{
                    margin: "0px 0 0 0",
                    fontSize: "11px",
                    whiteSpace: "normal",
                  }}
                >
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting remaining essentially unchanged
                </p>
              </div>
            </div>
          </div>
          <div className="review-container">
            <div className="ellips">
              <Popconfirm
                title="Are you sure you want to delete this review?"
                onConfirm={() => handleDelete()}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined style={{ fontSize: "16px" }} />
              </Popconfirm>
            </div>
            <div className="review-content">
              <div className="avatar-container">
                <Avatar shape="square" size={92} icon={<UserOutlined />} />
              </div>
              <div className="text-container">
                <p style={{ margin: "0", fontSize: "16px" }}>name</p>
                <p style={{ margin: "-5px 0 0 0", fontSize: "14px" }}>
                  {renderStars()}
                </p>
                <p
                  style={{
                    margin: "0px 0 0 0",
                    fontSize: "11px",
                    whiteSpace: "normal",
                  }}
                >
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting remaining essentially unchanged
                </p>
              </div>
            </div>
          </div>
          <div className="review-container">
            <div className="ellips">
              <Popconfirm
                title="Are you sure you want to delete this review?"
                onConfirm={() => handleDelete()}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined style={{ fontSize: "16px" }} />
              </Popconfirm>
            </div>
            <div className="review-content">
              <div className="avatar-container">
                <Avatar shape="square" size={92} icon={<UserOutlined />} />
              </div>
              <div className="text-container">
                <p style={{ margin: "0", fontSize: "16px" }}>name</p>
                <p style={{ margin: "-5px 0 0 0", fontSize: "14px" }}>
                  {renderStars()}
                </p>
                <p
                  style={{
                    margin: "0px 0 0 0",
                    fontSize: "11px",
                    whiteSpace: "normal",
                  }}
                >
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting remaining essentially unchanged
                </p>
              </div>
            </div>
          </div>
          <div className="review-container">
            <div className="ellips">
              <Popconfirm
                title="Are you sure you want to delete this review?"
                onConfirm={() => handleDelete()}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined style={{ fontSize: "16px" }} />
              </Popconfirm>
            </div>
            <div className="review-content">
              <div className="avatar-container">
                <Avatar shape="square" size={92} icon={<UserOutlined />} />
              </div>
              <div className="text-container">
                <p style={{ margin: "0", fontSize: "16px" }}>name</p>
                <p style={{ margin: "-5px 0 0 0", fontSize: "14px" }}>
                  {renderStars()}
                </p>
                <p
                  style={{
                    margin: "0px 0 0 0",
                    fontSize: "11px",
                    whiteSpace: "normal",
                  }}
                >
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting remaining essentially unchanged
                </p>
              </div>
            </div>
          </div>
          <div className="review-container">
            <div className="ellips">
              <Popconfirm
                title="Are you sure you want to delete this review?"
                onConfirm={() => handleDelete()}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined style={{ fontSize: "16px" }} />
              </Popconfirm>
            </div>
            <div className="review-content">
              <div className="avatar-container">
                <Avatar shape="square" size={92} icon={<UserOutlined />} />
              </div>
              <div className="text-container">
                <p style={{ margin: "0", fontSize: "16px" }}>name</p>
                <p style={{ margin: "-5px 0 0 0", fontSize: "14px" }}>
                  {renderStars()}
                </p>
                <p
                  style={{
                    margin: "0px 0 0 0",
                    fontSize: "11px",
                    whiteSpace: "normal",
                  }}
                >
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting remaining essentially unchanged
                </p>
              </div>
            </div>
          </div>
          <div className="review-container">
            <div className="ellips">
              <Popconfirm
                title="Are you sure you want to delete this review?"
                onConfirm={() => handleDelete()}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined style={{ fontSize: "16px" }} />
              </Popconfirm>
            </div>
            <div className="review-content">
              <div className="avatar-container">
                <Avatar shape="square" size={92} icon={<UserOutlined />} />
              </div>
              <div className="text-container">
                <p style={{ margin: "0", fontSize: "16px" }}>name</p>
                <p style={{ margin: "-5px 0 0 0", fontSize: "14px" }}>
                  {renderStars()}
                </p>
                <p
                  style={{
                    margin: "0px 0 0 0",
                    fontSize: "11px",
                    whiteSpace: "normal",
                  }}
                >
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting remaining essentially unchanged
                </p>
              </div>
            </div>
          </div>
          
       
        </div>

        <style jsx>{`
          .review-container {
            margin-top: 15px;
            width: 365px;
            height: 112px;
            border: 1px solid rgba(235, 235, 235, 1);
            border-radius: 8px;
            position: relative;
            box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
          }

          .ellips {
            width: 14px;
            height: 14px;
            opacity: 0.3;
            position: absolute;
            top: 0;
            right: -16px;
            margin-top: 2px;
            margin-right: 25px;
          }

          .review-content {
            display: flex;
            align-items: center;
          }

          .avatar-container {
            width: 93px;
            height: 93px;
            border-radius: 8px;
            margin-top: 8px;
            margin-left: 9px;
          }

          .text-container {
            margin-left: 18px;
            margin-top: -3px;
            overflow: hidden;
            white-space: nowrap;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Dashboard;

// import React, { useState,  } from "react";
// import Layout from "../layout/layout.js";
// import { UserOutlined, LeftOutlined, RightOutlined,StarOutlined,StarFilled,DeleteOutlined } from '@ant-design/icons';
// import { Avatar, Space } from 'antd';

// const Dashboard = () => {

//   const [currentCounselorIndex, setCurrentCounselorIndex] = useState(0);

//   const counselors = [
//     { name: "1",},
//     { name: "2",},
//     { name: "3",},
//   ];

//   const handleLeftClick = () => {
//     console.log("leftclick")
//     setCurrentCounselorIndex(prevIndex =>
//       (prevIndex === 0 ? counselors.length - 1 : prevIndex - 1)
//     );
//   };

//   const handleRightClick = () => {
//     console.log("rightclick")
//     setCurrentCounselorIndex(prevIndex =>
//       (prevIndex === counselors.length - 1 ? 0 : prevIndex + 1)
//     );
//   };

//   const rating = 3;

//   const renderStars = () => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       if (i <= rating) {
//         stars.push(<StarFilled key={i} style={{ color: "#FFA629",fontSize: "12px" }} />);
//       } else {
//         stars.push(<StarOutlined key={i} style={{ fontSize: "12px" }}/>);
//       }
//     }
//     return stars;
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "flex-start",
//         overflow: "auto",
//         maxHeight: "100vh",
//         paddingRight: "0px",
//         width: "97.5%",
//       }}
//     >
//       <Layout />

//       <div style={{ display: "flex", flexDirection: "column", marginTop: "50px", maxHeight: "calc(100vh - 50px)",}}>
//         <div
//           style={{
//             width: "250px",
//             height: "250px",
//             // border: "1px solid grey",
//             border: "1px solid rgba(235, 235, 235, 1)",
//             borderRadius: "14px",
//             position: "relative",
//             marginLeft: "-371px",
//             marginBottom: "20px",
//           }}
//         >
//           <div
//             style={{
//               marginTop: "19px",
//               marginLeft: "21px",
//               fontSize: "18px",
//               fontWeight: "550",
//             }}
//           >
//             Top Counsellor
//           </div>

//           <div
//             style={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//             }}
//           >
//             <Space wrap size={16}>
//             <Avatar size={80} icon={counselors[currentCounselorIndex].name} />
//         </Space>
//       </div>

//       <div
//         style={{
//           position: "absolute",
//           top: "50%",
//           transform: "translateY(-50%)",
//           left: "-7px",
//           width: "30px",
//           height: "30px",
//           borderRadius: "50%",
//           backgroundColor: "#ECECEC",
//           zIndex: "2",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           cursor: "pointer",
//         }}
//         onClick={handleLeftClick}
//       >
//         <LeftOutlined style={{ color: "black" }} />
//       </div>

//       <div
//         style={{
//           position: "absolute",
//           top: "50%",
//           transform: "translateY(-50%)",
//           right: "-6px",
//           width: "30px",
//           height: "30px",
//           borderRadius: "50%",
//           backgroundColor: "#ECECEC",
//           zIndex: "2",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           cursor: "pointer",
//         }}
//         onClick={handleRightClick}
//       >
//         <RightOutlined style={{ color: "black" }} />

//           </div>

//           <div
//   style={{
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//    marginTop:"90px",
//     position: "relative",
//     marginLeft: "10px",
//     marginBottom: "20px",
//     padding: "10px",

//   }}
// >
//   <div
//     style={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: "10px",
//     }}
//   >
//        <div style={{ flexDirection: "row",
//     justifyContent: "space-between", }}>
//        <p style={{  marginTop: "41px",fontSize:"10px" }}>Earning</p>

//       <div
//         style={{
//           position: "absolute",
//           width: "49px",
//           height: "7px",
//           top:"60px",
//           left: "58px",
//           transform: "translateY(-50%)",
//           backgroundImage: "linear-gradient(to right, black 50%, rgba(217, 217, 217, 1) 50%)",
//         }}
//       ></div>
//       </div>
//           <div style={{ flexDirection: "row",
//     justifyContent: "space-between", }}>
//          <p style={{ marginTop: "42px", fontSize:"10px" ,marginRight:"76px"}}>Live</p>

//    <div
//      style={{
//        position: "absolute",
//        width: "49px",
//        height: "7px",
//        top:"60px",
//        left: "166px",
//        transform: "translateY(-50%)",
//        backgroundImage: "linear-gradient(to right, black 50%, rgba(217, 217, 217, 1) 50%)",
//      }}
//    ></div>
//     </div>
//   </div>

// </div>

// <div
//   style={{
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//    marginTop:"-85px",
//     position: "relative",
//     marginLeft: "10px",
//     marginBottom: "20px",
//     padding: "10px",

//   }}
// >
//   <div
//     style={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: "10px",
//     }}
//   >
//        <div style={{ flexDirection: "row",
//     justifyContent: "space-between", }}>
//        <p style={{  marginTop: "41px",fontSize:"10px" ,}}>Call</p>

//       <div
//         style={{
//           position: "absolute",
//           width: "49px",
//           height: "7px",
//           top:"60px",
//           left: "58px",
//           transform: "translateY(-50%)",
//           backgroundImage: "linear-gradient(to right, black 50%, rgba(217, 217, 217, 1) 50%)",
//         }}
//       ></div>
//       </div>
//           <div style={{ flexDirection: "row",
//     justifyContent: "space-between", }}>
//          <p style={{ marginTop: "42px", fontSize:"10px" ,marginRight:"76px"}}>Chat</p>

//    <div
//      style={{
//        position: "absolute",
//        width: "49px",
//        height: "7px",
//        top:"60px",
//        left: "166px",
//        transform: "translateY(-50%)",
//        backgroundImage: "linear-gradient(to right, black 50%, rgba(217, 217, 217, 1) 50%)",
//      }}
//    ></div>
//     </div>
//   </div>
// </div>
//         </div>
//        <div style={{ display: "flex", flexDirection: "column" }}>

//  <div style={{ fontSize: "18px", marginLeft:"-368px", fontWeight:"600", marginTop:"25px"}}>Counsellor Reviews</div>

//         <div className ="ellips" style={{ width: "14px", height: "14px", opacity: "0.3"}}>
//           <DeleteOutlined style={{ fontSize: "16px"}} />
//         </div>

//         <div
//           style={{
//             marginTop:"25px",
//             width: "365px",
//             height: "112px",
//             border: "1px solid rgba(235, 235, 235, 1)",
//             borderRadius: "8px",
//             position: "absolute",
//             top: "369px",
//             left: "292px",
//             boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
//           }}
//         >

//         <div
//         style={{
//           width: "93px",
//           height: "93px",
//           borderRadius: "8px",
//           position: "absolute",
//           top: "8px",
//           left: "9px",
//         }}
//       >
//         <Space>
//           <Avatar shape="square" size={92} icon={<UserOutlined />} />
//         </Space>
//       </div>

//           <div style={{ marginLeft: "127px", marginTop: "9px", overflow: "hidden",whiteSpace: "nowrap"  }}>
//           <p style={{ margin: "0", fontSize: "16px" }}>name</p>
//           <p style={{ margin: "0", fontSize: "14px", marginTop: "-5px", }}>{renderStars()}</p>
//         </div>
//         <div style={{ width: "230.78px", height: "18.78px", marginTop: "6px", marginLeft: "125px",wordWrap: "break-word", wordBreak: "break-all"  }}>
//           <p style={{ margin: "0", fontSize: "11px" ,overflow: "hidden"}}>It has survived not only five centuries,
//            but also the leap into electronic typesetting remaining essentially unchanged</p>
//         </div>
//         </div>

//         <div className ="ellips" style={{ width: "14px", height: "14px", opacity: "0.3", marginTop:"110px"}}>
//           <DeleteOutlined style={{ fontSize: "16px"}} />
//         </div>
//         <div
//           style={{
//             marginTop:"25px",
//             width: "365px",
//             height: "112px",
//             border: "1px solid rgba(235, 235, 235, 1)",
//             borderRadius: "8px",
//             position: "absolute",
//             top: "495px",
//             left: "292px",
//             boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
//           }}
//         >

//         <div
//         style={{
//           width: "93px",
//           height: "93px",
//           borderRadius: "8px",
//           position: "absolute",
//           top: "8px",
//           left: "9px",
//         }}
//       >
//         <Space>
//           <Avatar shape="square" size={92} icon={<UserOutlined />} />
//         </Space>
//       </div>

//           <div style={{ marginLeft: "127px", marginTop: "9px", overflow: "hidden",whiteSpace: "nowrap"  }}>
//           <p style={{ margin: "0", fontSize: "16px" }}>name</p>
//           <p style={{ margin: "0", fontSize: "14px", marginTop: "-5px", }}>{renderStars()}</p>
//         </div>
//         <div style={{ width: "230.78px", height: "18.78px", marginTop: "6px", marginLeft: "125px",wordWrap: "break-word", wordBreak: "break-all"  }}>
//           <p style={{ margin: "0", fontSize: "11px" ,overflow: "hidden"}}>It has survived not only five centuries,
//            but also the leap into electronic typesetting remaining essentially unchanged</p>
//         </div>
//         </div>

//         <div className ="ellips" style={{ width: "14px", height: "14px", opacity: "0.3",marginTop:"110px"}}>
//           <DeleteOutlined style={{ fontSize: "16px"}} />
//         </div>

//         <div
//           style={{
//             marginTop:"25px",
//             width: "365px",
//             height: "112px",
//             border: "1px solid rgba(235, 235, 235, 1)",
//             borderRadius: "8px",
//             position: "absolute",
//             top: "620px",
//             left: "292px",
//             boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
//           }}
//         >

//         <div
//         style={{
//           width: "93px",
//           height: "93px",
//           borderRadius: "8px",
//           position: "absolute",
//           top: "8px",
//           left: "9px",
//         }}
//       >
//         <Space>
//           <Avatar shape="square" size={92} icon={<UserOutlined />} />
//         </Space>
//       </div>

//           <div style={{ marginLeft: "127px", marginTop: "9px", overflow: "hidden",whiteSpace: "nowrap"  }}>
//           <p style={{ margin: "0", fontSize: "16px" }}>name</p>
//           <p style={{ margin: "0", fontSize: "14px", marginTop: "-5px", }}>{renderStars()}</p>
//         </div>
//         <div style={{ width: "230.78px", height: "18.78px", marginTop: "6px", marginLeft: "125px",wordWrap: "break-word", wordBreak: "break-all"  }}>
//           <p style={{ margin: "0", fontSize: "11px" ,overflow: "hidden"}}>It has survived not only five centuries,
//            but also the leap into electronic typesetting remaining essentially unchanged</p>
//         </div>
//         </div>

//       </div>

//       </div>

//     </div>
//   );
// };

// export default Dashboard;

import React, { useState } from "react";
import Layout from "../layout/layout.js";
import {
  UserOutlined,
  LeftOutlined,
  RightOutlined,
  StarOutlined,
  StarFilled,
  DeleteOutlined,
} from "@ant-design/icons";
import { Avatar, Space } from "antd";

const Dashboard = () => {
  const [currentCounselorIndex, setCurrentCounselorIndex] = useState(0);

  const counselors = [{ name: "1" }, { name: "2" }, { name: "3" }];

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

  return (
    <div style={{ display: "flex", overflow: "hidden" }}>
      <Layout />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "50px",
          maxHeight: "calc(100vh - 50px)",
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "18px",
              marginLeft: "-368px",
              fontWeight: "600",
              marginTop: "25px",
            }}
          >
            Counsellor Reviews
          </div>
          <div
            className="ellips"
            style={{ width: "14px", height: "14px", opacity: "0.3" }}
          >
            <DeleteOutlined style={{ fontSize: "16px" }} />
          </div>
          <div
            style={{
              marginTop: "25px",
              width: "365px",
              height: "112px",
              border: "1px solid rgba(235, 235, 235, 1)",
              borderRadius: "8px",
              position: "absolute",
              top: "369px",
              left: "292px",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div
              style={{
                width: "93px",
                height: "93px",
                borderRadius: "8px",
                position: "absolute",
                top: "8px",
                left: "9px",
              }}
            >
              <Space>
                <Avatar shape="square" size={92} icon={<UserOutlined />} />
              </Space>
            </div>
            <div
              style={{
                marginLeft: "127px",
                marginTop: "9px",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <p style={{ margin: "0", fontSize: "16px" }}>name</p>
              <p style={{ margin: "0", fontSize: "14px", marginTop: "-5px" }}>
                {renderStars()}
              </p>
            </div>
            <div
              style={{
                width: "230.78px",
                height: "18.78px",
                marginTop: "6px",
                marginLeft: "125px",
                wordWrap: "break-word",
                wordBreak: "break-all",
              }}
            >
              <p style={{ margin: "0", fontSize: "11px", overflow: "hidden" }}>
                It has survived not only five centuries, but also the leap into
                electronic typesetting remaining essentially unchanged
              </p>
            </div>
          </div>
          <div
            className="ellips"
            style={{
              width: "14px",
              height: "14px",
              opacity: "0.3",
              marginTop: "110px",
            }}
          >
            <DeleteOutlined style={{ fontSize: "16px" }} />
          </div>
          <div
            style={{
              marginTop: "25px",
              width: "365px",
              height: "112px",
              border: "1px solid rgba(235, 235, 235, 1)",
              borderRadius: "8px",
              position: "absolute",
              top: "495px",
              left: "292px",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div
              style={{
                width: "93px",
                height: "93px",
                borderRadius: "8px",
                position: "absolute",
                top: "8px",
                left: "9px",
              }}
            >
              <Space>
                <Avatar shape="square" size={92} icon={<UserOutlined />} />
              </Space>
            </div>
            <div
              style={{
                marginLeft: "127px",
                marginTop: "9px",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <p style={{ margin: "0", fontSize: "16px" }}>name</p>
              <p style={{ margin: "0", fontSize: "14px", marginTop: "-5px" }}>
                {renderStars()}
              </p>
            </div>
            <div
              style={{
                width: "230.78px",
                height: "18.78px",
                marginTop: "6px",
                marginLeft: "125px",
                wordWrap: "break-word",
                wordBreak: "break-all",
              }}
            >
              <p style={{ margin: "0", fontSize: "11px", overflow: "hidden" }}>
                It has survived not only five centuries, but also the leap into
                electronic typesetting remaining essentially unchanged
              </p>
            </div>
          </div>
          <div
            className="ellips"
            style={{
              width: "14px",
              height: "14px",
              opacity: "0.3",
              marginTop: "110px",
            }}
          >
            <DeleteOutlined style={{ fontSize: "16px" }} />
          </div>
          <div
            style={{
              marginTop: "25px",
              width: "365px",
              height: "112px",
              border: "1px solid rgba(235, 235, 235, 1)",
              borderRadius: "8px",
              position: "absolute",
              top: "620px",
              left: "292px",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div
              style={{
                width: "93px",
                height: "93px",
                borderRadius: "8px",
                position: "absolute",
                top: "8px",
                left: "9px",
              }}
            >
              <Space>
                <Avatar shape="square" size={92} icon={<UserOutlined />} />
              </Space>
            </div>
            <div
              style={{
                marginLeft: "127px",
                marginTop: "9px",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <p style={{ margin: "0", fontSize: "16px" }}>name</p>
              <p style={{ margin: "0", fontSize: "14px", marginTop: "-5px" }}>
                {renderStars()}
              </p>
            </div>
            <div
              style={{
                width: "230.78px",
                height: "18.78px",
                marginTop: "6px",
                marginLeft: "125px",
                wordWrap: "break-word",
                wordBreak: "break-all",
              }}
            >
              <p style={{ margin: "0", fontSize: "11px", overflow: "hidden" }}>
                It has survived not only five centuries, but also the leap into
                electronic typesetting remaining essentially unchanged
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

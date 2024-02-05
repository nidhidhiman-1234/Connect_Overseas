import React from "react";
import { Dialog, IconButton, Box } from "@mui/material";
import { Close } from "@mui/icons-material";

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <Dialog open={!!imageUrl} onClose={onClose}>
      <Box p={2}>
        <IconButton
          style={{ position: "absolute", top:10, right: 10,color: "red"  }}
        //   color="inherit"
          onClick={onClose}

        >
          <Close />
        </IconButton>
        <img
          src={imageUrl}
          alt="Post Image"
          style={{ maxWidth: "100%", maxHeight: "80vh" }}
        />
      </Box>
    </Dialog>
  );
};

export default ImageModal;

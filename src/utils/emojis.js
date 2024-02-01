// CustomInputWithEmoji.js
import React, { useState } from "react";
import { Input, Button, Popover } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import EmojiPicker from "react-emoji-picker";
import emojify from "emoji-dictionary";

const CustomInputWithEmoji = ({ inputValue = "", setInputValue, onEmojiSelect, ...props }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiSelect = (emoji) => {
    const unicodeEmoji = emojify.getUnicode(emoji);

    if (typeof onEmojiSelect === "function") {
      onEmojiSelect(unicodeEmoji);
    }

    setInputValue((prevValue) => (prevValue || "") + unicodeEmoji);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && inputValue.length > 0) {
      setInputValue((prevValue) => prevValue.slice(0, -1));
    }
  };

  return (
    <div style={{ position: "relative", width: "50%", height: "40px" }}>
      <Input
        {...props}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ height: "100%" }}
      />
      <Popover
        visible={showEmojiPicker}
        placement="bottomRight"
        content={<EmojiPicker onSelect={handleEmojiSelect} />}
        trigger="click"
      >
        <Button
          icon={<SmileOutlined />}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        />
      </Popover>
    </div>
  );
};

export default CustomInputWithEmoji;

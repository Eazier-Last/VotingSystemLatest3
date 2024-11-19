import React from "react";
import PlaceHolderLogo from "./avatarPlaceholder.png";

const AvatarComponent = ({ imgStyle, imgClassName, imgSrc }) => {
  return (
    <img
      style={imgStyle}
      src={imgSrc ? imgSrc : PlaceHolderLogo}
      alt="Avatar"
      className={imgClassName}
    />
  );
};

export default AvatarComponent;

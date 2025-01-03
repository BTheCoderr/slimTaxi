import React from "react";
import { Link } from "react-router-dom";
import errorImg from "../assets/img/errorPage.png";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  errorStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    flexDirection: "column",
  },
  contentStyle: {
    display: "flex",
    alignItems: "center",
  },
  imageStyle: {
    width: "200px",
    height: "200px",
    objectFit: "scale-down",
    marginRight: "20px",
  },
  messageContainerStyle: {
    borderLeft: "thick double #333",
    padding: "20px",
  },
  headingStyle: {
    fontSize: "36px",
    color: "#333",
  },
  messageStyle: {
    fontSize: "18px",
    color: "#555",
    margin: "20px 0",
  },
  linkStyle: {
    color: "#1E5BF7",
    textDecoration: "none",
    fontWeight: "bold",
  },
}));

const Error = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.errorStyle}>
      <div className={classes.contentStyle}>
        <img src={errorImg} className={classes.imageStyle} alt="Error" />
        <div className={classes.messageContainerStyle}>
          <h1 className={classes.headingStyle}>{ t("page_not_not_found")}</h1>
          <p className={classes.messageStyle}>
            { t("page_not_not_found_text")}
          </p>
          <Link to="/" className={classes.linkStyle}>
          { t("go_to_home")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;

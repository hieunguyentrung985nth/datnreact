import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Login from "../../components/Auth/Login";
import Detail from "../../components/Home/Detail";
import Home from "../../components/Home/Home";
import RssFeed from "../../components/Home/RssFeed";
import NotFound from "../../components/NotFound/NotFound";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import "./index.css";
import routes from "./Routes-Main";

const Main = () => {
  return (
    <>
      <Header />
      <Outlet/>
      <Footer />
      <div className="gototop js-top">
        <a href="/" className="js-gotop">
          <i className="fa fa-arrow-up"></i>
        </a>
      </div>
    </>
  );
};

export default Main;

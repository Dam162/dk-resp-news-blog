import React from "react";
import {
  Home,
  // Login,
  PageNotFound,
  EmailVerification,
  Profile,
  CreateBlog,
  Details,
  Dashboard,
  SlotsSignIn,
  SlotsSignUp
} from "../../pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const RouterNav = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/Login" element={<Login />} /> */}
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sign-in" element={<SlotsSignIn />} />
          <Route path="/sign-up" element={<SlotsSignUp />} />
          <Route path="/blog-details/:id" element={<Details />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default RouterNav;

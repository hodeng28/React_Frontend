import React from "react";
import Header from "../Organisms/Header";
import Footer from "../Organisms/Footer";
import NavSample from "../Organisms/NavSample";
import SubBookingRouter from "../../Router/SubBookingRouter";
import { useSelector, useDispatch } from "react-redux";
import PopupNotice from "../Molecules/PopupNotice";
import ModalPortal from "../../Modules/ModalPortal";
import { setOneBtn } from "../../Reducer/modalReducer";

const Booking = ({ history }) => {
  return (
    <div>
      <Header />
      <SubBookingRouter />
      <Footer />
      <NavSample />
    </div>
  );
};

export default Booking;

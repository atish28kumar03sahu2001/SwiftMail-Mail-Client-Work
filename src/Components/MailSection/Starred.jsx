// src/Components/MailSection/Starred.jsx

import React, { useEffect } from "react";
import { MailStore } from "../Store/MailStore";
import Cookies from "js-cookie";
import { FaRegStar as UnStarIcon, FaArrowAltCircleRight as RightArrowIcon, FaArrowAltCircleDown as DownArrowIcon } from "react-icons/fa";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Inbox.css";
import "../Styles/Sentbox.css";

export default function Starred() {
  const ReceiverId = Cookies.get("UserId");
  const starMessages = MailStore((state) => state.StarArray);
  const fetchStarMessages = MailStore((state) => state.fetchStarMessages);
  const unstarMessage = MailStore((state) => state.UnstarMessage);

  useEffect(() => {
    if (ReceiverId) {
      fetchStarMessages(ReceiverId);
    } else {
      console.error("ReceiverId not found in cookies");
    }
  }, [ReceiverId, fetchStarMessages]);

  const handleUnstar = (mailData) => {
    if (ReceiverId && mailData) {
      unstarMessage(ReceiverId, mailData)
        .then((response) => {
            if (response.success) {
                toast.success(response.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: "#048c01" }, });
            } else {
                toast.error(response.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: "#ff0000" }, });
            }
        })
        .catch((error) => { toast.error("An unexpected error occurred.", { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: "#ff0000" }, }); console.error("Error unstarring message:", error); });
    }
  };

  return (
    <>
      <section className="MAIL_SEC_HDR">
        <h1 className="MAIL_SEC_H1">Starred Messages Section</h1>
      </section>
      <section className="MAIL_SEC_SENT">
        {starMessages.length > 0 ? (
          starMessages.map((message, index) => (
            <details key={index} className="SENTBOX_DATA_DIV">
              <summary>
                <RightArrowIcon className="icon right-icon" size={20} color="#4b257a" />
                <DownArrowIcon className="icon down-icon" size={20} color="#4b257a" />
                <p>Starred Message {message.sendermail}</p>
              </summary>
                <p className="SENTBOX_DATA_DIV_P"><span className="SENTBOX_DATA_DIV_SPAN">From: </span>{message.sendermail}</p>
                <p className="SENTBOX_DATA_DIV_P"><span className="SENTBOX_DATA_DIV_SPAN">To: </span>{message.receivermail}</p>
                <p className="SENTBOX_DATA_DIV_P"><span className="SENTBOX_DATA_DIV_SPAN">Subject: </span>{message.mailsubject}</p>
                <p className="SENTBOX_DATA_DIV_P"><span className="SENTBOX_DATA_DIV_SPAN">Message: </span>{message.mailcompose}</p>
                <div className="BOX_BTN">
                  <button onClick={() => handleUnstar(message)} className="STRSH_BTN" title="UNSTAR MESSAGE">
                    <UnStarIcon size={20} color="#ffffff" />
                  </button>
                </div>
            </details>
          ))
        ) : (
          <p className="OTHER_P">No starred messages found.</p>
        )}
      </section>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover theme="colored" transition={Slide} />
    </>
  );
}

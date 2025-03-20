// src/Components/MailSection/Inbox.jsx

import React, { useEffect } from "react";
import { MailStore } from "../Store/MailStore";
import Cookies from "js-cookie";
import "../Styles/Inbox.css";
import "../Styles/Sentbox.css";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaStar as StarIcon, FaTrash as TrashIcon, FaArrowAltCircleRight as RightArrowIcon, FaArrowAltCircleDown as DownArrowIcon } from "react-icons/fa";

export default function Inbox() {
  const ReceiverId = Cookies.get("UserId");
  const inboxMessages = MailStore((state) => state.InBoxArray);
  const fetchInbox = MailStore((state) => state.fetchInbox);
  const starMessage = MailStore((state) => state.StarMessage);
  const TrashMessage = MailStore((state) => state.TrashMessage);

  useEffect(() => {
    if (ReceiverId) {
      fetchInbox(ReceiverId);
    } else {
      console.error("ReceiverId not found in cookies");
    }
  }, [ReceiverId, fetchInbox]);

  const handleStar = async (message) => {
    const result = await starMessage(ReceiverId, message);
    if (result.success) {
        toast.success(result.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#048c01'} });
    } else if (result.message === "Message is already in the Star section") {
        toast.warn(result.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#4b257a'} });
    } else {
        toast.error("Failed to star the message", { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: '#ff0000' } });
    }
  };

  const handleTrash = async (message) => {
    console.log(message);
    const result = await TrashMessage(ReceiverId, message);
    if (result.success) {
      toast.success(result.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: { background: "#048c01" }, });
  } else if (result.message === "Mail is already in Trash") {
      toast.warn(result.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: "#4b257a" }, });
  } else {
      toast.error("Failed to move mail to Trash", { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: "#ff0000" }, });
  }
  }

  return (
    <>
      <section className="MAIL_SEC_HDR">
        <h1 className="MAIL_SEC_H1">Inbox Section</h1>
      </section>
      <section className="MAIL_SEC_SENT">
        {inboxMessages.length > 0 ? (
          inboxMessages.map((message, index) => (
            <details key={index} className="SENTBOX_DATA_DIV">
                <summary>
                  <RightArrowIcon className="icon right-icon" size={20} color="#4b257a" />
                  <DownArrowIcon className="icon down-icon" size={20} color="#4b257a" />
                  <p>{message.sendermail} Sent You A Message</p>
                </summary>
                  <p className="SENTBOX_DATA_DIV_P"><span className="SENTBOX_DATA_DIV_SPAN">From: </span>{message.sendermail}</p>
                  <p className="SENTBOX_DATA_DIV_P"><span className="SENTBOX_DATA_DIV_SPAN">To: </span>{message.receivermail}</p>
                  <p className="SENTBOX_DATA_DIV_P"><span className="SENTBOX_DATA_DIV_SPAN">Subject: </span>{message.mailsubject}</p>
                  <p className="SENTBOX_DATA_DIV_P"><span className="SENTBOX_DATA_DIV_SPAN">Message: </span>{message.mailcompose}</p>
                  <div className="BOX_BTN">
                    <button onClick={() => handleStar(message)} className="STRSH_BTN" title="STAR MESSAGE">
                      <StarIcon color="#ffffff" size={20} />
                    </button>
                    <button onClick={() => handleTrash(message)} className="STRSH_BTN" title="TRASH MESSAGE">
                      <TrashIcon color="#ffffff" size={20} />
                    </button>
                  </div>
            </details>
          ))
        ) : (
          <p className="OTHER_P">No messages in the inbox.</p>
        )}
      </section>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover theme="colored" transition={Slide} />
    </>
  );
}
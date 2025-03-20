// src/Components/MailSection/Trash.jsx
import React, { useEffect } from "react";
import { MailStore } from "../Store/MailStore";
import Cookies from "js-cookie";
import {FaTrashAlt as DeleteIcon, FaTrashRestoreAlt as UnTrashIcon, FaArrowAltCircleRight as RightArrowIcon, FaArrowAltCircleDown as DownArrowIcon } from "react-icons/fa";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Inbox.css";
import "../Styles/Sentbox.css";

export default function Trash () {
  const ReceiverId = Cookies.get("UserId");
  const TrashMessages = MailStore((state) => state.TrashArray);
  const fetchTrashMessages = MailStore((state) => state.fetchTrashMessages);
    useEffect(() => {
      if (ReceiverId) {
        fetchTrashMessages(ReceiverId);
      } else {
        console.error("ReceiverId not found in cookies");
      }
    }, [ReceiverId, fetchTrashMessages]);

    const handleUnTrash = async (message) => {
      const response = await MailStore.getState().UnTrashMessage(ReceiverId, message);
      if (response.success) {
        toast.success(response.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: "#048c01" }, });
      } else {
        toast.error(response.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: "#ff0000" }, });
      }
    };

    const handleDeleteMessage = async (message) => {
      const response = await MailStore.getState().DeleteTrashMessage(ReceiverId, message);
      if (response.success) {
        toast.success(response.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: "#048c01" }, });
      } else {
        toast.error(response.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: "#ff0000" }, });
      }
    }

  return (
    <>
      <section className="MAIL_SEC_HDR">
        <h1 className="MAIL_SEC_H1">Trash Messages Section</h1>
      </section>
      <section className="MAIL_SEC_SENT">
        {TrashMessages.length > 0 ? (
          TrashMessages.map((message, index) => (
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
                    <button className="STRSH_BTN" title="UNTRASH MESSAGE" onClick={() => handleUnTrash(message)}>
                      <UnTrashIcon size={20} color="#ffffff" />
                    </button>
                    <button className="STRSH_BTN" title="DELETE MESSAGE" onClick={() => handleDeleteMessage(message)}>
                      <DeleteIcon size={20} color="#ffffff" />
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
  )
}
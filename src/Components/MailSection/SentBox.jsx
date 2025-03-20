// src/Components/MailSection/SentBox.jsx
import React, { useEffect } from "react";
import { MailStore } from "../Store/MailStore";
import Cookies from "js-cookie";
import "../Styles/Sentbox.css";
import { FaArrowAltCircleRight as RightArrowIcon, FaArrowAltCircleDown as DownArrowIcon } from "react-icons/fa";

export default function SentBox() {
  const SenderId = Cookies.get("UserId");
  const sentBoxMessages = MailStore((state) => state.SentBoxArray);
  const fetchSentBox = MailStore((state) => state.fetchSentBox);

  useEffect(() => {
    if (SenderId) {
      fetchSentBox(SenderId);
    } else {
      console.error("SenderId not found in cookies");
    }
  }, [SenderId, fetchSentBox]);

  return (
    <>
      <section className="MAIL_SEC_HDR">
        <h1 className="MAIL_SEC_H1">Sent Box Section</h1>
      </section>
      <section className="MAIL_SEC_SENT">
        {sentBoxMessages.length > 0 ? (
          sentBoxMessages.map((message, index) => (
            <details key={index} className="SENTBOX_DATA_DIV">
                <summary>
                  <RightArrowIcon className="icon right-icon" size={20} color="#4b257a" />
                  <DownArrowIcon className="icon down-icon" size={20} color="#4b257a" />
                  <p>{message.receivermail} Received Mail From You</p>
                </summary>
                  <p className="SENTBOX_DATA_DIV_P"><span className="SENTBOX_DATA_DIV_SPAN">From: </span>{message.sendermail}</p>
                  <p className="SENTBOX_DATA_DIV_P"><span className="SENTBOX_DATA_DIV_SPAN">To: </span>{message.receivermail}</p>
                  <p className="SENTBOX_DATA_DIV_P"><span className="SENTBOX_DATA_DIV_SPAN">Subject: </span>{message.mailsubject}</p>
                  <p className="SENTBOX_DATA_DIV_P"><span className="SENTBOX_DATA_DIV_SPAN">Message: </span>{message.mailcompose}</p>
            </details>
          ))
        ) : (
          <p className="OTHER_P">No messages in the sent box.</p>
        )}
      </section>
    </>
  );
}

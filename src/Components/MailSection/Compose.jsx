// src/Components/MailSection/Compose.jsx
import React from 'react'
import "../Styles/Compose.css";
import { MailStore } from '../Store/MailStore';
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Compose () {
  const {MailTransfer} = MailStore();
  const HandleMailSend = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const Obj = Object.fromEntries(formData.entries());

    try {
      let res = await MailTransfer(Obj);
      if(res.success) {
        toast.success(res.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#048c01'} });
        e.target.reset();
      } else {
        toast.error(res.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#ff0000'} });
      }
    } catch (error) {
      console.error("Error sending mail:", error);
      toast.error("Something went wrong!", { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#ff0000'} });
    }
  }
  return (
    <>
      <section className='CMP_SEC_H1'>
        <h1 className='CMP_H1'>Compose Section</h1>
      </section>
      <section className='CMP_FRM_SEC' onSubmit={HandleMailSend}>
        <form className='CMP_FRM'>
          <input type='text' id='sendermail' name='sendermail' placeholder='Enter Sender Mail' className='FRMIP' />
          <input type='text' id='receivermail' name='receivermail' placeholder='Enter Receiver Mail' className='FRMIP' />
          <input type='text' id='mailsubject' name='mailsubject' placeholder='Enter Subject Mail' className='FRMIP' />
          <textarea id='mailcompose' name='mailcompose' placeholder='Enter Mail' rows="20" cols="200" className='FRMIP TXTAR' />
          <div className='BTN_DIV'>
            <input type='submit' value='Send Mail' className='SBMT_BTN' />
          </div>
        </form>
      </section>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover theme="colored" transition={Slide} />
    </>
  )
}
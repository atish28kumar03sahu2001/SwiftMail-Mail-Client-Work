// src/Components/Pages/Signin.jsx
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye as EyeIcon, FaEyeSlash as EyeSlashIcon, FaUser as UserIcon } from "react-icons/fa";
import { IoMail as EmailIcon } from "react-icons/io5";
import { FcGoogle as GoogleIcon } from "react-icons/fc";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FormValidate, extractUserName } from '../Constants/FormValidation';
import "../Styles/SignUpIn.css";
import { AuthStore } from '../Store/AuthStore';
import { Authentication } from "../Constants/Authentication";
export default function Signin () {
    const {UserSignIn, ResetPassword, GoggleSignUpInMethod, AddUserInFireStore} = AuthStore();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const SignInHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const Obj = Object.fromEntries(formData.entries());
        const validationResult = FormValidate(Obj);
        if(!validationResult.isValid) {
            toast.warn(validationResult.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#4b257a'} });
            return;
        }
        try {
            const res = await UserSignIn(Obj);
            if(res?.success) {
                toast.success(`${extractUserName(res.mail)} Signed In Successfully`, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#048c01'} });
                const firestoreData = {email: res.mail, emailId:  res.emailUserId}
                AddUserInFireStore(firestoreData);
                e.target.reset();
                Authentication();
                setTimeout(()=> {
                    navigate(`/api/mailclient/v1/home`);
                    e.target.reset();
                }, 3000);
            } else {
                toast.error("Unauthorized user trying to access", { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored", transition: Slide, style: { background: '#ff0000' } });
            }
        } catch (error) {
            toast.error(error.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#ff0000'} });
        }
    }

    const HandleResetpassword = async () => {
        const emailInput = document.getElementById("useremail").value.trim();
        if(!emailInput) {
            toast.warn("Email Is Required", { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#4b257a'} });
            return;
        }
        try {
            const res = await ResetPassword(emailInput);
            if(res?.success) {
                toast.success(`Reset Password Mail Sent to ${emailInput} successfully`, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#048c01'} });
            }
        } catch (error) {
            toast.error(error.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#ff0000'} });
        }
    }

    const GoogleLogInHandler = async () => {
        try {
            const res = await GoggleSignUpInMethod();
            if(res?.success) {
                const firestoreData = {email: res.mail, emailId:  res.emailUserId}
                AddUserInFireStore(firestoreData);
                toast.success(`${extractUserName(res.mail)} Signed In Successfully`, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#048c01'} });
                Authentication();
                setTimeout(()=>{
                    navigate(`/api/mailclient/v1/home`);
                }, 3000);
            }
        } catch (error) {
            toast.error(error.message || "Failed to sign in with Google", { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#ff0000'} });
        } 
    }
    return (
        <>
            <section className='SEC_FRM_H1'>
                <h1 className='SEC_H1'>user SignIn</h1>
            </section>
            <section className='SEC_GOO_BTN'>
                <button className='GOO_BTN' onClick={GoogleLogInHandler}>
                    <span className='SPAN_ICON'>
                        <GoogleIcon size={30} />
                    </span>
                    <p className='SPAN_ICON_P'>Signin With Google</p>
                </button>
            </section>
            <section className='FRM_SIGNUP_SEC'>
                <form className='SIGNUP_FRM' onSubmit={SignInHandler}>
                    <div className='FRM_DIV'>
                        <label className='FRM_LBL' htmlFor='username'>Username</label>
                        <div className='FRM_IP_DIV'>
                            <input type='text' id='username' name='username' placeholder='Enter Username' title='Username' className='FRM_IP' />
                            <span className='ICON_SPAN'>
                                <UserIcon size={20} color='#ffffff' />
                            </span>
                        </div>
                    </div>
                    <div className='FRM_DIV'>
                        <label className='FRM_LBL' htmlFor='useremail'>Useremail</label>
                        <div className='FRM_IP_DIV'>
                            <input type='text' id='useremail' name='useremail' placeholder='Enter Username' title='Useremail' className='FRM_IP' />
                            <span className='ICON_SPAN'>
                                <EmailIcon size={20} color='#ffffff' />
                            </span>
                        </div>
                    </div>
                    <div className='FRM_DIV'>
                        <label className='FRM_LBL' htmlFor='userpassword'>User Password</label>
                        <div className='FRM_IP_DIV'>
                            <input type={showPassword ? 'text' : 'password'} id='userpassword' name='userpassword' placeholder='Enter User Password' title='User Password' className='FRM_IP' />
                            <span className='ICON_SPAN' onClick={togglePasswordVisibility}>
                            {showPassword ? <EyeIcon color='#ffffff' size={20} /> : <EyeSlashIcon color='#ffffff' size={20} />}
                            </span>
                        </div>
                    </div>
                    <div className='FRM_DIV'>
                        <label className='FRM_LBL' htmlFor='confirmpassword'>Confirm Password</label>
                        <div className='FRM_IP_DIV'>
                            <input type={showConfirmPassword ? 'text' : 'password'} id='confirmpassword' name='confirmpassword' placeholder='Enter Confirm Password' title='Confirm Password' className='FRM_IP' />
                            <span className='ICON_SPAN' onClick={toggleConfirmPasswordVisibility}>
                                {showConfirmPassword ? <EyeIcon color='#ffffff' size={20} /> : <EyeSlashIcon color='#ffffff' size={20} />}
                            </span>
                        </div>
                    </div>
                    <div className='LNK_DIV'>
                        <Link className='GO_SN_LNK' to={`/api/mailclient/v1/signup`} title='Redirect To Sign In'>Don't Have An Account? Click Here</Link>
                    </div>
                    <div className='SGUP_DIV'>
                        <button className='UFP_BTN' title='User Forget Password' onClick={HandleResetpassword}> User Forget Password</button>
                    </div>
                    <div className='SGUP_DIV'>
                        <input type='submit' value="Sign In" className='SGUP_BTN' title='User SignIn' />
                    </div>
                </form>
            </section>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover theme="colored" transition={Slide} />
        </>
    );
}
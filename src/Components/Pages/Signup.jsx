// src/Components/Pages/Signup.jsx
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye as EyeIcon, FaEyeSlash as EyeSlashIcon, FaUser as UserIcon } from "react-icons/fa";
import { IoMail as EmailIcon } from "react-icons/io5";
import { FcGoogle as GoogleIcon } from "react-icons/fc";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import "../Styles/SignUpIn.css";
import { AuthStore } from '../Store/AuthStore';
import { FormValidate, extractUserName } from '../Constants/FormValidation';
export default function Signup () {
    const {UserSignUp, GoggleSignUpInMethod} = AuthStore();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const SignUpHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const Obj = Object.fromEntries(formData.entries());
        const validationResult = FormValidate(Obj);
        if(!validationResult.isValid) {
            toast.warn(validationResult.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#4b257a'} });
            return;
        }
        try {
            const res = await UserSignUp(Obj);
            if(res?.userExists) {
                toast.warn(`${extractUserName(Obj.useremail)} Is Already Exist`, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#4b257a'} });
            } else if (res?.success) {
                toast.success(`${extractUserName(res.mail)} Is Created`, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#048c01'} })
                setTimeout(() => {
                    e.target.reset();
                    navigate("/api/mailclient/v1/signin");
                }, 3000);
            }
        } catch (error) {
            toast.error(error.message, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#ff0000'} })
        }
    }

    const GoogleSignUpHandler = async () => {
        try {
            const res = await GoggleSignUpInMethod();
            if(res?.success) {
                toast.success(`${extractUserName(res.mail)} Signed Up Successfully`, { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#048c01'} });
                setTimeout(()=>{
                    navigate(`/api/mailclient/v1/signin`);
                }, 3000);
            }
        } catch (error) {
            toast.error(error.message || "Failed to sign in with Google", { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Slide, style: {background: '#ff0000'} });
        }
    }

    return (
        <>
            <section className='SEC_FRM_H1'>
                <h1 className='SEC_H1'>user SignUp</h1>
            </section>
            <section className='SEC_GOO_BTN'>
                <button className='GOO_BTN' onClick={GoogleSignUpHandler}>
                    <span className='SPAN_ICON'>
                        <GoogleIcon size={30} />
                    </span>
                    <p className='SPAN_ICON_P'>Signup With Google</p>
                </button>
            </section>
            <section className='FRM_SIGNUP_SEC'>
                <form className='SIGNUP_FRM' onSubmit={SignUpHandler}>
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
                                {showPassword ? <EyeIcon color='#ffffff' size={20}  /> : <EyeSlashIcon color='#ffffff' size={20} />}
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
                        <Link className='GO_SN_LNK' to={`/api/mailclient/v1/signin`} title='Redirect To Sign Up'>Already Have Account? Click Here</Link>
                    </div>
                    <div className='SGUP_DIV'>
                        <input type='submit' value="Sign Up" className='SGUP_BTN' title='User SignUp' />
                    </div>
                </form>
            </section>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover theme="colored" transition={Slide} />
        </>
    );
}
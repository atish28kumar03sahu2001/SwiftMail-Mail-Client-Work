// src/Components/Constants/Header.jsx
import { Link } from "react-router";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { IoMenu as MenuBarIcon } from "react-icons/io5";
import { RxCross1 as CrossIcon } from "react-icons/rx";
import "../Styles/Header.css";
export default function Header () {
    const [menuOpen, setMenuOpen] = useState(false);
    const [authState, setAuthState] = useState({
        AuthToken: Cookies.get("AuthToken"),
        UserId: Cookies.get("UserId"),
    });

    useEffect(() => {
        const updateAuthState = () => {
            setAuthState({
                AuthToken: Cookies.get("AuthToken"),
                UserId: Cookies.get("UserId"),
            });
        };
        const cookieChangeListener = setInterval(updateAuthState, 500);
        return () => clearInterval(cookieChangeListener);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    return (
        <>
            <header className="HEADER">
                <div className="HEADER_DIV1">
                <Link className="H1_LINK" to={`/api/mailclient/v1/home`} title="Go To Home">SwiftMail</Link>
                </div>
                <div className="HEADER_DIV2">
                    {!authState.AuthToken || !authState.UserId ? (
                        <>
                            <Link className="LNK" to={`/api/mailclient/v1/signup`} title="User SignUp">SignUp</Link>
                            <Link className="LNK" to={`/api/mailclient/v1/signin`} title="User SignIn">SignIn</Link>
                        </>
                    ) : (
                        <>
                            <Link className="LNK" to={`/api/mailclient/v1/profile/${authState.UserId}`} title="User Profile">Profile</Link>
                            <Link className="LNK" to={`/api/mailclient/v1/compose/${authState.UserId}`} title="User Compose">Compose</Link>
                            <Link className="LNK" to={`/api/mailclient/v1/inbox/${authState.UserId}`} title="User Inbox">Inbox</Link>
                            <Link className="LNK" to={`/api/mailclient/v1/sentinbox/${authState.UserId}`} title="User Sent Box">Sent Box</Link>
                            <Link className="LNK" to={`/api/mailclient/v1/Starred/${authState.UserId}`} title="User Starred Section">Starred</Link>
                            <Link className="LNK" to={`/api/mailclient/v1/trash/${authState.UserId}`} title="User Trash Section">Trash</Link>
                        </>
                    )}
                </div>
                <div className="MENU_ICON" onClick={toggleMenu}>
                    {menuOpen ? null : <MenuBarIcon size={30} color="white" />}
                </div>
                {menuOpen && (
                    <div className="MOBILE_LINKS">
                        <div className="CROSS_ICON_CONTAINER" onClick={toggleMenu}>
                            <CrossIcon size={30} color="white" />
                        </div>
                        {!authState.AuthToken || !authState.UserId ? (
                            <>
                                <div className="ICONSDIV">
                                    <Link className="LNK" to={`/api/mailclient/v1/signup`} title="User SignUp">SignUp</Link>
                                    <Link className="LNK" to={`/api/mailclient/v1/signin`} title="User SignIn">SignIn</Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="ICONSDIV">
                                    <Link className="LNK" to={`/api/mailclient/v1/profile/${authState.UserId}`} title="User Profile">Profile</Link>
                                    <Link className="LNK" to={`/api/mailclient/v1/compose/${authState.UserId}`} title="User Compose">Compose</Link>
                                    <Link className="LNK" to={`/api/mailclient/v1/inbox/${authState.UserId}`} title="User Inbox">Inbox</Link>
                                    <Link className="LNK" to={`/api/mailclient/v1/sentinbox/${authState.UserId}`} title="User Sent Box">Sent Box</Link>
                                    <Link className="LNK" to={`/api/mailclient/v1/Starred/${authState.UserId}`} title="User Starred Section">Starred</Link>
                                    <Link className="LNK" to={`/api/mailclient/v1/trash/${authState.UserId}`} title="User Trash Section">Trash</Link>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </header>
        </>
    );
}
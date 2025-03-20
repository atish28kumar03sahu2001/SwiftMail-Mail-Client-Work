// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Loading from './Components/Constants/Loading';
import { GuestMiddleware, Middleware } from './Middleware';

const Error = lazy(() => import("./Components/Constants/Error"));
const Welcome = lazy(() => import("./Components/Pages/Welcome"));
const SignUp = lazy(() => import("./Components/Pages/Signup"));
const SignIn = lazy(() => import("./Components/Pages/Signin"));
const Header = lazy(() => import("./Components/Constants/Header"));
const Footer = lazy(() => import("./Components/Constants/Footer"));
const Profile = lazy(() => import("./Components/MailSection/Profile"));
const Inbox = lazy(() => import("./Components/MailSection/Inbox"));
const Compose = lazy(() => import("./Components/MailSection/Compose"));
const SentBox = lazy(() => import("./Components/MailSection/SentBox"));
const Starred = lazy(() => import("./Components/MailSection/Starred"));
const Trash = lazy(() => import("./Components/MailSection/Trash"));

export default function App () {
    return (
        <>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Suspense fallback={<Loading />}>
                    <Routes>
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<Navigate to="/api/mailclient/v1/home" replace />} />
                            <Route path="/api/mailclient/v1/home" element={<Welcome />} />
                            <Route path="/api/mailclient/v1/signup" element={<GuestMiddleware><SignUp /></GuestMiddleware>} />
                            <Route path="/api/mailclient/v1/signin" element={<GuestMiddleware><SignIn /></GuestMiddleware>} />
                            <Route path="/api/mailclient/v1/profile/:id" element={<Middleware><Profile /></Middleware>} />
                            <Route path="/api/mailclient/v1/inbox/:id" element={<Middleware><Inbox /></Middleware>} />
                            <Route path="/api/mailclient/v1/compose/:id" element={<Middleware><Compose /></Middleware>} />
                            <Route path="/api/mailclient/v1/sentinbox/:id" element={<Middleware><SentBox /></Middleware>} />
                            <Route path="/api/mailclient/v1/Starred/:id" element={<Middleware><Starred /></Middleware>} />
                            <Route path="/api/mailclient/v1/trash/:id" element={<Middleware><Trash /></Middleware>} />
                        </Route>
                        <Route path="*" element={<Error />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    );
}

const MainLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
}
import { Welcome_Text1 } from "./Data";
import "../Styles/Footer.css";
// src/Components/Constants/Footer.jsx
export default function Footer () {
    const currentYear = new Date().getFullYear();
    return (
        <>
            <footer className="FOOTER_SECTION">
                <p className="FOOTER_P">© {Welcome_Text1} Atish Kumar Sahu {currentYear}. All Rights Reserved.</p>
            </footer>
        </>
    );
}
import { Data1, Paragraph1, Welcome_Text1, Welcome_Text2 } from "../Constants/Data";
import { FaArrowAltCircleRight as RightArrowIcon, FaArrowAltCircleDown as DownArrowIcon } from "react-icons/fa";
import "../Styles/Welcome.css";
// src/Components/Pages/Welcome.jsx
export default function Welcome () {
    return (
        <>
            <section className="WELCOME_SEC">
                <h1 className="WELCOME_H1 WEL_H">{Welcome_Text1}</h1>
                <h2 className="WELCOME_H2 WEL_H">{Welcome_Text2}</h2>
            </section>
            <section className="WELCOME_SEC_BTN">
                <button className="WELCOME_BTN" title="Go To Mail Section">
                    Click Here
                </button>
            </section>
            <section className="WELCOME_P_SEC">
                <p className="WELCOME_P">{Paragraph1}</p>
            </section>
            <section className="WELCOME_DATA_SEC">
                {
                    Data1.map((data) => (
                        <details key={data.id} className="WELCOME_DATA_DIV">
                            <summary>
                                <RightArrowIcon className="icon right-icon" size={20} color="#4b257a" />
                                <DownArrowIcon className="icon down-icon" size={20} color="#4b257a" />
                                {data.head}
                            </summary>
                            <p className="WELCOME_DATA_P">{data.des}</p>
                        </details>
                    ))
                }
            </section>
        </>
    );
}
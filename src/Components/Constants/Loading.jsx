// src/Components/Constants/Loading.jsx
import React, { useState, useEffect, } from "react";
import { MoonLoader } from "react-spinners";
const override = {
    display: "block",
    margin: "0 auto",
};
const style = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
}
export default function Loading () {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 5000);
        return () => clearTimeout(timer);
    }, []);
    return (
        <>
            {loading ? (
                    <div style={style}>
                        <MoonLoader 
                            color="#4b257a" 
                            loading={true} 
                            size={100} 
                            cssOverride={override}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                ) : (
                    <div style={style}>
                        <MoonLoader 
                            color="#4b257a" 
                            loading={true} 
                            size={100} 
                            cssOverride={override}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                )
            }
        </>
    );
}
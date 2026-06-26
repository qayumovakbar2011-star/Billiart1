import { collection, getDocs } from "firebase/firestore";

import { useState, useRef, useEffect } from "react";

import { db } from "../firebase.config";



const Timer = ({

    itm,

    setTableStatus,

    currentBasket,

    openBar,

    addIncome,

    clearBasket

}: any) => {

    const [sekund, setSekund] = useState(0);

    const [minut, setMinut] = useState(0);

    const [soat, setSoat] = useState(0);

    const intervalRef = useRef<any>(null);

    const [cost, setCost] = useState(0);

    const [_users1, setUsers1] = useState([]);

    const [totalTime, setTotalTime] = useState(0);

    const [startTime, setStartTime] = useState("");

    const [band, setBand] = useState(false);

    const [showModal, setShowModal] = useState(false);



    useEffect(() => {

        getData();

    }, []);



    function startGame() {

        if (intervalRef.current) return;



        setBand(true);



        setTableStatus((prev: any) => ({

            ...prev,

            [itm.id]: true

        }));



        const now = new Date();

        const timeString =

            now.getHours() +

            ":" +

            now.getMinutes() +

            ":" +

            now.getSeconds();



        setStartTime(timeString);



        intervalRef.current = setInterval(() => {

            setSekund((prev) => {

                if (prev + 1 === 60) {

                    setMinut((m) => {

                        if (m + 1 === 60) {

                            setSoat((s) => s + 1);

                            return 0;

                        }

                        return m + 1;

                    });

                    return 0;

                }

                return prev + 1;

            });

        }, 1);

    }



    const getBarTotal = () => {

        return currentBasket.reduce((sum: number, p: any) => sum + p.totalPrice, 0);

    };



    function stopGame() {

        clearInterval(intervalRef.current);

        intervalRef.current = null;



        setBand(false);



        setTableStatus((prev: any) => ({

            ...prev,

            [itm.id]: false

        }));



        setShowModal(true);



        let price = Math.round(35000 / 60);

        let totalTime = soat * 60 + minut;

        let cost = totalTime * price;



        setTotalTime(totalTime);

        const total = cost + getBarTotal();

        addIncome(total);

        setCost(cost);



        setSekund(0);

        setMinut(0);

        setSoat(0);

        setStartTime("")

    }



    function getData() {

        const getCol = collection(db, "product");



        getDocs(getCol).then((res: any) => {

            const a = res.docs.map((itm: any) => {

                return { ...itm.data(), id: itm.id }

            });

            setUsers1(a);

        })

    }



    return (

        <div className="product-card">



            <div className="d-flex justify-content-between align-items-center mb-2">



                <h5 style={{ margin: 0 }}>

                    🎱 {itm.name}

                </h5>



                <div

                    style={{

                        padding: "5px 12px",

                        borderRadius: "10px",

                        background: band ? "#ff3b30" : "#00c853",

                        color: "#fff",

                        fontSize: "13px",

                        fontWeight: "bold"

                    }}

                >

                    {band ? "Band" : "Bo'sh"}

                </div>



            </div>



            <div>

                <img width={285} height={170} className="rounded mb-2 mt-2" src="https://i.pinimg.com/736x/12/f4/12/12f4127feb4f7d56f896e02c77499d8e.jpg" alt="" />

            </div>



            <div className="d-flex">

                <p>{soat}:</p>

                <p>{minut}:</p>

                <p>{sekund}</p>

            </div>



            <div style={{ color: "blue" }}>

                <p>Boshlangan vaqti: {startTime}</p>

            </div>



            <div className="d-flex gap-2 mt-2 mb-3">



                {!band ? (

                    <button

                        onClick={startGame}

                        className="btn btn-success"

                    >

                        ▶ Start

                    </button>

                ) : (

                    <>

                        <button

                            onClick={stopGame}

                            className="btn btn-danger"

                        >

                            ⏹ Stop

                        </button>



                        <button

                            onClick={() => openBar(itm)}

                            className="btn btn-warning"

                        >

                            🍔 Bar

                        </button>

                    </>

                )}



            </div>







            {showModal && (

                <div

                    style={{

                        position: "fixed",

                        inset: 0,

                        background: "rgba(0,0,0,0.75)",

                        backdropFilter: "blur(8px)",

                        display: "flex",

                        justifyContent: "center",

                        alignItems: "center",

                        zIndex: 9999

                    }}

                >

                    <div

                        style={{

                            width: "380px",

                            maxHeight: "60vh",

                            overflowY: "auto",



                            background: "rgba(10,10,15,0.95)",

                            border: "1px solid rgba(0,240,255,0.4)",

                            borderRadius: "16px",



                            padding: "20px",

                            color: "#fff",



                            boxShadow:

                                "0 0 20px rgba(0,240,255,0.3), 0 0 60px rgba(255,0,200,0.1)"

                        }}

                    >



                        <h3

                            style={{

                                color: "#00f0ff",

                                textShadow: "0 0 10px #00f0ff",

                                marginBottom: "15px"

                            }}

                        >

                            📊 Hisob-kitob

                        </h3>



                        <p><b>Stol:</b> {itm.name}</p>

                        <p><b>O‘ynagan vaqt:</b> {totalTime} min</p>

                        <p><b>1 soat narxi:</b> 35 000 so'm</p>

                        <p><b>Jami to‘lov:</b> {cost} so'm</p>



                        <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />



                        <h5 style={{ color: "#7a00ff" }}>🛒 Bar mahsulotlari</h5>



                        {currentBasket.length > 0 ? (

                            <div style={{ fontSize: "14px" }}>

                                {currentBasket.map((p: any, i: number) => (

                                    <div

                                        key={i}

                                        style={{

                                            display: "flex",

                                            justifyContent: "space-between",

                                            padding: "4px 0",

                                            color: "#ccc"

                                        }}

                                    >

                                        <span>{p.name} (x{p.quantity})</span>

                                        <span style={{ color: "#00ff9f" }}>{p.totalPrice} so'm</span>

                                    </div>

                                ))}



                                <div

                                    style={{

                                        marginTop: "10px",

                                        textAlign: "right",

                                        color: "#00ff9f",

                                        fontWeight: "bold"

                                    }}

                                >

                                    Bar jami: {getBarTotal()} so'm

                                </div>

                            </div>

                        ) : (

                            <p style={{ color: "#888" }}>Bar ishlatilmadi</p>

                        )}



                        <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />



                        <h3

                            style={{

                                color: "#00ff9f",

                                textShadow: "0 0 10px #00ff9f"

                            }}

                        >

                            Jami: {cost + getBarTotal()} so'm

                        </h3>



                        <button

                            onClick={() => {
                                setShowModal(false)

                                clearBasket(itm.id);
                            }}

                            style={{

                                marginTop: "15px",

                                width: "100%",

                                padding: "10px",



                                border: "none",

                                borderRadius: "10px",



                                background: "linear-gradient(135deg,#00f0ff,#ff00c8)",

                                color: "#000",

                                fontWeight: "bold",



                                cursor: "pointer",

                                boxShadow: "0 0 15px rgba(0,240,255,0.4)"

                            }}

                        >

                            Yopish

                        </button>

                    </div>

                </div>

            )}



        </div>

    );

};



export default Timer;
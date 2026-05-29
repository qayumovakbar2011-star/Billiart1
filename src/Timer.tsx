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
    const [users1, setUsers1] = useState([]);
    const [startTime, setStartTime] = useState("");
    const [band, setBand] = useState(false);

    const [receipts, setReceipts] = useState<any[]>([]);

    useEffect(() => {
        getData();
        if (band) {
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
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [band]);

    useEffect(() => {
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            if (receipts.length > 0) {
                (appContainer as HTMLElement).style.setProperty('grid-template-columns', '240px 1fr 320px', 'important');
            } else {
                (appContainer as HTMLElement).style.setProperty('grid-template-columns', '240px 1fr', 'important');
            }
        }
    }, [receipts]);

    function startGame() {
        if (intervalRef.current) return;
        setBand(true);
        setTableStatus((prev: any) => ({ ...prev, [itm.id]: true }));

        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0].substring(0, 5);
        setStartTime(timeString);
    }

    const getBarTotal = (basketToCalc = currentBasket) => {
        return basketToCalc.reduce((sum: number, p: any) => sum + p.totalPrice, 0);
    };

    function stopGame() {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setBand(false);
        setTableStatus((prev: any) => ({ ...prev, [itm.id]: false }));

        let price = Math.round(35000 / 60);
        let calculatedTotalTime = soat * 60 + minut;
        if (calculatedTotalTime === 0 && sekund > 0) calculatedTotalTime = 1;
        let calculatedCost = calculatedTotalTime * price;

        const total = calculatedCost + getBarTotal(currentBasket);
        addIncome(total);

        const newReceipt = {
            id: Date.now() + Math.random(),
            tableName: itm.name,
            startTime: startTime,
            totalTime: calculatedTotalTime,
            cost: calculatedCost,
            barItems: [...currentBasket],
            barTotal: getBarTotal(currentBasket)
        };

        setReceipts((prev) => [...prev, newReceipt]);

        setSekund(0);
        setMinut(0);
        setSoat(0);
    }

    function removeReceipt(id: string | number) {
        setReceipts((prev) => prev.filter((r) => r.id !== id));
        clearBasket(itm.id);
    }

    function getData() {
        const getCol = collection(db, "product");
        getDocs(getCol).then((res: any) => {
            const a = res.docs.map((itm: any) => {
                return { ...itm.data(), id: itm.id }
            });
            setUsers1(a);
        });
    }

    return (
        <div style={{ display: "contents" }}>
            <div className="product-card" style={{
                background: "#111622",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "100%",
                boxSizing: "border-box",
                transition: "all 0.3s ease"
            }}>
                <div className="d-flex justify-content-between align-items-center" style={{ width: "100%" }}>
                    <h5 style={{ margin: 0, color: "#fff", fontSize: "14px", fontWeight: "600" }}>
                        🎱 {itm.name}
                    </h5>
                    <div style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        background: band ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.15)",
                        color: band ? "#ef4444" : "#22c55e",
                        fontSize: "11px",
                        fontWeight: "600"
                    }}>
                        {band ? "BAND" : "BO'SH"}
                    </div>
                </div>

                <div style={{ width: "100%" }}>
                    <img 
                        style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" }} 
                        src="https://i.pinimg.com/736x/12/f4/12/12f4127feb4f7d56f896e02c77499d8e.jpg" 
                        alt="Billiard" 
                    />
                </div>

                <div className="d-flex gap-1" style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginTop: "2px" }}>
                    <span>{String(soat).padStart(2, '0')}:</span>
                    <span>{String(minut).padStart(2, '0')}:</span>
                    <span>{String(sekund).padStart(2, '0')}</span>
                </div>

                <div style={{ color: "#7e8494", fontSize: "12px" }}>
                    Boshlangan: {startTime || "--:--"}
                </div>

                <div className="d-flex gap-2" style={{ marginTop: "auto", width: "100%" }}>
                    {!band ? (
                        <button onClick={startGame} className="btn btn-success" style={{ width: "100%", background: "#164e33", border: "none", padding: "8px", fontWeight: "600", fontSize: "13px" }}>
                            ▶ Start
                        </button>
                    ) : (
                        <>
                            <button onClick={stopGame} className="btn btn-danger" style={{ flex: 1, background: "#7f1d1d", border: "none", padding: "8px", fontWeight: "600", fontSize: "13px" }}>
                                ⏹ Stop
                            </button>
                            <button onClick={() => openBar(itm)} className="btn btn-warning" style={{ background: "#2d2415", color: "#f59e0b", border: "1px solid #45371c", padding: "8px", fontSize: "13px" }}>
                                🍔 Bar
                            </button>
                        </>
                    )}
                </div>
            </div>

            {receipts.length > 0 && (
                <div className="right-sidebar-container" style={{
                    position: "fixed",
                    right: "24px",
                    top: "100px",
                    width: "280px",
                    maxHeight: "calc(100vh - 120px)",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    zIndex: 999
                }}>
                    {receipts.map((receipt) => (
                        <div key={receipt.id} style={{
                            background: "#111622",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: "12px",
                            padding: "16px",
                            color: "#fff",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
                        }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "#fff", display: "flex", justifyContent: "space-between" }}>
                                <span>Hozirgi sessiya</span>
                                <span style={{ color: "#22c55e" }}>{receipt.tableName}</span>
                            </h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#8a94a6" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>Boshlanish vaqti:</span> <b style={{ color: "#fff" }}>{receipt.startTime}</b>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>O‘tgan vaqt:</span> <b style={{ color: "#fff" }}>{receipt.totalTime} min</b>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>Stol narxi:</span> <b style={{ color: "#fff" }}>{receipt.cost.toLocaleString()} so'm</b>
                                </div>
                            </div>

                            {receipt.barItems.length > 0 && (
                                <>
                                    <div style={{ margin: "8px 0", borderTop: "1px dashed rgba(255,255,255,0.08)" }}></div>
                                    <div style={{ fontSize: "12px" }}>
                                        <span style={{ color: "#8a94a6", display: "block", marginBottom: "2px" }}>🛒 Bar:</span>
                                        {receipt.barItems.map((p: any, idx: number) => (
                                            <div key={idx} style={{ display: "flex", justifyContent: "space-between", color: "#ccc" }}>
                                                <span>{p.name} (x{p.quantity})</span>
                                                <span>{p.totalPrice.toLocaleString()} so'm</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            <div style={{ margin: "8px 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}></div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "12px", color: "#8a94a6" }}>Jami:</span>
                                <span style={{ fontSize: "18px", fontWeight: "700", color: "#22c55e" }}>
                                    {(receipt.cost + receipt.barTotal).toLocaleString()} so'm
                                </span>
                            </div>

                            <button
                                onClick={() => removeReceipt(receipt.id)}
                                style={{
                                    marginTop: "12px",
                                    width: "100%",
                                    padding: "8px",
                                    border: "none",
                                    borderRadius: "8px",
                                    background: "#7f1d1d",
                                    color: "#fff",
                                    fontWeight: "600",
                                    fontSize: "13px",
                                    cursor: "pointer"
                                }}
                            >
                                Sessiyani to'xtatish
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Timer;
import { collection, getDocs } from "firebase/firestore";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { db } from "../firebase.config";

import Timer from "./Timer";



const Home = () => {



  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [users1, setUsers1] = useState([]);

  const [todayIncome, setTodayIncome] = useState(0);

  const [count, setCount] = useState<any>({});

  const [basket, setBasket] = useState<any>({});

  const [tableStatus, setTableStatus] = useState<any>({});

  const [showModal, setShowModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState<any>(null);



  useEffect(() => {

    getData();

    getData1();

  }, []);



  function getData() {

    const getCol = collection(db, "card");



    getDocs(getCol).then((res: any) => {

      const a = res.docs.map((itm: any) => {

        return { ...itm.data(), id: itm.id }

      });

      setUsers(a);

    })

  }



  function getData1() {

    const getCol = collection(db, "product");



    getDocs(getCol).then((res: any) => {

      const a = res.docs.map((itm: any) => {

        return { ...itm.data(), id: itm.id }

      });

      setUsers1(a);

    })

  }



  function plus1(id: string) {

    setCount((prev: any) => ({

      ...prev,

      [id]: (prev[id] || 0) + 1

    }));

  }



  function minus1(id: string) {

    setCount((prev: any) => ({

      ...prev,

      [id]: (prev[id] || 0) - 1

    }));

  }



  function save() {

    if (!selectedItem) return;



    const selectedProducts = users1

      .filter((p: any) => count[p.id] > 0)

      .map((p: any) => ({

        id: p.id,

        name: p.name,

        quantity: count[p.id],

        totalPrice: count[p.id] * p.price

      }));



    setBasket((prev: any) => ({

      ...prev,

      [selectedItem.id]: selectedProducts

    }));



    setShowModal(false);

    setCount({});

  };



  function clearBasket(tableId: string) {

    setBasket((prev: any) => ({

      ...prev,

      [tableId]: []

    }));

  }



  function goAdmin() {

    navigate("/admin");

  }



  const jami = users.length;



  const bush = users.filter(

    (item: any) => tableStatus[item.id] !== true

  ).length;



  const band = users.filter(

    (item: any) => tableStatus[item.id] === true

  ).length;



  return (

    <div className="m-3">

      <div className="d-flex justify-content-between mb-3">

        <div>

          <h3>DASHBOARD</h3>

          <p>klubdagi stollar holatini kuzating va boshqaring</p>

        </div>

        <div>

          <button onClick={goAdmin} className="btn btn-primary"><img width={25} height={25} className="rounded-5" src="https://img.freepik.com/premium-vector/profile-default-icon-vector-design-template_1035722-1201.jpg" /> admin</button>

        </div>

      </div>

      <div className="d-flex gap-3">

        <div className="border rounded p-2 w-25">

          <center><h4>Jami Stollar</h4></center>

          <center><h4>{jami}</h4></center>

        </div>

        <div className="border rounded p-2 w-25">

          <center><h4>Bo'sh Stollar</h4></center>

          <center><h4>{bush}</h4></center>

        </div>

        <div className="border rounded p-2 w-25">

          <center><h4>Band Stollar</h4></center>

          <center><h4>{band}</h4></center>

        </div>

        <div className="border rounded p-2 w-25">

          <center><h4>Bugungi Daromad</h4></center>

          <center><h4>{todayIncome} so'm</h4></center>

        </div>

      </div>

      <div className="d-flex gap-3 flex-wrap">

        {

          users.map((item: any) => (

            <div className="container border rounded p-2 w-25 mt-3" key={item.id}>

              <Timer

                key={item.id}

                itm={item}

                setTableStatus={setTableStatus}

                currentBasket={basket[item.id] || []}

                clearBasket={clearBasket}

                openBar={(table: any) => {

                  setSelectedItem(table);

                  setShowModal(true);



                  setBasket((prev: any) => ({

                    ...prev,

                    [table.id]: prev[table.id] || []

                  }));

                }}

                addIncome={(money: number) => {

                  setTodayIncome((prev: any) => prev + money);

                }}

              />

              <div className="mt-2 border-top pt-2">

                <small><b>Bar mahsulotlari:</b></small>

                {basket[item.id] && basket[item.id].length > 0 ? (

                  <ul className="list-unstyled mb-1">

                    {basket[item.id].map((prod: any, idx: number) => (

                      <li key={idx} style={{ fontSize: "13px" }}>

                        ✅ {prod.name} — {prod.quantity} ta ({prod.totalPrice} so'm)

                      </li>

                    ))}

                    <div className="fw-bold mt-1" style={{ fontSize: "13px", color: "green" }}>

                      Jami bar: {basket[item.id].reduce((sum: number, p: any) => sum + p.totalPrice, 0)} so'm

                    </div>

                  </ul>

                ) : (

                  <p className="text-muted small">Mahsulot tanlanmagan</p>

                )}

              </div>

            </div>

          ))

        }







        {showModal && (

          <div

            onClick={() => setShowModal(false)}

            style={{

              position: "fixed",

              top: 0,

              left: 0,

              width: "100%",

              height: "100vh",



              background: "rgba(0,0,0,0.6)",

              backdropFilter: "blur(6px)",



              display: "flex",

              justifyContent: "center",

              alignItems: "center",



              zIndex: 9999,

            }}

          >



            <div

              onClick={(e) => e.stopPropagation()}

              style={{

                width: "450px",

                maxHeight: "80vh",

                overflowY: "auto",



                background: "#111",

                color: "#fff",



                borderRadius: "15px",

                padding: "20px",



                boxShadow: "0 0 30px rgba(0,0,0,0.5)",

              }}

            >



              <div className="d-flex justify-content-between align-items-center mb-3">

                <h4>🍔 Bar mahsulotlari</h4>



                <button

                  onClick={() => setShowModal(false)}

                  className="btn btn-danger btn-sm"

                >

                  ✕

                </button>

              </div>



              {users1.map((itm: any) => (

                <div

                  key={itm.id}

                  className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"

                >

                  <div>

                    <h6>{itm.name}</h6>

                    <small>{itm.price} so'm</small>

                  </div>



                  <div className="d-flex gap-2 align-items-center">

                    <button

                      onClick={() => minus1(itm.id)}

                      className="btn btn-danger btn-sm"

                    >

                      -

                    </button>



                    <span>{count[itm.id] || 0}</span>



                    <button

                      onClick={() => plus1(itm.id)}

                      className="btn btn-success btn-sm"

                    >

                      +

                    </button>

                  </div>

                </div>

              ))}



              <button

                onClick={save}

                className="btn btn-primary w-100 mt-3"

              >

                💾 Save

              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  )

}



export default Home;
import { addDoc, collection, getDocs } from "firebase/firestore";

import { useEffect, useState } from "react";

import { db } from "../firebase.config";

import { useNavigate } from "react-router-dom";



const Admin = () => {



    const [_users, setUsers] = useState([]);

    const [name, setName] = useState("");

    const [price, _setPrice] = useState("");

    const navigate = useNavigate();



    useEffect(() => {

        getData();

    }, []);



    function addCard() {

        const card = collection(db, "card");



        addDoc(card, { name, price });






        setName("");

        getData();

        navigate("/");

    }



    function getData() {

        const getCol = collection(db, "card");



        getDocs(getCol).then((res: any) => {

            const a = res.docs.map((itm: any) => {

                return { ...itm.data(), id: itm.id }

            });

            setUsers(a);

        })

    }



    return (

        <div className="w-25 border rounded mx-auto p-3">

            <input onChange={(e) => setName(e.target.value)} value={name} className="form-control mb-2" type="text" placeholder="stol name ..." />

            <button onClick={addCard} className="btn btn-primary w-50 d-block mx-auto">save</button>

        </div>

    )

}



export default Admin;
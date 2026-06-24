import { addDoc, collection, getDocs } from "firebase/firestore";

import { useEffect, useState } from "react";

import { db } from "../firebase.config";

import { useNavigate } from "react-router-dom";



const Product = () => {



    const [name, setName] = useState("");

    const [price, setPrice] = useState("");

    const [_users, setUsers] = useState([]);

    const navigate = useNavigate();




    useEffect(() => {

        getData();

    }, []);



    function addProduct() {

        const product = collection(db, "product");



        addDoc(product, { name, price });



        setName("");

        setPrice("");

        getData();

        navigate("/")

    }



    function getData() {

        const getCol = collection(db, "product");



        getDocs(getCol).then((res: any) => {

            const a = res.docs.map((itm: any) => {

                return { ...itm.data(), id: itm.id }

            });

            setUsers(a);

        })

    }







    return (

        <div className="mx-auto mt-5 border rounded p-2 w-25">

            <input className="form-control mb-2" onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="name ..." />

            <input className="form-control mb-2" onChange={(e) => setPrice(e.target.value)} value={price} type="text" placeholder="price ..." />

            <button onClick={addProduct} className="btn btn-primary">save</button>

        </div>

    );

};



export default Product;
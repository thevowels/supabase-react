import {useState, useEffect} from 'react';
import {supabase} from "./supabaseClient.js";
import {createRoot} from "react-dom/client";
import "./scss/styles.scss";

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const handleLogin = async (e) =>{
        e.preventDefault();
        setLoading(true);
        const {data, error} = await supabase.auth.signInWithPassword({
            email: e.target.email.value,
            password: e.target.password.value,
        })
        if(error) {
            console.log('error',error);
            alert(error.error_description || error.message);
        }else{
            alert('Logged In');
        }
        console.log('handling login');
    }

    return (
        <form className={"col-md-6 col-lg-4 mx-auto "} onSubmit={handleLogin}>
            <div className="mb-3">
                <label className="form-label">Email address</label>
                <input type="email" className="form-control" name="email"/>
            </div>
            <div className="mb-3">
                <label  className="form-label">Password</label>
                <input type="password" className="form-control" name="password"/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}
import './scss/styles.scss';
import {useEffect, useState} from 'react';
import {supabase} from "./supabaseClient.js";
import Auth from "./Auth.jsx";
function App() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({data:{session}})=>{
            setSession(session);
        })
        supabase.auth.onAuthStateChange((_event,session) =>{
            setSession(session);
        });
        console.log(session);
    },[])

  return (
    <div className='container'>
        {!session ? <Auth/> : <div>Logged In</div>}
    </div>
  )
}

export default App

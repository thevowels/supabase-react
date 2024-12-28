import { useState, useEffect } from "react";
import {supabase} from "./supabaseClient.js";
import Avatar from "./Avatar.jsx";
import "./App.css";


export default function Account({session}) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [website, setWebsite] = useState("");
    const [avatar_url, setAvatarUrl] = useState("");

    useEffect(() => {
        let ignore = false;
        async function getProfile() {
            setLoading(true);
            const { user } = session;
            const { data, error } = await supabase
                .from('profiles')
                .select(`username,website,avatar_url`)
                .eq('id', user.id)
                .single();

            if (!ignore) {
                if(error) {
                    console.warn(error);
                }else if (data) {
                    setUsername(data.username)
                    setWebsite(data.website)
                    setAvatarUrl(data.avatar_url)
                }
            }
            setLoading(false);
        }

        getProfile();
        return() => {
            ignore = true;
        }
    },[session])

    async function updateProfile(event, avatarUrl) {
        event.preventDefault();
        setLoading(true);
        const { user } = session;
        const updates = {
            id: user.id,
            username,
            website,
            avatar_url: avatarUrl,
            updated_at: new Date(),
        }
        const {error } = await supabase.from('profiles').upsert(updates);
        if(error){
            alert(error.message)
        }else {
            setAvatarUrl(avatarUrl);
        }
        setLoading(false);


    }

    return(
        <div className='col-lg-5 col-xl-4 mx-auto text-center mt-5'>
            <form onSubmit={updateProfile}>
                <Avatar
                    url={avatar_url}
                    size={150}
                    onUpload={(event, url) => {
                        updateProfile(event, url)
                    }}
                />

                <div className={"mb-3"}>
                    <label className={"form-label"}>Email</label>
                    <input type={"email"} value={session.user.email} disabled />
                </div>
                <div className={"mb-3"}>
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        required
                        value={username || ''}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                </div>
                <div className={"mb-3"}>
                    <label className="form-label">Website</label>
                    <input
                        type="url"
                        value={website || ''}
                        onChange={(e) => setWebsite(e.target.value)}
                    />
                </div>
                <div className={"mb-3"}>
                    <button className={"btn btn-primary"} type={"submit"} disabled={loading}>
                        {loading ? 'Loading...' : 'Update'}
                    </button>
                </div>
                <div className={'mb-3'}>
                    <button className={"btn btn-outline-danger"} onClick={() => supabase.auth.signOut()} >Sign Out</button>
                </div>
            </form>
        </div>
    )
}
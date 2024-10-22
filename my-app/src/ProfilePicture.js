import React, { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const ProfilePicture = ({ currentUserId }) => {
    const [profilePicUrl, setProfilePicUrl] = useState("");

    useEffect(() => {
        const storage = getStorage();
        const fileRef = ref(storage, 'profile_pics/' + currentUserId);

        getDownloadURL(fileRef)
            .then((url) => {
                setProfilePicUrl(url); // Store the URL in state to use in the JSX
            })
            .catch((error) => {
                console.error('Error fetching image URL: ', error);
            });
    }, [currentUserId]);

    return (
        <div>
            {profilePicUrl ? (
                <img id="profile-pic" src={profilePicUrl} alt="Profile Picture" />
            ) : (
                <p>Loading profile picture...</p>
            )}
        </div>
    );
};

export default ProfilePicture;

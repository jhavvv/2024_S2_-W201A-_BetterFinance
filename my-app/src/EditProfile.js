import React, { useState, useEffect } from 'react';
import './EditProfile.css';
import Navbar from './Navbar';
import { auth, db, storage } from './firebase'; // Import storage from firebase
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { updateEmail, deleteUser, sendPasswordResetEmail } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage functions

function EditProfile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState(null); // State for storing the profile picture URL
    const [newProfilePic, setNewProfilePic] = useState(null); // State for the new image file

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setFirstName(userData.firstName || '');
                        setLastName(userData.lastName || '');
                        setUsername(userData.username || '');
                        setEmail(user.email || '');
                        setProfilePic(userData.profilePic || '/profile.jpg'); // Set the profile picture URL
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);

    // Handle file selection for profile picture
    const handleProfilePicChange = (e) => {
        if (e.target.files[0]) {
            setNewProfilePic(e.target.files[0]); // Store the selected file
        }
    };

    // Upload the new profile picture to Firebase Storage
    const handleProfilePicUpload = async () => {
        try {
            const user = auth.currentUser;
            if (user && newProfilePic) {
                const profilePicRef = ref(storage, `profile_pics/${user.uid}`);
                await uploadBytes(profilePicRef, newProfilePic);
                const profilePicURL = await getDownloadURL(profilePicRef);

                // Update the profile picture in Firestore
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, { profilePic: profilePicURL });

                setProfilePic(profilePicURL); // Update the displayed profile picture
                alert("Profile picture updated successfully!");
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error);
        }
    };

    const handleFirstNameChange = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, { firstName: firstName });
                alert("First name changed successfully");
            }
        }
        catch (error) {
            console.error("Error updating first name:", error);
        }
    };

    const handleLastNameChange = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, { lastName: lastName });
                alert("Last name changed successfully");
            }
        }
        catch (error) {
            console.error("Error updating last name:", error);
        }
    };

    const handleUsernameChange = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, { username: username });
                alert("Username changed successfully");
            }
        }
        catch (error) {
            console.error("Error updating username:", error);
        }
    };

    const handleEmailChange = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                await updateEmail(user, email);
                await user.sendEmailVerification();
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, { email: email });
                alert("Email verification link will be sent to your email address.");
            }
        }
        catch (error) {
            console.error("Error updating email:", error);
        }
    };

    const handlePasswordChange = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                await sendPasswordResetEmail(auth, user.email);
                alert("Password reset link sent to your email.");
            }
        }
        catch (error) {
            console.error("Error updating password:", error);
        }
    };

    const handleDeleteProfile = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                await deleteDoc(doc(db, "users", user.uid));
                await deleteUser(user);
                alert("Profile deleted successfully.");
            }
        }
        catch (error) {
            console.error("Error deleting profile:", error);
        }
    };

    return (
        <div>
            <Navbar />
            <main>
                <h1>Edit Profile</h1>
                <img src={profilePic} alt="Profile" className="profile-pic" /> {/* Dynamically display the profile picture */}

                {/* File input for uploading a new profile picture */}
                <div className="input-group">
                    <input type="file" accept="image/*" onChange={handleProfilePicChange} />
                    <button onClick={handleProfilePicUpload}>Upload Profile Picture</button>
                </div>

                {/* Change First Name */}
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <button onClick={handleFirstNameChange}>Save</button>
                </div>

                {/* Change Last Name */}
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <button onClick={handleLastNameChange}>Save</button>
                </div>

                {/* Change Username */}
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleUsernameChange}>Save</button>
                </div>

                {/* Change Email */}
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleEmailChange}>Save</button>
                </div>

                {/* Change Password */}
                <button onClick={handlePasswordChange}>Change Password</button>

                {/* Delete Profile */}
                <button onClick={handleDeleteProfile}>Delete Profile</button>
            </main>
        </div>
    );
}

export default EditProfile;
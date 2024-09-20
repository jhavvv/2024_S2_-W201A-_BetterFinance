import React, { useState } from 'react';
import Navbar from './Navbar';
import { auth, db } from './firebase';
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { updateEmail, deleteUser, sendPasswordResetEmail } from "firebase/auth";

function EditProfile() {

    // State for toggling form fields
    const [showFirstNameInput, setShowFirstNameInput] = useState(false);
    const [showLastNameInput, setShowLastNameInput] = useState(false);
    const [showUsernameInput, setShowUsernameInput] = useState(false);

    // State for form values
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');

    const handleFirstNameChange = async () => {
        try {
            const user = auth.currentUser;
            if(user) {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, { firstName: firstName});
                console.log("First name updated:", firstName);
            }
        }
        catch (error) {
            console.error("Error updating first name:", error);
        }
        setShowFirstNameInput(false);
    };

    const handleLastNameChange = async () => {
        try {
            const user = auth.currentUser;
            if(user) {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, { lastName: lastName});
                console.log("Last name updated:", lastName);
            }
        }
        catch (error) {
            console.error("Error updating last name:", error);
        }
        setShowLastNameInput(false);
    };

    const handleUsernameChange = async () => {
        try {
            const user = auth.currentUser;
            if(user) {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, { username: username });
                console.log("Username updated:", username);
            }
        }
        catch (error) {
            console.error("Error updating username:", error);
        }
        setShowUsernameInput(false);
    };

    const handleEmailChange = async () => {
        try {
            const user = auth.currentUser;
            if(user) {
                await updateEmail(user, user.email);
                await user.sendEmailVerification();
                console.log("Email verification sent to:", user.email);

                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, { email: user.email });
            }
        }
        catch (error) {
            console.error("Error updating email:", error);
        }
    };

    const handlePasswordChange = async () => {
        try {
            const user = auth.currentUser;
            if(user) {
                await sendPasswordResetEmail(auth, user.email);
                console.log("Password reset link sent to:", user.email);
            }
        }
        catch (error) {
            console.error("Error updating password:", error)
        }
    };

    const handleDeleteProfile = async () => {
        try{
            const user = auth.currentUser;
            if(user) {
                await deleteDoc(doc(db, "users", user.uid));
                await deleteUser(user);
                console.log("Profile deleted");
            }
        }
        catch(error) {
            console.error("Error deleting profile", error);
        }
     };

    return (
        <div>
            <Navbar />           
            <main>
                <h1>Edit Profile</h1>
                <img src="/profile.jpg" alt="Profile" className="profile-pic" />

                {/* Change First Name */}
                <button onClick={() => setShowFirstNameInput(!showFirstNameInput)}>Change First Name</button>
                {showFirstNameInput && (
                    <div>
                        <input
                            type="text"
                            placeholder="New First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <button onClick={handleFirstNameChange}>Save First Name</button>
                    </div>
                )}

                {/* Change Last Name */}
                <button onClick={() => setShowLastNameInput(!showLastNameInput)}>Change Last Name</button>
                {showLastNameInput && (
                    <div>
                        <input
                            type="text"
                            placeholder="New Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <button onClick={handleLastNameChange}>Save Last Name</button>
                    </div>
                )}

                {/* Change Username */}
                <button onClick={() => setShowUsernameInput(!showUsernameInput)}>Change Username</button>
                {showUsernameInput && (
                    <div>
                        <input
                            type="text"
                            placeholder="New Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <button onClick={handleUsernameChange}>Save Username</button>
                    </div>
                )}

                {/* Change Email */}
                <button onClick={handleEmailChange}>Change Email</button>
                <p>Email verification link will be sent to your email address.</p>

                {/* Change Password */}
                <button onClick={handlePasswordChange}>Change Password</button>
                <p>Password reset link will be sent to your email.</p>

                {/* Delete Profile */}
                <button onClick={handleDeleteProfile}>Delete Profile</button>
            </main>
        </div>
    )
}

export default EditProfile;

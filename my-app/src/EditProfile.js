import React, { useState } from 'react';
import Navbar from './Navbar';
import { auth, db } from './firebase';
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { updateEmail, updatePassword, deleteUser } from "firebase/auth";

function EditProfile() {

    // State for toggling form fields
    const [showFirstNameInput, setShowFirstNameInput] = useState(false);
    const [showLastNameInput, setShowLastNameInput] = useState(false);
    const [showUsernameInput, setShowUsernameInput] = useState(false);
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);

    // State for form values
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 

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
                await updateEmail(user, email);
                const userRef = doc(db, "users", user.uid);
                await updateEmail(userRef, { email });
                console.log("Email updated:", email);
            }
        }
        catch (error) {
            console.error("Error updating email:", error);
        }
        setShowEmailInput(false);
    };

    const handlePasswordChange = async () => {
        try {
            const user = auth.currentUser;
            if(user) {
                await updatePassword(user, password);
                console.log("Password updated");
            }
        }
        catch (error) {
            console.error("Error updating password:", error)
        }
        setShowPasswordInput(false);
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
                <button onClick={() => setShowEmailInput(!showEmailInput)}>Change Email</button>
                {showEmailInput && (
                    <div>
                        <input
                            type="email"
                            placeholder="New Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button onClick={handleEmailChange}>Save Email</button>
                    </div>
                )}

                {/* Change Password */}
                <button onClick={() => setShowPasswordInput(!showPasswordInput)}>Change Password</button>
                {showPasswordInput && (
                    <div>
                        <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                        <button onClick={handlePasswordChange}>Save Password</button>
                    </div>
                )}

                {/* Delete Profile */}
                <button onClick={handleDeleteProfile}>Delete Profile</button>
            </main>
        </div>
    )
}

export default EditProfile;

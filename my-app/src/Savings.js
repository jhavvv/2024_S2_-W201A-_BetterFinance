/* This page was made for testing purposes and can be modified/deleted if needed */


import Navbar from './Navbar';
import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, getDocs, addDoc, doc } from 'firebase/firestore';
import './Savingscss.css';


function Savings() {
    return (
        <div>
            <Navbar />
            
            <main>
                <h1>Savings</h1>
            </main>
        </div>
    );
}

export default Savings;

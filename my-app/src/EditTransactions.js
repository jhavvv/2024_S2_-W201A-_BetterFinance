import React, { useState, useEffect } from 'react';
import './Informationstyling.css';
import './index.js';
import './stylesheet.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, collection, addDoc } from 'firebase/firestore';

function EditTransactions(){
    const [spending, setSpending] = useState('');
    const [spendingAmount, setSpendingAmount] = useState('');
    const [spendingFrequency, setSpendingFrequency] = useState('');
    const [essentiality, setEssentiality] = useState('');
    const [category, setCategory] = useState('');
    
    const [spendingDate, setSpendingDate] = useState('');
    const [spendingTime, setSpendingTime] = useState('');

    const [userName, setUserName] = useState('');
    const [userID, setUserID] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserName(currentUser.displayName || currentUser.email);
            setUserID(currentUser.uid);
        }
    }, []);
}
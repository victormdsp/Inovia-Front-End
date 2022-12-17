import React from 'react';
import { Link } from "react-router-dom";
import SignBox from '../SignBox/SignBox';

import logo from '../../Assets/logo.png'
import './Header.css'

export default function Header(props) {

    //Page
    return (
        <header id="headerBody">
            <Link to="/" id="homeRoute">
                <img className="logo" src={logo} alt="Logo" />
            </Link>

            <SignBox/>
        </header>
    )
}
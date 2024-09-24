import React from 'react';
import { useNavigate } from "react-router-dom";
import LogoImage from '../../assets/images/logo.png';

const Header = ({ userData = "" }) => {
    const navigate = useNavigate();

    return (
        <div className='md:my-3 sm:my-2 flex w-screen'>
            <div className='text-left w-1/2' onClick={() => navigate('/')}>
                <img src={LogoImage} alt='logo' className='md:w-2/5'/>
            </div>
            {userData.first_name ? (
                <div className='text-right w-1/2 mr-3'>
                    <h2 className='text-xl'>Hi, {userData.first_name}!</h2>
                    <p>Your balance is {userData.balance}</p>
                </div>
            ) : null}
        </div>
    );
}

export default Header;
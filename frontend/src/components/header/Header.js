import React from 'react';
import LogoImage from '../../assets/images/logo.png';
import '../../assets/css/header.css';

const Header = ({ userData = "" }) => {
    return (
        <header>
            <div className='header'>
                <div className='logo'>
                    <img src={LogoImage} alt='logo' width="200px"/>
                </div>
                {userData.first_name ? (
                    <div className='text'>
                        <h2>Hi {userData.first_name}!</h2>
                        <p>Your balance is {userData.balance}</p>
                    </div>
                ) : null}
            </div>
        </header>
    );
}

export default Header;
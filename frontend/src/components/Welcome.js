import React from 'react';
import camera from '../../src/assets/images/bulb1.avif';

import { useNavigate} from "react-router-dom";

import Cookies from 'js-cookie'

const WelcomePage = () => {

    const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    console.log("User userSession :  ", userSession); 

    const navigate = useNavigate()

    function checksession(){
        if(userSession != null){
            if(userSession.user.role=="customer"){
                navigate('/client/Userhome');
            }

            else{
                navigate('/admin/dashboard');
            }
            
             
        }

        else{ navigate('/login')}
    }

    return (
        <>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', padding: '10px 30px'}}>
                
            </header>

            <div 
                style={{
                    margin: 0, 
                    padding: 0, 
                    textAlign: 'center', 
                    color: 'white', 
                    fontFamily: 'Arial, sans-serif', 
                    background: `url(${camera}) no-repeat center center/cover`,
                    height: '80vh', 
                    minHeight: '80vh', 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden' 
                    
                }}
            >
                <h1 style={{ fontSize: '2.5em', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
                Arul Online Electromart <br></br>"Light Up Your Moments with Us "
                </h1>
                <p style={{ fontSize: '1.2em', maxWidth: '600px', textShadow: '1px 1px 8px rgba(0,0,0,0.5)' }}>
                Shop quality electrical products, customize your setups, and power up your space with our expert service.
                </p>
                <button onClick={checksession}
                    style={{
                        padding: '12px 24px',
                        fontSize: '1.2em',
                        background: 'rgb(0, 255, 255)',
                        color: 'black',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        marginTop: '20px',
                        boxShadow: '2px 2px 10px rgba(0,0,0,0.3)'
                    }}
                >
                    Get Started
                </button>
            </div>
        </>
    );
};

export default WelcomePage;

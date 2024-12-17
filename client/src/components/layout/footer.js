import React from 'react';

function Footer(props) {
    return (
        <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5"
        style={{backgroundColor: '#e9ecef'}}>
            <div className="text-black mb-3 mb-md-0">
            Copyright © 2024. All rights reserved.
            </div>
            
            <div>
            <a href="#!" className="black me-4">
                <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#!" className="black me-4">
                <i className="fab fa-twitter"></i>
            </a>
            <a href="#!" className="black me-4">
                <i className="fab fa-google"></i>
            </a>
            <a href="#!" className="black">
                <i className="fab fa-linkedin-in"></i>
            </a>
            </div>
        </div>
    );
}

export default Footer;
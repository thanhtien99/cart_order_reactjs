import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { login } from '../../services/account';
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from '../../utils/toastify';

function Login() {
    const [user, setUser] = useState({ email: "", password: ""});
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const onChange = (e) => {
        e.preventDefault();
        setUser({...user, [e.target.name]: e.target.value});
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(user);

            const { isAuthenticated, user: loggedInUser, message } = data;
            
            if (isAuthenticated) {
                authContext.setUser(loggedInUser); 
                authContext.setIsAuthenticated(isAuthenticated); 
                navigate("/"); 
                notifySuccess("Login successfully.");
            } else {
                notifyError(message.msgBody); 
            }
        } catch (error) {
            notifyError( "An error occurred, please try again."); 
        }
    };

    return (
        // <section>
            <div className="container h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-md-9 col-lg-6 col-xl-5">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                    className="img-fluid" alt="Illustration of a user interacting with a login form" />
                </div>
                <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                    <form onSubmit={onSubmit}>
                    <div className="divider d-flex align-items-center my-4">
                        <h3 className="text-center fw-bold mx-3 mb-0">Đăng Nhập</h3>
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                        <input type="email" name="email" id="form3Example3" className="form-control form-control-lg"
                        placeholder="Email"
                        value={user.email}
                        onChange={onChange} />
                        
                    </div>

                    <div data-mdb-input-init className="form-outline mb-3">
                        <input type="password" name="password" id="form3Example4" className="form-control form-control-lg"
                        placeholder="Password"
                        value={user.password}
                        onChange={onChange} />
                        
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <div className="form-check mb-0">
                        <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                        <label className="form-check-label" htmlFor="form2Example3">
                            Remember me
                        </label>
                        </div>
                        <a href="#!" className="text-body">Quên mật khẩu?</a>
                    </div>

                    <div className="text-center text-lg-start mt-4 pt-2">
                        <button  type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-warning btn-lg"
                        style={{"paddingLeft": "2.5rem", "paddingRight": "2.5rem"}}>Đăng nhập</button>
                    </div>

                    </form>
                </div>
                </div>
            </div>
        // </section>
    );
}

export default Login;
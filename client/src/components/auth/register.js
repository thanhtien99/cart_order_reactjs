import React, { useState } from 'react';
import { register } from '../../services/account';
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from '../../utils/toastify'

function Register(props) {
    const [user, setUser] = useState({
        email: "",
        username: "",
        phone: "",
        address: "",
        password: "",
        passwordConfig: ""
    });

    const navigate = useNavigate();

    const onChange = (e) => {
        e.preventDefault();
        setUser({...user, [e.target.name]: e.target.value});
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Validation check for matching passwords
        if (user.password !== user.passwordConfig) {
            notifyError("Passwords do not match.");
            return;
        }

        const requestData = {
            email: user.email,
            username: user.username,
            password: user.password,
            phone: user.phone,
            address: user.address
        };

        try {
            // Call api
            const data = await register(requestData);
            const { message } = data;

            if (message.msgError) {
                notifyError(message.msgBody);
            } else{
                notifySuccess(message.msgBody);
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            }
        } catch (error) {
            notifyError("An error occurred, please try again.");
        }
    };

    return (
        <div className="container h-custom">
            <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid" alt="Sample image" />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                <form onSubmit={onSubmit}>
                   
                    <div className="divider d-flex align-items-center my-4">
                        <h3 className="text-center fw-bold mx-3 mb-0">Đăng Ký</h3>
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                        <input type="email" name="email" id="form3Example3" className="form-control form-control-lg"
                        placeholder="Email" 
                        value={user.email}
                        onChange={onChange}/>
                        
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                        <input type="text" name="username" id="form3Example3" className="form-control form-control-lg"
                        placeholder="Tên người dùng" 
                        value={user.username}
                        onChange={onChange}/>
                        
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                        <input type="number" name="phone" id="form3Example3" className="form-control form-control-lg"
                        placeholder="Số điện thoại" 
                        value={user.phone}
                        onChange={onChange}/>
                        
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                        <input type="text" name="address" id="form3Example3" className="form-control form-control-lg"
                        placeholder="Địa chỉ"
                        value={user.address}
                        onChange={onChange} />
                        
                    </div>

                    <div data-mdb-input-init className="form-outline mb-3">
                        <input type="password" name="password" id="form3Example4" className="form-control form-control-lg"
                        placeholder="Mật khẩu"
                        value={user.password}
                        onChange={onChange} />
                        
                    </div>

                    <div data-mdb-input-init className="form-outline mb-3">
                        <input type="password" name="passwordConfig" id="form3Example4" className="form-control form-control-lg"
                        placeholder="Nhập lại mật khẩu"
                        value={user.passwordConfig}
                        onChange={onChange} />
                        
                    </div>

                    <div className="text-center text-lg-start mt-4 pt-2">
                        <button  type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-warning btn-lg"
                        style={{"padding-left": "2.5rem", "padding-right": "2.5rem"}}>Đăng ký</button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
}

export default Register;
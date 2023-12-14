import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Fragment, useState, useEffect } from 'react';
import className from 'classnames/bind';
import styles from './TTCN.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import images from '~/assets/images/images';
import { ReturnIcon } from '~/components/Icons';

const cx = className.bind(styles);

function TTCN({ setHeaderVariable }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    var user = location.state ? location.state.user : [];
    const [thisUser, setThisUser] = useState(user);

    const handleUserClick = () => {
        if (phone == '' && fullname == '' && username == '' && password == '') {
            toast.warning(`Không có gì thay đổi!`);
            return;
        }
        if (checkFullnameInput() && checkUsernameInput() && checkPassInput()) {
            checkUserNameExist().then(result => {
                if (result) {
                    if (username !== thisUser.taiKhoan) return false;
                }
                else {
                    if (UpdateUser()) {
                        toast.success('Cập nhật thành công!');
                        setFullname('');
                        setUsername('');
                        setPassword('');
                    }
                }
            });

        }
    };
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    const handleFullnameChange = (e) => {
        setFullname(e.target.value);
    };
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const checkFullnameInput = () => {
        var err = document.getElementsByClassName("invalid_Fullname")[0];
        if (fullname === '') {
            err.style.display = "none";
            return true;
        }
        const regex = new RegExp(/[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/);
        if (fullname.trim().length <= 2) {
            err.innerHTML = "Tên quá ngắn";
            err.style.display = "flex";
            return false;
        }
        if (regex.test(fullname.trim())) {
            err.innerHTML = "Tên không chứa các ký tự đặc biệt hoặc số";
            err.style.display = "flex";
            return false;
        }
        user.hoTen = fullname;
        err.style.display = "none";
        return true;
    }

    const checkUsernameInput = () => {
        var err = document.getElementsByClassName("invalid_Username")[0];
        if (username === '') {
            err.style.display = "none";
            return true;
        }
        const regex = new RegExp(/^[^\s]{3,10}$/);
        if (!regex.test(username)) {
            err.innerHTML = "Username có từ 3-10 ký tự và không chứa khoảng trắng";
            err.style.display = "flex";
            return false;
        }
        user.taiKhoan = username;
        err.style.display = "none";
        return true;
    }

    const checkPassInput = () => {
        var err = document.getElementsByClassName("invalid_Password")[0];
        if (password === '') {
            err.style.display = "none";
            return true;
        }
        const regex = new RegExp(/^[^\s]{3,10}$/);
        if (!regex.test(password)) {
            err.innerHTML = "Password có từ 3-10 ký tự và không chứa khoảng trắng";
            err.style.display = "flex";
            return false;
        }
        user.matKhau = password;
        err.style.display = "none";
        return true;
    }
    const checkUserNameExist = () => {
        return new Promise((resolve, reject) => {
            fetch(`${process.env.REACT_APP_BASE_URL}/Login/getUserLogin/${username}`)
                .then(response => {
                    if (response.ok) {
                        var err = document.getElementsByClassName("invalid_Username")[0];
                        err.innerHTML = "Tài khoản đã tồn tại!";
                        err.style.display = "flex";
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch(error => {
                    console.log('Error fetching user data:', error);
                    reject(error);
                });
        });
    };
    const UpdateUser = () => {
        if (phone === '' && fullname === '' && username === '' && password === '') {
            toast.warning(`Không có gì thay đổi!`);
            return Promise.resolve(false);
        }
        return new Promise((resolve, reject) => {
            axios
                .put(`${process.env.REACT_APP_BASE_URL}/User/UpdateUser`, {
                    sdt: user.sdt,
                    hoTen: user.hoTen,
                    taiKhoan: user.taiKhoan,
                    matKhau: user.matKhau,
                    admin: false,
                    active: true
                })
                .then((response) => {
                    setThisUser(response.data.nguoiDungToUpdate);
                    if (setHeaderVariable) setHeaderVariable(thisUser);
                    resolve(true);
                })
                .catch(error => {
                    alert("sụp sơ vờ rồi bạn!");
                    reject(error);
                });
        });
    };
    return (
        <Fragment>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className={cx('ThongTinCaNhan')}>
                <div className={cx('ThongTin')}>
                    <div className={cx('anh')}>
                        <div className={cx("user-card")}>
                            <div className={cx("user-avatar")} style={{ backgroundColor: getRandomColor() }}>
                                <span>{user.hoTen.toUpperCase().charAt(0)}</span>
                            </div>
                        </div>
                    </div>

                    <div className={cx('sub_ThongTin')}>
                        <div className={cx("div_admin")}>
                            <h2>THÔNG TIN TÀI KHOẢN</h2>
                        </div>

                        <div className={cx("Tong")}>
                            <div className={cx("label_thongtin")}>
                                <label>Họ tên: </label>
                                <label>Điện thoại: </label>
                                <label>Tài khoản: </label>
                                <label>Mật khẩu: </label>

                            </div>
                            <div className={cx("label_duLieu")}>
                                <label className={cx("label_name")}>{thisUser.hoTen} </label>
                                <label className={cx("label_phone")}>{thisUser.sdt}</label>
                                <label className={cx("label_username")}>{thisUser.taiKhoan}</label>
                                <label className={cx("label_pass")}>{thisUser.matKhau}</label>

                            </div>
                        </div>

                    </div>

                </div>

                <div className={cx('CapNhat')}>
                    <div className={cx('thanh_cap_nhat')}>
                        <p className={cx('P_capnhat')}>Cập nhật</p>

                    </div>
                    <div className={cx("cap_nhat_thong_tin")}>
                        <div className={cx("Tong_cap_nhat_thong_tin")}>
                            <div className={cx("label_thongtin_cap_nhat")}>
                                <label>Họ tên: </label>
                                <label>Điện thoại: </label>
                                <label>Tài khoản: </label>
                                <label>Mật khẩu: </label>

                            </div>
                            <div className={cx("input_duLieu_cap_nhat")}>
                                <input placeholder={thisUser.hoTen} onChange={handleFullnameChange} />
                                <p className={cx("invalid_Fullname")} >Họ tên không chứa số và kí tự đặc biệt</p>
                                <input value={thisUser.sdt} disabled=" " />
                                <input placeholder={thisUser.taiKhoan.trim()} onChange={handleUsernameChange} />
                                <p className={cx("invalid_Username")}>Username có từ 3-10 ký tự và không chứa khoảng trắng</p>
                                <input placeholder={thisUser.matKhau.trim()} onChange={handlePasswordChange} />
                                <p className={cx("invalid_Password")}>Password có từ 3-10 ký tự và không chứa khoảng trắng</p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className={cx("button-div")}>
                    <button className={cx('btn_luu')} onClick={() => handleUserClick()}>Lưu</button>
                </div>

            </div>
        </Fragment>
    );
}

export default TTCN;

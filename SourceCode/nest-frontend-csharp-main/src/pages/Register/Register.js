import { Fragment, useState } from 'react';
import className from 'classnames/bind';
import axios from 'axios';
import styles from './Register.module.scss';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import images from '~/assets/images/images';
import 'react-toastify/dist/ReactToastify.css';

const cx = className.bind(styles);
const Register = () => {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleFullnameChange = (e) => {
    setFullname(e.target.value);
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (checkFullnameInput() && checkPhoneInput() && checkUsernameInput() && checkPassInput()) {
      checkUserExist().then(result => {
        console.log('Result check phone:', result);
        if (!result) checkUserNameExist().then(result => {
          console.log('Result check username:', result);
          console.log("check success!");
          if (!result) addUser().then(result => {
            console.log('Result:', result);
            if (result) {
              alert('Tạo tài khoản thành công!');
              navigate("/");
            }
            else alert('Sụp se vờ rầu không lưu được!');
          }).catch(error => {
            console.error('Error:', error);
          });
        }).catch(error => {
          console.error('Error:', error);
        });
      }).catch(error => {
        console.error('Error:', error);
      });
    }
  };
  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/");
  };
  function checkPhoneInput() {

    var err = document.getElementsByClassName("invalid_Phone")[0];
    const regex = new RegExp(/^0[0-9]{9}$/);
    if (phone.length === 0) {
      err.innerHTML = "Bạn chưa nhập gì nè";
      err.style.display = "flex";
      return false;
    }
    if (!regex.test(phone)) {
      err.innerHTML = "Số điện thoại chỉ chứa 10 số và bắt đầu bằng 0";
      err.style.display = "flex";
      return false;
    }
    err.style.display = "none";
    return true;
  }

  function checkFullnameInput() {
    var err = document.getElementsByClassName("invalid_Fullname")[0];
    const regex = new RegExp(/[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/);
    if (fullname.length === 0) {
      err.innerHTML = "Bạn chưa nhập gì nè";
      err.style.display = "flex";
      return false;
    }
    if (regex.test(fullname)) {
      err.innerHTML = "Tên không chứa các ký tự đặc biệt hoặc số";
      err.style.display = "flex";
      return false;
    }
    err.style.display = "none";
    return true;
  }

  function checkUsernameInput() {
    var err = document.getElementsByClassName("invalid_Username")[0];
    const regex = new RegExp(/^[^\s]{3,10}$/);
    if (username.length === 0) {
      err.innerHTML = "Bạn chưa nhập gì nè";
      err.style.display = "flex";
      return false;
    }
    if (!regex.test(username)) {
      err.innerHTML = "Username có từ 3-10 ký tự và không chứa khoảng trắng";
      err.style.display = "flex";
      return false;
    }
    err.style.display = "none";
    return true;
  }

  function checkPassInput() {
    var err = document.getElementsByClassName("invalid_Password")[0];
    const regex = new RegExp(/^[^\s]{3,10}$/);
    if (password.length === 0) {
      err.innerHTML = "Bạn chưa nhập gì nè";
      err.style.display = "flex";
      return false;
    }
    if (!regex.test(password)) {
      err.innerHTML = "Password có từ 3-10 ký tự và không chứa khoảng trắng";
      err.style.display = "flex";
      return false;
    }
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
  const checkUserExist = () => {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_BASE_URL}/User/getUser/${phone}`)
        .then(response => {
          if (response.ok) {
            var err = document.getElementsByClassName("invalid_Phone")[0];
            err.innerHTML = "Số điện thoại đã được đăng ký!";
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
  const addUser = () => {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_BASE_URL}/User/adduser`, {
        sdt: phone,
        hoTen: fullname,
        taiKhoan: username,
        matKhau: password,
        admin: false,
        active: true
      })
        .then(response => {
          if (response.status === 200) {
            console.log("Add success!");
            resolve(true);
          } else {
            console.log("Add failed!");
            resolve(false);
          }
        })
        .catch(error => {
          console.error('Error adding user:', error);
          reject(error);
        });
    });
  };

  return (
    <Fragment>
      <div className={cx("overlay")}></div>
      <div className={cx("register-container")}>
        <h2>REGISTER</h2>
        <form onSubmit={handleRegister}>
          <p className={cx("invalid_Fullname")}>Họ tên không chứa số và kí tự đặc biệt</p>
          <input type="text" value={fullname} onChange={handleFullnameChange} required placeholder='Nhập họ tên' />
          <p className={cx("invalid_Phone")}>Số điện thoại chỉ chứa 10 số và bắt đầu bằng 0</p>
          <input type="tel" value={phone} onChange={handlePhoneChange} required placeholder='Nhập số điện thoại' />
          <p className={cx("invalid_Username")}>Username có từ 3-10 ký tự và không chứa khoảng trắng</p>
          <input type="text" value={username} onChange={handleUsernameChange} required placeholder='Nhập tên đăng nhập' />
          <p className={cx("invalid_Password")}>Password có từ 3-10 ký tự và không chứa khoảng trắng</p>
          <input type="password" value={password} onChange={handlePasswordChange} required placeholder='Nhập mật khẩu' />
          <button className={cx('register-button')} onClick={handleRegister}>Register</button>
          <button className={cx('login-button')} onClick={handleLogin}>Login</button>
        </form>
      </div>
    </Fragment>
  );
};

export default Register;

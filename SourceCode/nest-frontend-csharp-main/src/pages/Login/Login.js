import { Fragment, useState } from 'react';
import className from 'classnames/bind';
import Cookies from 'js-cookie';
import styles from './Login.module.scss';
import { useNavigate} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const cx = className.bind(styles);
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleLogin = (e) => {
    e.preventDefault();
    if(checkUsernameInput() && checkPassInput())
    {
      fetchData();
    }
  };
  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/Register");
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/Login/getUserLogin/${username}`);
      if (response.ok) {
        const data = await response.json();
        if (password == data.matKhau.trim()) {
          await fetchToken(data.sdt);
        }
        else
        {
          var err = document.getElementsByClassName("invalid_Password")[0];
          err.innerHTML = "Mật khẩu khum đúng!";
          err.style.display = "flex";
        }
      }
      else
      {
        var err = document.getElementsByClassName("invalid_Username")[0];
        err.innerHTML = "Tài khoản khum tồn tại!";
        err.style.display = "flex";
      }
    } catch (error) {
      alert("sụp sơ vờ rồi bạn!");
    }
  };
  const fetchToken = async (phoneNumber) => {
    try {
      const responseToken = await fetch(`${process.env.REACT_APP_BASE_URL}/User/getToken/${phoneNumber}`);
      const dataToken = await responseToken.json();
      if (responseToken.ok) {
        const token = dataToken.accessToken;
        console.log(token);
        Cookies.set('accountToken', token);
        navigate('/home');
      }
    } catch (error) {
      alert("sụp sơ vờ rồi bạn!");
    }
  };

  const checkUsernameInput = () => {
    var err = document.getElementsByClassName("invalid_Username")[0];
    if(username.length === 0) 
    {
      console.log(1);
      err.innerHTML = "Bạn chưa nhập gì nè!";
      err.style.display = "flex";
      return false;
    }
    err.style.display = "none";
    return true;
  }

  const checkPassInput = () => {
    var err = document.getElementsByClassName("invalid_Password")[0];
    if(password.length === 0) 
    {
      err.innerHTML = "Bạn chưa nhập gì nè!";
      err.style.display = "flex";
      return false;
    }
    err.style.display = "none";
    return true;
  }
  return (
    <Fragment>
      <div className={cx("overlay")}></div>
      <div className={cx("login-container")}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <p className={cx("invalid_Username")}></p>
          <input type="text" value={username} onChange={handleUsernameChange} placeholder='Username' />
          <p className={cx("invalid_Password")}></p>
          <input type="password" value={password} onChange={handlePasswordChange} placeholder='Password' />
          <button className={cx('login-button')} onClick={handleLogin}>Login</button>
          <button className={cx('register-button')} onClick={handleRegister}>Register</button>
        </form>
      </div>
    </Fragment>
  );
};

export default Login;
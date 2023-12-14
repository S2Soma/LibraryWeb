import PropTypes from 'prop-types';
import React from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useEffect, useState } from 'react';
import className from 'classnames/bind';
import MenuBar from '../components/MenuBar/MenuBar';
import MenuBarUser from '../components/MenuBarUser/MenuBarUser';
import styles from './DefaultLayout.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';

const cx = className.bind(styles);

function DefaultLayout({ children }) {
  const location = useLocation();
  const { state } = location;
  const token = Cookies.get("accountToken");
  const [user, setUser] = useState(null);
  const [isAdmin, setAdmin] = useState(false); 
  const [headerVariable, setHeaderVariable] = useState('');

    const handleSetHeaderVariable = (newValue) => {
        setHeaderVariable(newValue);
    };

  useEffect(() => {
    const fetchToken = () => {
      if (token === null || user !== null) return;
    
      fetch(`${process.env.REACT_APP_BASE_URL}/User/getUserFromToken/${token}`)
        .then((responseToken) => {
          if (!responseToken.ok) {
            throw new Error('Không lấy được user từ token!');
          }
          return responseToken.json();
        })
        .then((dataToken) => {
          console.log(dataToken);
          localStorage.setItem('user', JSON.stringify(dataToken));
          setUser(dataToken);

          if (dataToken && dataToken.admin) {
            setAdmin(true);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          alert('Sự cố xảy ra khi lấy dữ liệu người dùng!');
        });
    };

    fetchToken();
    console.log(user);
  }, [token, user]);

  return (
    <div className={cx('wrapper')}>
      {isAdmin ? <MenuBar variable={headerVariable}/>: <MenuBarUser variable={headerVariable}/>}
      <div className={cx('content')}>{React.cloneElement(children, { setHeaderVariable: handleSetHeaderVariable })}</div>
    </div>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DefaultLayout;

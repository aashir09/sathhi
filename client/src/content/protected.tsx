import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

function Protected(props) {
  const { Component, Title } = props;
  const navigate = useNavigate();
  useEffect(() => {
    let Login = localStorage.getItem('SessionToken');
    if (!Login) {
      navigate('/admin');
    }
    else {
      console.log(props);
      let user = (JSON.parse(localStorage.getItem('Credentials')) as any);
      if (user && user.roleId == 1) {

      } else {
        if (user && user.roleId == 3) {
          if (user.pagePermissions && user.pagePermissions.length > 0) {
            let ind = user.pagePermissions.findIndex(c => c.title == props.Title);
            if (ind >= 0) {

            } else {
              localStorage.clear();
              navigate('/admin/nopagepermission');
            }
          } else {
            localStorage.clear();
            navigate('/admin');
          }
        }
      }
    }
  });
  return (
    <div>
      <Component />
    </div>
  );
}

export default Protected;

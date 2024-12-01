import { ChangeEvent, useEffect, useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TableContainer,
  Typography,
  Stack,
  Tooltip,
  Switch,
  TextField,
  IconButton,
  InputAdornment,
  FormGroup,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
  FormHelperText
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import APIservice from 'src/utils/APIservice';
import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Loader1 from '../Loader';
import { Helmet } from 'react-helmet-async';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./Setting.css"

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image']
    ],
  },
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Setting = () => {
  const [list, setList] = useState<any[]>([]);
  const [groupflag, setGroupFlag] = useState([]);
  const [value, setValue] = useState('0');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let [credentail, setCredentail] = useState<any>();

  const [isReadPermission, setIsReadPermission] = useState(true);
  const [isWritePermission, setIsWritePermission] = useState(true);
  const [isEditPermission, setIsEditPermission] = useState(true);
  const [isDeletePermission, setIsDeletePermission] = useState(true);
  const navigate = useNavigate();


  let [apiUrl, setApiUrl] = useState<any>();

  // window.onpopstate = () => {
  //   navigate(-1);
  // }

  useEffect(() => {
    let cred = JSON.parse(localStorage.getItem('Credentials'));
    setCredentail(cred);
    //getData();
    if (cred) {
      if (cred.roleId != 1) {
        let ind = cred.pagePermissions.findIndex((c: any) => c.title === "Block Users");
        if (ind >= 0) {
          setIsReadPermission(cred.pagePermissions[ind].isReadPermission);
          setIsWritePermission(cred.pagePermissions[ind].isAddPermission)
          setIsEditPermission(cred.pagePermissions[ind].isEditPermission);
          setIsDeletePermission(cred.pagePermissions[ind].isDeletePermission);

          if (cred.pagePermissions[ind].isReadPermission)
            getData();
          loadjson()
        }
      } else {
        getData();
        loadjson();
      }
    }
  }, []);

  const loadjson = async () => {
    let res = await fetch('/admin/variable.json'); // Adjust the file path as needed
    let url = await res.json();
    setApiUrl(url);
    apiUrl = url;
  }

  const getData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let response = await APIservice.httpPost(
      '/api/admin/systemflags/getAdminSystemFlagSetting',
      {},
      token,
      refreshToken
    );
    let _data = response.recordList;
    if (_data && _data.length > 0) {
      for (let i = 0; i < _data.length; i++) {
        for (let j = 0; j < _data[i].group.length; j++) {
          for (let k = 0; k < _data[i].group[j].systemFlag.length; k++) {
            if (_data[i].group[j].systemFlag[k].valueTypeId === 9) {
              if (_data[i].group[j].systemFlag[k].value)
                _data[i].group[j].systemFlag[k].value =  _data[i].group[j].systemFlag[k].value;
            }
          }
        }
        for (let j = 0; j < _data[i].systemFlag.length; j++) {
          if (_data[i].systemFlag[j].valueTypeId === 9) {
            if (_data[i].systemFlag[j].value)
              _data[i].systemFlag[j].value =  _data[i].systemFlag[j].value;
          }
        }
      }
    }

    setList(_data);
    let data = _data[0].systemFlag[0].value;
    localStorage.setItem('DateFormat', data);
    setIsLoading(false);
  };

  const handleEditorChange = (value: string, id: number, flagGroup: any, childGroup: any, pSystemFlag: any) => {
    // setContent(value);
    // onChange(value);
    let changeFlag = false;
    console.log("value");
    let fGroups = JSON.parse(JSON.stringify(list));
    if (flagGroup && flagGroup.id) {
      let ind = fGroups.findIndex((c) => c.id == flagGroup.id);
      if (ind >= 0) {
        if (childGroup && childGroup.id) {
          let cInd = fGroups[ind].group.findIndex((c) => c.id == childGroup.id);
          if (cInd >= 0) {
            let sInd = fGroups[ind].group[cInd].systemFlag.findIndex(
              (c) => c.id == parseInt(id + "")
            );
            if (sInd >= 0) {
              if (fGroups[ind].group[cInd].systemFlag[sInd].value != value) {
                fGroups[ind].group[cInd].systemFlag[sInd].value = value;
                changeFlag = true;
              }
              let childFlags = fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag;
              if (childFlags && childFlags.length > 0) {
                for (let i = 0; i < fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag.length; i++) {
                  if (fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag[i].parentFlagValue == fGroups[ind].group[cInd].systemFlag[sInd].value) {
                    fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag[i].autoRender = 1;
                  } else {
                    fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag[i].autoRender = 0;
                  }
                }
              }
            }
            if (pSystemFlag && pSystemFlag.id) {
              let psind = fGroups[ind].group[cInd].systemFlag.findIndex((c) => c.id == pSystemFlag.id);;
              let csInd = fGroups[ind].group[cInd].systemFlag[psind].childSystemFlag.findIndex(
                (c) => c.id == parseInt(id + "")
              );
              if (csInd >= 0) {
                fGroups[ind].group[cInd].systemFlag[psind].childSystemFlag[csInd].value =
                  value;
              }
            }

          }
        } else {
          let sInd = fGroups[ind].systemFlag.findIndex(
            (c) => c.id == parseInt(id + "")
          );
          if (sInd >= 0) {
            if (fGroups[ind].systemFlag[sInd].value != value) {
              fGroups[ind].systemFlag[sInd].value = value;
              changeFlag = true;
            }
            let childFlags = fGroups[ind].systemFlag[sInd].childSystemFlag;
            if (childFlags && childFlags.length > 0) {
              for (let i = 0; i < fGroups[ind].systemFlag[sInd].childSystemFlag.length; i++) {
                if (fGroups[ind].systemFlag[sInd].childSystemFlag[i].parentFlagValue == fGroups[ind].systemFlag[sInd].value) {
                  fGroups[ind].systemFlag[sInd].childSystemFlag[i].autoRender = 1;
                } else {
                  fGroups[ind].systemFlag[sInd].childSystemFlag[i].autoRender = 0;
                }
              }
            }

          }

          if (pSystemFlag && pSystemFlag.id) {
            let psind = fGroups[ind].systemFlag.findIndex((c) => c.id == pSystemFlag.id);
            let csInd = fGroups[ind].systemFlag[psind].childSystemFlag.findIndex(
              (c) => c.id == parseInt(id + "")
            );
            if (csInd >= 0) {
              fGroups[ind].systemFlag[psind].childSystemFlag[csInd].value = value
            }
          }
        }
      }
    }
    if (changeFlag)
      setList(fGroups);
  };


  const handleflagChange = (e: ChangeEvent<HTMLInputElement>, flagGroup: any, childGroup: any, pSystemFlag: any) => {
    debugger;
    //let flagGroup = JSON.parse(JSON.stringify(list));
    let fGroups = JSON.parse(JSON.stringify(list));
    if (flagGroup && flagGroup.id) {
      let ind = fGroups.findIndex((c) => c.id == flagGroup.id);
      if (ind >= 0) {
        if (childGroup && childGroup.id) {
          let cInd = fGroups[ind].group.findIndex((c) => c.id == childGroup.id);
          if (cInd >= 0) {
            let sInd = fGroups[ind].group[cInd].systemFlag.findIndex(
              (c) => c.id == parseInt(e.target.name)
            );
            if (sInd >= 0) {
              if (fGroups[ind].group[cInd].systemFlag[sInd].valueTypeId === 7) {
                // let res = fGroups[ind].group[cInd].systemFlag[sInd].value
                // res === 0 ? 1 : 0
                fGroups[ind].group[cInd].systemFlag[sInd].value = (fGroups[ind].group[cInd].systemFlag[sInd].value === '1' || fGroups[ind].group[cInd].systemFlag[sInd].value === true) ? true : false;
                fGroups[ind].group[cInd].systemFlag[sInd].value = !(
                  fGroups[ind].group[cInd].systemFlag[sInd].value
                );
              } else {
                fGroups[ind].group[cInd].systemFlag[sInd].value =
                  e.target.value;
              }

              let childFlags = fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag;
              if (childFlags && childFlags.length > 0) {
                for (let i = 0; i < fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag.length; i++) {
                  if (fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag[i].parentFlagValue == fGroups[ind].group[cInd].systemFlag[sInd].value) {
                    fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag[i].autoRender = 1;

                    if (fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag[i].valueTypeId === 7) {
                      fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag[i].value = (fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag[i].value === '1' || fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag[i].value === true) ? true : false;
                      fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag[i].value = !(
                        fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag[i].value
                      );
                    }
                  } else {
                    fGroups[ind].group[cInd].systemFlag[sInd].childSystemFlag[i].autoRender = 0;
                  }
                }
              }
            }
            if (pSystemFlag && pSystemFlag.id) {
              let psind = fGroups[ind].group[cInd].systemFlag.findIndex((c) => c.id == pSystemFlag.id);;
              let csInd = fGroups[ind].group[cInd].systemFlag[psind].childSystemFlag.findIndex(
                (c) => c.id == parseInt(e.target.name)
              );
              if (csInd >= 0) {
                if (fGroups[ind].group[cInd].systemFlag[psind].childSystemFlag[csInd].valueTypeId === 7) {
                  // let res = fGroups[ind].group[cInd].systemFlag[sInd].value
                  // res === 0 ? 1 : 0
                  fGroups[ind].group[cInd].systemFlag[psind].childSystemFlag[csInd].value = (fGroups[ind].group[cInd].systemFlag[psind].childSystemFlag[csInd].value === '1' || fGroups[ind].group[cInd].systemFlag[psind].childSystemFlag[csInd].value === true) ? true : false;
                  fGroups[ind].group[cInd].systemFlag[psind].childSystemFlag[csInd].value = !(
                    fGroups[ind].group[cInd].systemFlag[psind].childSystemFlag[csInd].value
                  );
                } else {
                  fGroups[ind].group[cInd].systemFlag[psind].childSystemFlag[csInd].value =
                    e.target.value;
                }
              }
            }

          }

        } else {
          let sInd = fGroups[ind].systemFlag.findIndex(
            (c) => c.id == parseInt(e.target.name)
          );
          if (sInd >= 0) {
            if (fGroups[ind].systemFlag[sInd].valueTypeId === 7) {
              fGroups[ind].systemFlag[sInd].value = (fGroups[ind].systemFlag[sInd].value === '1' || fGroups[ind].systemFlag[sInd].value === true) ? true : false;
              fGroups[ind].systemFlag[sInd].value = !(fGroups[ind].systemFlag[sInd].value);
              if (fGroups[ind].systemFlag[sInd].id == 41 && !fGroups[ind].systemFlag[sInd].value) {
                let rewardInd = fGroups[ind].systemFlag.findIndex(c => c.id == 42);
                if (rewardInd >= 0 && fGroups[ind].systemFlag[rewardInd].valueTypeId === 7) {
                  fGroups[ind].systemFlag[rewardInd].value = false;
                }
              }
            } else {
              fGroups[ind].systemFlag[sInd].value = e.target.value;
            }

            let childFlags = fGroups[ind].systemFlag[sInd].childSystemFlag;
            if (childFlags && childFlags.length > 0) {
              for (let i = 0; i < fGroups[ind].systemFlag[sInd].childSystemFlag.length; i++) {
                if (fGroups[ind].systemFlag[sInd].childSystemFlag[i].parentFlagValue == fGroups[ind].systemFlag[sInd].value) {
                  fGroups[ind].systemFlag[sInd].childSystemFlag[i].autoRender = 1;

                  if (fGroups[ind].systemFlag[sInd].childSystemFlag[i].valueTypeId === 7) {
                    fGroups[ind].systemFlag[sInd].childSystemFlag[i].value = (fGroups[ind].systemFlag[sInd].childSystemFlag[i].value === '1' || fGroups[ind].systemFlag[sInd].childSystemFlag[i].value === true) ? true : false;
                    fGroups[ind].systemFlag[sInd].childSystemFlag[i].value = !(
                      fGroups[ind].systemFlag[sInd].childSystemFlag[i].value
                    );
                  }
                } else {
                  fGroups[ind].systemFlag[sInd].childSystemFlag[i].autoRender = 0;
                }
              }
            }
          }
          if (pSystemFlag && pSystemFlag.id) {
            let psind = fGroups[ind].systemFlag.findIndex((c) => c.id == pSystemFlag.id);
            let csInd = fGroups[ind].systemFlag[psind].childSystemFlag.findIndex(
              (c) => c.id == parseInt(e.target.name)
            );
            if (csInd >= 0) {
              if (fGroups[ind].systemFlag[psind].childSystemFlag[csInd].valueTypeId === 7) {
                // let res = fGroups[ind].group[cInd].systemFlag[sInd].value
                // res === 0 ? 1 : 0
                fGroups[ind].systemFlag[psind].childSystemFlag[csInd].value = (fGroups[ind].systemFlag[psind].childSystemFlag[csInd].value === '1' || fGroups[ind].systemFlag[psind].childSystemFlag[csInd].value === true) ? true : false;
                fGroups[ind].systemFlag[psind].childSystemFlag[csInd].value = !(
                  fGroups[ind].systemFlag[psind].childSystemFlag[csInd].value
                );
              } else {
                fGroups[ind].systemFlag[psind].childSystemFlag[csInd].value =
                  e.target.value;
              }
            }
          }
        }


        let checkindex = fGroups[ind].systemFlag.findIndex((c) => c.value === "PreFix" || c.value === "PostFix");
        // if (checkindex >= 0) {
        //   setIsPreOrPost(true);
        // } else {
        //   setIsPreOrPost(false);
        // }

      }
    }

    //show child flag on condition
    // let value: any
    // if (e.target.value === '1' || e.target.value === '0' || e.target.value === 'true' || e.target.value === 'false') {
    //   //store opposite boolean value in value
    //   value = (e.target.value === '1' || e.target.value === 'true') ? 0 : 1;
    // } else {
    //   value = e.target.value
    // }
    // if (fGroups && fGroups.length > 0) {
    //   if (fGroups && fGroups.length > 0) {
    //     debugger
    //     for (let i = 0; i < fGroups.length; i++) {
    //       for (let j = 0; j < fGroups[i].group.length; j++) {

    //         let matchingIndices = fGroups[i].group[j].systemFlag
    //           .map((c: any, index: number) => ({ ...c, index }))  // Map to objects with value and index
    //           .filter((c: any) => c.parentFlagId == parseInt(e.target.name))  // Filter those that match the condition
    //           .map((c: any) => c.index);

    //         if (matchingIndices && matchingIndices.length > 0) {
    //           for (let index of matchingIndices) {
    //             if (fGroups[i].group[j].systemFlag[index].parentFlagValue == value) {
    //               fGroups[i].group[j].systemFlag[index].autoRender = true;
    //               if (fGroups[i].group[j].systemFlag[index].valueTypeId === 7) {

    //                 fGroups[i].group[j].systemFlag[index].value = (fGroups[i].group[j].systemFlag[index].value === '1' || fGroups[i].group[j].systemFlag[index].value === true) ? true : false;
    //                 fGroups[i].group[j].systemFlag[index].value = !(
    //                   fGroups[i].group[j].systemFlag[index].value
    //                 );
    //               }
    //             } else {
    //               fGroups[i].group[j].systemFlag[index].autoRender = false;
    //             }
    //           }
    //         }
    //       }
    //     }
    //     for (let i = 0; i < fGroups.length; i++) {
    //       for (let j = 0; j < fGroups[i].systemFlag.length; j++) {

    //         // let childSysFlagInd = fGroups[i].systemFlag.findIndex((c: any) => (c.parentFlagId == parseInt(e.target.name)) && (c.parentFlagValue == value));

    //         let matchingIndices = fGroups[i].systemFlag
    //           .map((c: any, index: number) => ({ ...c, index }))  // Map to objects with value and index
    //           .filter((c: any) => c.parentFlagId == parseInt(e.target.name))  // Filter those that match the condition
    //           .map((c: any) => c.index);

    //         if (matchingIndices && matchingIndices.length > 0) {
    //           for (let index of matchingIndices) {
    //             if (fGroups[i].systemFlag[index].parentFlagValue == value) {
    //               fGroups[i].systemFlag[index].autoRender = 1;
    //               if (fGroups[i].systemFlag[index].valueTypeId === 7) {
    //                 fGroups[i].systemFlag[index].value = (fGroups[i].systemFlag[index].value === '1' || fGroups[i].systemFlag[index].value === true) ? true : false;
    //                 fGroups[i].systemFlag[index].value = !(
    //                   fGroups[i].systemFlag[index].value
    //                 );
    //               }
    //             } else {
    //               fGroups[i].systemFlag[index].autoRender = 0;
    //             }
    //           }
    //         }

    //       }
    //     }
    //   }
    // }

    setList(fGroups);

  };

  // const validateForm = () => {
  //   let flag = true;
  //   if (isPrePostFixError) {
  //     flag = false;
  //   }
  //   return flag
  // }

  const handleClick = async (e: any) => {
    debugger
    // var flag = validateForm();
    // if (flag) {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let nameList = new Array<string>();
    let valueList = new Array<string>();
    let autoRenderList = new Array<any>();
    for (let i = 0; i < list.length; i++) {
      if (list[i].systemFlag && list[i].systemFlag.length > 0) {
        for (let k = 0; k < list[i].systemFlag.length; k++) {
          if (list[i].systemFlag[k].valueTypeId == 10)
            list[i].systemFlag[k].value = Array.isArray(list[i].systemFlag[k].value) ? list[i].systemFlag[k].value.join(";") : list[i].systemFlag[k].value;

          nameList.push(list[i].systemFlag[k].name);
          valueList.push(list[i].systemFlag[k].value);
          autoRenderList.push(list[i].systemFlag[k].autoRender);
          localStorage.setItem('DateFormat', valueList[0]);
          if (list[i].systemFlag[k].name == 'isUserProfilePicApprove')
            localStorage.setItem('isUserProfilePicApprove', list[i].systemFlag[k].value);

          if (list[i].systemFlag[k].childSystemFlag && list[i].systemFlag[k].childSystemFlag.length > 0) {
            for (let l = 0; l < list[i].systemFlag[k].childSystemFlag.length; k++) {
              if (list[i].systemFlag[k].childSystemFlag[l].valueTypeId == 10)
                list[i].systemFlag[k].childSystemFlag[l].value = Array.isArray(list[i].systemFlag[k].value) ? list[i].systemFlag[k].childSystemFlag[l].value.join(";") : list[i].systemFlag[k].childSystemFlag[l].value;
              nameList.push(list[i].systemFlag[k].childSystemFlag[l].name);
              valueList.push(list[i].systemFlag[k].childSystemFlag[l].value);
              autoRenderList.push(list[i].systemFlag[k].childSystemFlag[l].autoRender);
              localStorage.setItem('DateFormat', valueList[0]);
              if (list[i].systemFlag[k].childSystemFlag[l].name == 'isUserProfilePicApprove')
                localStorage.setItem('isUserProfilePicApprove', list[i].systemFlag[k].childSystemFlag[l].value);
            }
          }

        }
      }
      if (list[i].group && list[i].group.length > 0) {
        for (let j = 0; j < list[i].group.length; j++) {
          if (
            list[i].group[j].systemFlag &&
            list[i].group[j].systemFlag.length > 0
          ) {
            for (let k = 0; k < list[i].group[j].systemFlag.length; k++) {
              if (list[i].group[j].systemFlag[k].valueTypeId == 10)
                list[i].group[j].systemFlag[k].value = Array.isArray(list[i].group[j].systemFlag[k].value) ? list[i].group[j].systemFlag[k].value.join(";") : list[i].group[j].systemFlag[k].value;

              if (list[i].group[j].systemFlag[k].valueTypeId === 7) {
                nameList.push(list[i].group[j].systemFlag[k].name);
                // list[i].group[j].systemFlag[k].value = !list[i].group[j].systemFlag[k].value
                valueList.push(list[i].group[j].systemFlag[k].value);
                autoRenderList.push(list[i].group[j].systemFlag[k].autoRender)
              } else {
                nameList.push(list[i].group[j].systemFlag[k].name);
                valueList.push(list[i].group[j].systemFlag[k].value);
                autoRenderList.push(list[i].group[j].systemFlag[k].autoRender);
              }
              if (list[i].group[j].systemFlag[k].childSystemFlag && list[i].group[j].systemFlag[k].childSystemFlag.length > 0) {
                for (let l = 0; l < list[i].group[j].systemFlag[k].childSystemFlag.length; l++) {
                  if (list[i].group[j].systemFlag[k].childSystemFlag[l].valueTypeId == 10)
                    list[i].group[j].systemFlag[k].childSystemFlag[l].value = Array.isArray(list[i].group[j].systemFlag[k].childSystemFlag[l].value) ? list[i].group[j].systemFlag[k].childSystemFlag[l].value.join(";") : list[i].group[j].systemFlag[k].childSystemFlag[l].value;

                  if (list[i].group[j].systemFlag[k].childSystemFlag[l].valueTypeId === 7) {
                    nameList.push(list[i].group[j].systemFlag[k].childSystemFlag[l].name);
                    // list[i].group[j].systemFlag[k].value = !list[i].group[j].systemFlag[k].value
                    valueList.push(list[i].group[j].systemFlag[k].childSystemFlag[l].value);
                    autoRenderList.push(list[i].group[j].systemFlag[k].childSystemFlag[l].autoRender)
                  } else {
                    nameList.push(list[i].group[j].systemFlag[k].childSystemFlag[l].name);
                    valueList.push(list[i].group[j].systemFlag[k].childSystemFlag[l].value);
                    autoRenderList.push(list[i].group[j].systemFlag[k].childSystemFlag[l].autoRender);
                  }
                }
              }
            }
          }
        }
      }
    }
    let obj = {
      nameList: nameList,
      valueList: valueList,
      autoRenderList: autoRenderList
    };
    let res = await APIservice.httpPost(
      '/api/admin/systemflags/updateSystemFlagByName',
      obj,
      token,
      refreshToken
    );
    getData();
    if (res && res.status == 200) {
      toast.success('Update Successfully', {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        position: toast.POSITION.TOP_RIGHT
      });
      getData();
    } else if (res.status == 401) {
      localStorage.clear();
      navigate('/admin');
    } else if (res.status == 400) {
      toast.error(res.message, {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        position: toast.POSITION.TOP_RIGHT
      });
    } else if (res.status == 500) {
      toast.error(res.message, {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        position: toast.POSITION.TOP_RIGHT
      });
    } else if (res.status == 300) {
      toast.error(res.message, {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        position: toast.POSITION.TOP_RIGHT
      });
    } else if (res.status == 404) {
      toast.error(res.message, {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        position: toast.POSITION.TOP_RIGHT
      });
    }
    // }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const onFileChange = (e: any, flagGroup: any, childGroup: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      //setImage(reader.result.toString());
      let fGroups = JSON.parse(JSON.stringify(list));
      if (flagGroup && flagGroup.id) {
        let ind = fGroups.findIndex((c) => c.id == flagGroup.id);
        if (ind >= 0) {
          if (childGroup && childGroup.id) {
            let cInd = fGroups[ind].group.findIndex((c) => c.id == childGroup.id);
            if (cInd >= 0) {
              let sInd = fGroups[ind].group[cInd].systemFlag.findIndex(
                (c) => c.id == parseInt(e.target.name)
              );
              if (sInd >= 0) {
                if (fGroups[ind].group[cInd].systemFlag[sInd].valueTypeId === 7) {
                  fGroups[ind].group[cInd].systemFlag[sInd].value = !parseInt(fGroups[ind].group[cInd].systemFlag[sInd].value);
                } else {
                  fGroups[ind].group[cInd].systemFlag[sInd].value = reader.result.toString();
                }
              }
            }
          } else {
            let sInd = fGroups[ind].systemFlag.findIndex(
              (c) => c.id == parseInt(e.target.name)
            );
            if (sInd >= 0) {
              fGroups[ind].systemFlag[sInd].value = reader.result.toString();
            }
          }
        }
      }
      setList(fGroups);

    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <ToastContainer
        style={{ top: '10%', left: '80%' }}
        autoClose={6000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Helmet>
        <title>Setting</title>
      </Helmet>
      <PageTitleWrapper>
        <Box py={1.9} pl={1}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Stack alignItems="left" justifyContent="space-between">
                <Breadcrumbs aria-label="breadcrumb">
                  <Link to="/admin" style={{ display: 'flex', color: 'black' }}>
                    <HomeIcon />
                  </Link>
                  <Typography
                    variant="subtitle2"
                    color="inherit"
                    fontWeight="bold"
                  >
                    Setting
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </PageTitleWrapper>
      <div>
        <div>
          <Container maxWidth="lg">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={3}
            >
              <Grid item xs={12}>
                <Card style={{marginBottom: '10px'}}>
                  <CardContent>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                      <TabContext value={value}>
                        <Box
                          sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            padding: '16px',
                            paddingLeft: '0px',
                            overflowX: 'auto'
                          }}
                        >
                          <TabList
                            onChange={handleChange}
                            variant="scrollable"
                            aria-label="lab API tabs example"
                          >
                            {list.map((resp: any, index: number) => (
                              <Tab
                                key={index}
                                label={resp.flagGroupName}
                                value={index + ''}
                              />
                            ))}
                          </TabList>
                        </Box>
                        <div>
                          {isLoading ? (
                            <Loader1 title="Loading..." />
                          ) : (
                            <>
                              <TableContainer>
                                {list.map((resp: any, index: number) => (
                                  <TabPanel
                                    key={index + ''}
                                    value={index + ''}
                                    className="p-0"
                                  >
                                    <div className="mt-3">
                                      {resp.systemFlag.map(
                                        (sysflag: any, sIndex: number) => (
                                          <div
                                            className="mb-3"
                                            key={sysflag.id}
                                          >
                                            {sysflag.autoRender == 1 && <>
                                              <label className="form-label text-capitalize">
                                                {sysflag.displayName}
                                              </label>
                                              {sysflag.description && (
                                                <Tooltip
                                                  title={sysflag.description}
                                                  arrow
                                                >
                                                  <InfoIcon sx={{ 'font-size': '16px!important' }} style={{ marginRight: '5px', marginLeft: '5px' }} />
                                                </Tooltip>
                                              )}
                                              {sysflag.valueTypeId == 1 && (
                                                <>
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    required
                                                    name={sysflag.id + ""}
                                                    onChange={(e) => handleflagChange(e, resp, null, null)}
                                                    value={sysflag.value}
                                                  />

                                                </>
                                              )}
                                              {sysflag.valueTypeId == 2 && (
                                                <input
                                                  type="number"
                                                  className="form-control"
                                                  required
                                                  name={sysflag.id + ""}
                                                  onChange={(e) => handleflagChange(e, resp, null, null)}
                                                  value={sysflag.value}
                                                />
                                              )}
                                              {sysflag.valueTypeId == 3 && (
                                                <Form.Select
                                                  name={sysflag.id + ""}
                                                  value={sysflag.value}
                                                  onChange={(e: any) => handleflagChange(e, resp, null, null)}
                                                >
                                                  {sysflag.valueList
                                                    .split(';')
                                                    .map((arr: any) => (
                                                      <option
                                                        key={arr}
                                                        value={arr}
                                                      >
                                                        {arr}
                                                      </option>
                                                    ))}
                                                </Form.Select>
                                              )}
                                              {sysflag.valueTypeId == 4 && (
                                                <ReactQuill
                                                  theme="snow"
                                                  value={sysflag.value}
                                                  onChange={(e) => { handleEditorChange(e, sysflag.id, resp, null, null) }}
                                                  modules={modules}
                                                />
                                              )}
                                              {sysflag.valueTypeId == 5 && (
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  required
                                                  name={sysflag.id + ""}
                                                  onChange={(e) => handleflagChange(e, resp, null, null)}
                                                  disabled={true}
                                                  value={sysflag.value}
                                                />
                                              )}
                                              {sysflag.valueTypeId == 6 && (
                                                <input
                                                  type="email"
                                                  className="form-control"
                                                  required
                                                  name={sysflag.id + ""}
                                                  onChange={(e) => handleflagChange(e, resp, null, null)}
                                                  value={sysflag.value}
                                                />
                                              )}
                                              {sysflag.valueTypeId == 7 && (
                                                <>
                                                  <Tooltip
                                                    title={(sysflag.value === '0' || !sysflag.value) ? 'Inactive' : 'Active'}
                                                    arrow
                                                  >
                                                    <>
                                                      <Switch
                                                        sx={{
                                                          '& .MuiSwitch-switchBase': {
                                                            '& .MuiSwitch-input': {
                                                              left: '0px',
                                                            },
                                                          },
                                                        }}
                                                        name={sysflag.id + ""}
                                                        value={sysflag.value}
                                                        checked={(sysflag.value === '1' || (sysflag.value ? (sysflag.value === '0' ? false : true) : false))}
                                                        onChange={(e: any) => handleflagChange(e, resp, null, null)}
                                                        inputProps={{
                                                          'aria-label':
                                                            'controlled'
                                                        }}
                                                      />
                                                      {sysflag.id == 41 ?
                                                        <span>(
                                                          <span style={{ fontSize: '11px', color: "#ff0000" }}> If the wallet feature is enabled, you can activate 'Reward and Earn' functionality. If the wallet is disabled, the 'Refer and Earn' feature will automatically be disabled as well.</span>
                                                          )
                                                        </span>
                                                        : ""}
                                                    </>
                                                  </Tooltip>
                                                </>
                                              )}
                                              {sysflag.valueTypeId == 8 && (
                                                <InputGroup>
                                                  <Form.Control
                                                    type={
                                                      showPassword === true
                                                        ? 'text'
                                                        : 'password'
                                                    }
                                                    className="form-control"
                                                    required
                                                    name={sysflag.id + ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleflagChange(e, resp, null, null)}
                                                    value={sysflag.value}
                                                  />
                                                  <InputGroup.Text
                                                    onClick={() =>
                                                      setShowPassword(
                                                        !showPassword
                                                      )
                                                    }
                                                  >
                                                    {showPassword === true ? (
                                                      <VisibilityIcon />
                                                    ) : (
                                                      <VisibilityOffIcon />
                                                    )}
                                                  </InputGroup.Text>
                                                </InputGroup>
                                              )}
                                              {sysflag.valueTypeId == 9 && (
                                                <FormGroup
                                                  style={{
                                                    alignItems: 'center',
                                                    marginBottom: '10px'
                                                  }}
                                                >
                                                  <input
                                                    style={{
                                                      display: 'none'
                                                    }}
                                                    id="icon-button-file"
                                                    type="file"
                                                    accept="image/*"
                                                    name={sysflag.id + ""}
                                                    // value = {userValue.image}
                                                    onChange={(e) => { onFileChange(e, resp, null); handleflagChange(e, resp, null, null) }}
                                                    className="upload-button"
                                                  />
                                                  <label htmlFor="icon-button-file">
                                                    {sysflag.value ? (
                                                      <img
                                                        src={sysflag.value}
                                                        alt="notification Url"
                                                        style={{
                                                          height: '130px',
                                                          width: 'auto'
                                                          // borderRadius: '50%',
                                                        }}
                                                      />
                                                    ) : (
                                                      <img
                                                        src="/dummy.png"
                                                        alt="notification Url"
                                                        style={{
                                                          height: '130px',
                                                          width: 'auto'
                                                          // borderRadius: '50%',
                                                        }}
                                                      />
                                                    )}
                                                  </label>
                                                </FormGroup>
                                              )}
                                              {sysflag.valueTypeId == 10 && (
                                                <>
                                                  <FormControl
                                                    sx={{ width: { lg: '100%' } }}
                                                  >
                                                    <Select
                                                      name={sysflag.id + ""}
                                                      id={sysflag.id + ""}
                                                      multiple
                                                      value={sysflag.value}
                                                      onChange={(e: any) => handleflagChange(e, resp, null, null)}
                                                      renderValue={(selected) => selected.join(', ')}
                                                      MenuProps={MenuProps}
                                                    >
                                                      {sysflag.valueList.split(';').map((name) => (
                                                        <MenuItem key={name} value={name}>
                                                          <Checkbox checked={sysflag.value.indexOf(name) > -1} />
                                                          <ListItemText primary={name} />
                                                        </MenuItem>
                                                      ))}
                                                    </Select></FormControl>
                                                  {/* // <Form.Select
                                              //   name={sysflag.id + ""}
                                              //   value={sysflag.value}
                                              //   onChange={(e: any) =>
                                              //     handleflagChange(
                                              //       e,
                                              //       resp,
                                              //       null
                                              //     )
                                              //   }
                                              // >
                                              //   {sysflag.valueList
                                              //     .split(';')
                                              //     .map((arr: any) => (
                                              //       <option
                                              //         key={arr}
                                              //         value={arr}
                                              //       >
                                              //         {arr}
                                              //       </option>
                                              //     ))}
                                              // </Form.Select> */}
                                                </>
                                              )}
                                            </>}

                                            <div className="mt-3">
                                              {sysflag.childSystemFlag && sysflag.childSystemFlag.map(
                                                (childsysflag: any, sIndex: number) => (
                                                  <div
                                                    className="mb-3"
                                                    key={childsysflag.id}
                                                    style={{ paddingLeft: '20px' }}
                                                  >
                                                    {childsysflag.autoRender == 1 && <>
                                                      <label className="form-label text-capitalize">
                                                        {childsysflag.displayName}
                                                      </label>
                                                      {childsysflag.description && (
                                                        <Tooltip
                                                          title={childsysflag.description}
                                                          arrow
                                                        >
                                                          <InfoIcon sx={{ 'font-size': '16px!important' }} style={{ marginRight: '5px', marginLeft: '5px' }} />
                                                        </Tooltip>
                                                      )}
                                                      {childsysflag.valueTypeId == 1 && (
                                                        <>
                                                          <input
                                                            type="text"
                                                            className="form-control"
                                                            required
                                                            name={childsysflag.id + ""}
                                                            onChange={(e) => handleflagChange(e, resp, null, sysflag)}
                                                            value={childsysflag.value}
                                                          />

                                                        </>
                                                      )}
                                                      {childsysflag.valueTypeId == 2 && (
                                                        <input
                                                          type="number"
                                                          className="form-control"
                                                          required
                                                          name={childsysflag.id + ""}
                                                          onChange={(e) => handleflagChange(e, resp, null, sysflag)}
                                                          value={childsysflag.value}
                                                        />
                                                      )}
                                                      {childsysflag.valueTypeId == 3 && (
                                                        <Form.Select
                                                          name={childsysflag.id + ""}
                                                          value={childsysflag.value}
                                                          onChange={(e: any) => handleflagChange(e, resp, null, sysflag)}
                                                        >
                                                          {childsysflag.valueList
                                                            .split(';')
                                                            .map((arr: any) => (
                                                              <option
                                                                key={arr}
                                                                value={arr}
                                                              >
                                                                {arr}
                                                              </option>
                                                            ))}
                                                        </Form.Select>
                                                      )}
                                                      {childsysflag.valueTypeId == 4 && (
                                                        <ReactQuill
                                                          theme="snow"
                                                          value={childsysflag.value}
                                                          onChange={(e) => { handleEditorChange(e, childsysflag.id, resp, null, sysflag) }}
                                                          modules={modules}
                                                        />
                                                      )}
                                                      {childsysflag.valueTypeId == 5 && (
                                                        <input
                                                          type="text"
                                                          className="form-control"
                                                          required
                                                          name={childsysflag.id + ""}
                                                          onChange={(e) => handleflagChange(e, resp, null, sysflag)}
                                                          disabled={true}
                                                          value={childsysflag.value}
                                                        />
                                                      )}
                                                      {childsysflag.valueTypeId == 6 && (
                                                        <input
                                                          type="email"
                                                          className="form-control"
                                                          required
                                                          name={childsysflag.id + ""}
                                                          onChange={(e) => handleflagChange(e, resp, null, sysflag)}
                                                          value={childsysflag.value}
                                                        />
                                                      )}
                                                      {childsysflag.valueTypeId == 7 && (
                                                        <>
                                                          <Tooltip
                                                            title={(childsysflag.value === '0' || !childsysflag.value) ? 'Inactive' : 'Active'}
                                                            arrow
                                                          >
                                                            <>
                                                              <Switch
                                                                sx={{
                                                                  '& .MuiSwitch-switchBase': {
                                                                    '& .MuiSwitch-input': {
                                                                      left: '0px',
                                                                    },
                                                                  },
                                                                }}
                                                                name={childsysflag.id + ""}
                                                                value={childsysflag.value}
                                                                checked={(childsysflag.value === '1' || (childsysflag.value ? (childsysflag.value === '0' ? false : true) : false))}
                                                                onChange={(e: any) => handleflagChange(e, resp, null, sysflag)}
                                                                inputProps={{
                                                                  'aria-label':
                                                                    'controlled'
                                                                }}
                                                              />
                                                              {childsysflag.id == 41 ?
                                                                <span>(
                                                                  <span style={{ fontSize: '11px', color: "#ff0000" }}> If the wallet feature is enabled, you can activate 'Reward and Earn' functionality. If the wallet is disabled, the 'Refer and Earn' feature will automatically be disabled as well.</span>
                                                                  )
                                                                </span>
                                                                : ""}
                                                            </>
                                                          </Tooltip>
                                                        </>
                                                      )}
                                                      {childsysflag.valueTypeId == 8 && (
                                                        <InputGroup>
                                                          <Form.Control
                                                            type={
                                                              showPassword === true
                                                                ? 'text'
                                                                : 'password'
                                                            }
                                                            className="form-control"
                                                            required
                                                            name={childsysflag.id + ""}
                                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleflagChange(e, resp, null, sysflag)}
                                                            value={childsysflag.value}
                                                          />
                                                          <InputGroup.Text
                                                            onClick={() =>
                                                              setShowPassword(
                                                                !showPassword
                                                              )
                                                            }
                                                          >
                                                            {showPassword === true ? (
                                                              <VisibilityIcon />
                                                            ) : (
                                                              <VisibilityOffIcon />
                                                            )}
                                                          </InputGroup.Text>
                                                        </InputGroup>
                                                      )}
                                                      {childsysflag.valueTypeId == 9 && (
                                                        <FormGroup
                                                          style={{
                                                            alignItems: 'center',
                                                            marginBottom: '10px'
                                                          }}
                                                        >
                                                          <input
                                                            style={{
                                                              display: 'none'
                                                            }}
                                                            id="icon-button-file"
                                                            type="file"
                                                            accept="image/*"
                                                            name={childsysflag.id + ""}
                                                            // value = {userValue.image}
                                                            onChange={(e) => { onFileChange(e, resp, null); handleflagChange(e, resp, null, sysflag) }}
                                                            className="upload-button"
                                                          />
                                                          <label htmlFor="icon-button-file">
                                                            {childsysflag.value ? (
                                                              <img
                                                                src={childsysflag.value}
                                                                alt="notification Url"
                                                                style={{
                                                                  height: '130px',
                                                                  width: 'auto'
                                                                  // borderRadius: '50%',
                                                                }}
                                                              />
                                                            ) : (
                                                              <img
                                                                src="/dummy.png"
                                                                alt="notification Url"
                                                                style={{
                                                                  height: '130px',
                                                                  width: 'auto'
                                                                  // borderRadius: '50%',
                                                                }}
                                                              />
                                                            )}
                                                          </label>
                                                        </FormGroup>
                                                      )}
                                                      {childsysflag.valueTypeId == 10 && (
                                                        <>
                                                          <FormControl
                                                            sx={{ width: { lg: '100%' } }}
                                                          >
                                                            <Select
                                                              name={childsysflag.id + ""}
                                                              id={childsysflag.id + ""}
                                                              multiple
                                                              value={childsysflag.value}
                                                              onChange={(e: any) => handleflagChange(e, resp, null, sysflag)}
                                                              renderValue={(selected) => selected.join(', ')}
                                                              MenuProps={MenuProps}
                                                            >
                                                              {childsysflag.valueList.split(';').map((name) => (
                                                                <MenuItem key={name} value={name}>
                                                                  <Checkbox checked={childsysflag.value.indexOf(name) > -1} />
                                                                  <ListItemText primary={name} />
                                                                </MenuItem>
                                                              ))}
                                                            </Select></FormControl>

                                                        </>
                                                      )}
                                                    </>}
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                    {
                                      resp.group &&
                                      resp.group.length > 0 &&
                                      resp.group.map(
                                        (group: any, gIndex: number) =>
                                          group.systemFlag.length > 0 && (
                                            <div key={group.id}>
                                              <div className="mt-3">
                                                <label className="form-label text-capitalize">
                                                  <b>{group.flagGroupName}</b>
                                                </label>
                                                {group.detail && (
                                                  <Tooltip
                                                    title={group.detail}
                                                    arrow
                                                  >
                                                    <InfoIcon sx={{ 'font-size': '16px!important' }} style={{ marginRight: '5px', marginLeft: '5px' }} />
                                                  </Tooltip>
                                                )}
                                              </div>
                                              <div
                                                style={{
                                                  border: '1px solid #ddd',
                                                  padding: '15px',
                                                  borderRadius: '5px'
                                                }}
                                              >
                                                {group.systemFlag.map(
                                                  (
                                                    sysflag: any,
                                                    sIndex: number
                                                  ) => (
                                                    <div
                                                      className="mb-3"
                                                      key={sysflag.id}
                                                    >
                                                      {sysflag.autoRender == 1 && <>
                                                        <label className="form-label text-capitalize">
                                                          {sysflag.displayName}
                                                        </label>
                                                        {sysflag.description && (
                                                          <Tooltip
                                                            title={sysflag.description}
                                                            arrow
                                                          >
                                                            <InfoIcon sx={{ 'font-size': '16px!important' }} style={{ marginRight: '5px', marginLeft: '5px' }} />
                                                          </Tooltip>
                                                        )}
                                                        {sysflag.valueTypeId == 1 && (
                                                          <input
                                                            type="text"
                                                            className="form-control"
                                                            required
                                                            name={sysflag.id + ""}
                                                            onChange={(e) => handleflagChange(e, resp, group, null)}
                                                            value={sysflag.value}
                                                          />
                                                        )}
                                                        {sysflag.valueTypeId == 2 && (
                                                          <input
                                                            type="number"
                                                            className="form-control"
                                                            required
                                                            name={sysflag.id + ""}
                                                            onChange={(e) => handleflagChange(e, resp, group, null)}
                                                            value={sysflag.value}
                                                          />
                                                        )}
                                                        {sysflag.valueTypeId == 3 && (
                                                          <Form.Select
                                                            name={sysflag.id + ""}
                                                            value={sysflag.value}
                                                            onChange={(e: any) => handleflagChange(e, resp, group, null)}
                                                          >
                                                            {sysflag.valueList
                                                              .split(';')
                                                              .map((arr: any) => (
                                                                <option
                                                                  key={arr}
                                                                  value={arr}
                                                                >
                                                                  {arr}
                                                                </option>
                                                              ))}
                                                          </Form.Select>
                                                        )}
                                                        {sysflag.valueTypeId == 4 && (
                                                          <ReactQuill
                                                            theme="snow"
                                                            value={sysflag.value}
                                                            onChange={(e) => { handleEditorChange(e, sysflag.id, resp, group, null) }}
                                                            modules={modules}
                                                          />
                                                        )}
                                                        {sysflag.valueTypeId == 5 && (
                                                          <input
                                                            type="text"
                                                            className="form-control"
                                                            required
                                                            name={sysflag.id + ""}
                                                            onChange={(e) => handleflagChange(e, resp, group, null)}
                                                            value={sysflag.value}
                                                            disabled
                                                          />
                                                        )}
                                                        {sysflag.valueTypeId == 6 && (
                                                          <input
                                                            type="email"
                                                            className="form-control"
                                                            required
                                                            name={sysflag.id + ""}
                                                            onChange={(e) => handleflagChange(e, resp, group, null)}
                                                            value={sysflag.value}
                                                          />
                                                        )}
                                                        {sysflag.valueTypeId == 7 && (
                                                          <>
                                                            {/* {sysflag.value === '1' ? ( */}
                                                            <Tooltip
                                                              title={(sysflag.value === '0' || !sysflag.value) ? 'Inactive' : 'Active'}
                                                              arrow
                                                            >
                                                              <Switch
                                                                name={sysflag.id + ""}
                                                                value={sysflag.value}
                                                                checked={(sysflag.value === '1' || (sysflag.value ? (sysflag.value === '0' ? false : true) : false))}
                                                                onChange={(e: any) => handleflagChange(e, resp, group, null)}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                              />
                                                            </Tooltip>
                                                            {/* ) : (
                                                            <Tooltip
                                                              title={sysflag.value === '0' ? 'Inactive' : 'Active'}
                                                              arrow
                                                            >
                                                              <Switch
                                                                name={sysflag.id + ""}
                                                                value={sysflag.value}
                                                                // checked={sysflag.value}
                                                                onChange={(e: any) => handleflagChange(e, resp, group)}
                                                                inputProps={{
                                                                  'aria-label': 'controlled'
                                                                }}
                                                              />
                                                            </Tooltip>
                                                          )} */}
                                                          </>
                                                        )}
                                                        {sysflag.valueTypeId == 8 && (
                                                          <>
                                                            <InputGroup>
                                                              <Form.Control
                                                                type={showPassword === true ? 'text' : 'password'}
                                                                className="form-control"
                                                                required
                                                                name={sysflag.id + ""}
                                                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleflagChange(e, resp, group, null)}
                                                                value={sysflag.value}
                                                              />
                                                              <InputGroup.Text
                                                                onClick={() => setShowPassword(!showPassword)}
                                                              >
                                                                {showPassword === true ? (<VisibilityIcon />) : (<VisibilityOffIcon />)}
                                                              </InputGroup.Text>
                                                            </InputGroup>
                                                          </>
                                                        )}

                                                        {sysflag.valueTypeId == 9 && (
                                                          <FormGroup
                                                            style={{
                                                              alignItems: 'center',
                                                              marginBottom: '10px'
                                                            }}
                                                          >
                                                            <input
                                                              style={{ display: 'none' }}
                                                              id="icon-button-file"
                                                              type="file"
                                                              accept="image/*"
                                                              name={sysflag.id + ""}
                                                              // value = {userValue.image}
                                                              onChange={(e) => { onFileChange(e, resp, group); handleflagChange(e, resp, group, null) }}
                                                              className="upload-button"
                                                            />
                                                            <label htmlFor="icon-button-file">
                                                              {sysflag.value ? (
                                                                <img
                                                                  src={sysflag.value}
                                                                  alt="notification Url"
                                                                  style={{ height: '130px', width: 'auto' }}
                                                                />
                                                              ) : (
                                                                <img
                                                                  src="/dummy.png"
                                                                  alt="notification Url"
                                                                  style={{ height: '130px', width: 'auto' }}
                                                                />
                                                              )}
                                                            </label>
                                                          </FormGroup>
                                                        )}
                                                        {sysflag.valueTypeId == 10 && (
                                                          <>
                                                            <FormControl
                                                              sx={{ width: { lg: '100%' } }}
                                                            >
                                                              <Select
                                                                id={sysflag.id + ""}
                                                                name={sysflag.id + ""}
                                                                multiple
                                                                value={sysflag.value}
                                                                onChange={(e: any) => handleflagChange(e, resp, group, null)}
                                                                renderValue={(selected) => selected.join(', ')}
                                                                MenuProps={MenuProps}
                                                              >
                                                                {sysflag.valueList.split(';').map((name) => (
                                                                  <MenuItem key={name} value={name}>
                                                                    <Checkbox checked={sysflag.value.indexOf(name) > -1} />
                                                                    <ListItemText primary={name} />
                                                                  </MenuItem>
                                                                ))}
                                                              </Select>
                                                            </FormControl>
                                                            {/* <Form.Select
                                                            name={sysflag.id + ""}
                                                            value={sysflag.value}
                                                            onChange={(e: any) =>
                                                              handleflagChange(
                                                                e,
                                                                resp,
                                                                group
                                                              )
                                                            }
                                                          >
                                                            {sysflag.valueList
                                                              .split(';')
                                                              .map((arr: any) => (
                                                                <option
                                                                  key={arr}
                                                                  value={arr}
                                                                >
                                                                  {arr}
                                                                </option>
                                                              ))}
                                                          </Form.Select> */}
                                                          </>
                                                        )}
                                                      </>}

                                                      <div className="mt-3">
                                                        {sysflag.childSystemFlag && sysflag.childSystemFlag.map(
                                                          (childsysflag: any, sIndex: number) => (
                                                            <div
                                                              className="mb-3"
                                                              key={childsysflag.id}
                                                              style={{ paddingLeft: '20px' }}
                                                            >
                                                              {childsysflag.autoRender == 1 && <>
                                                                <label className="form-label text-capitalize">
                                                                  {childsysflag.displayName}
                                                                </label>
                                                                {childsysflag.description && (
                                                                  <Tooltip
                                                                    title={childsysflag.description}
                                                                    arrow
                                                                  >
                                                                    <InfoIcon sx={{ 'font-size': '16px!important' }} style={{ marginRight: '5px', marginLeft: '5px' }} />
                                                                  </Tooltip>
                                                                )}
                                                                {childsysflag.valueTypeId == 1 && (
                                                                  <>
                                                                    <input
                                                                      type="text"
                                                                      className="form-control"
                                                                      required
                                                                      name={childsysflag.id + ""}
                                                                      onChange={(e) => handleflagChange(e, resp, group, sysflag)}
                                                                      value={childsysflag.value}
                                                                    />

                                                                  </>
                                                                )}
                                                                {childsysflag.valueTypeId == 2 && (
                                                                  <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    required
                                                                    name={childsysflag.id + ""}
                                                                    onChange={(e) => handleflagChange(e, resp, group, sysflag)}
                                                                    value={childsysflag.value}
                                                                  />
                                                                )}
                                                                {childsysflag.valueTypeId == 3 && (
                                                                  <Form.Select
                                                                    name={childsysflag.id + ""}
                                                                    value={childsysflag.value}
                                                                    onChange={(e: any) => handleflagChange(e, resp, group, sysflag)}
                                                                  >
                                                                    {childsysflag.valueList
                                                                      .split(';')
                                                                      .map((arr: any) => (
                                                                        <option
                                                                          key={arr}
                                                                          value={arr}
                                                                        >
                                                                          {arr}
                                                                        </option>
                                                                      ))}
                                                                  </Form.Select>
                                                                )}
                                                                {childsysflag.valueTypeId == 4 && (
                                                                  <ReactQuill
                                                                    theme="snow"
                                                                    value={childsysflag.value}
                                                                    onChange={(e) => { handleEditorChange(e, childsysflag.id, resp, group, sysflag) }}
                                                                    modules={modules}
                                                                  />
                                                                )}
                                                                {childsysflag.valueTypeId == 5 && (
                                                                  <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    required
                                                                    name={childsysflag.id + ""}
                                                                    onChange={(e) => handleflagChange(e, resp, group, sysflag)}
                                                                    disabled={true}
                                                                    value={childsysflag.value}
                                                                  />
                                                                )}
                                                                {childsysflag.valueTypeId == 6 && (
                                                                  <input
                                                                    type="email"
                                                                    className="form-control"
                                                                    required
                                                                    name={childsysflag.id + ""}
                                                                    onChange={(e) => handleflagChange(e, resp, group, sysflag)}
                                                                    value={childsysflag.value}
                                                                  />
                                                                )}
                                                                {childsysflag.valueTypeId == 7 && (
                                                                  <>
                                                                    <Tooltip
                                                                      title={(childsysflag.value === '0' || !childsysflag.value) ? 'Inactive' : 'Active'}
                                                                      arrow
                                                                    >
                                                                      <>
                                                                        <Switch
                                                                          sx={{
                                                                            '& .MuiSwitch-switchBase': {
                                                                              '& .MuiSwitch-input': {
                                                                                left: '0px',
                                                                              },
                                                                            },
                                                                          }}
                                                                          name={childsysflag.id + ""}
                                                                          value={childsysflag.value}
                                                                          checked={(childsysflag.value === '1' || (childsysflag.value ? (childsysflag.value === '0' ? false : true) : false))}
                                                                          onChange={(e: any) => handleflagChange(e, resp, group, sysflag)}
                                                                          inputProps={{
                                                                            'aria-label':
                                                                              'controlled'
                                                                          }}
                                                                        />
                                                                        {childsysflag.id == 41 ?
                                                                          <span>(
                                                                            <span style={{ fontSize: '11px', color: "#ff0000" }}> If the wallet feature is enabled, you can activate 'Reward and Earn' functionality. If the wallet is disabled, the 'Refer and Earn' feature will automatically be disabled as well.</span>
                                                                            )
                                                                          </span>
                                                                          : ""}
                                                                      </>
                                                                    </Tooltip>
                                                                  </>
                                                                )}
                                                                {childsysflag.valueTypeId == 8 && (
                                                                  <InputGroup>
                                                                    <Form.Control
                                                                      type={
                                                                        showPassword === true
                                                                          ? 'text'
                                                                          : 'password'
                                                                      }
                                                                      className="form-control"
                                                                      required
                                                                      name={childsysflag.id + ""}
                                                                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleflagChange(e, resp, group, sysflag)}
                                                                      value={childsysflag.value}
                                                                    />
                                                                    <InputGroup.Text
                                                                      onClick={() =>
                                                                        setShowPassword(
                                                                          !showPassword
                                                                        )
                                                                      }
                                                                    >
                                                                      {showPassword === true ? (
                                                                        <VisibilityIcon />
                                                                      ) : (
                                                                        <VisibilityOffIcon />
                                                                      )}
                                                                    </InputGroup.Text>
                                                                  </InputGroup>
                                                                )}
                                                                {childsysflag.valueTypeId == 9 && (
                                                                  <FormGroup
                                                                    style={{
                                                                      alignItems: 'center',
                                                                      marginBottom: '10px'
                                                                    }}
                                                                  >
                                                                    <input
                                                                      style={{
                                                                        display: 'none'
                                                                      }}
                                                                      id="icon-button-file"
                                                                      type="file"
                                                                      accept="image/*"
                                                                      name={childsysflag.id + ""}
                                                                      // value = {userValue.image}
                                                                      onChange={(e) => { onFileChange(e, resp, null); handleflagChange(e, resp, group, sysflag) }}
                                                                      className="upload-button"
                                                                    />
                                                                    <label htmlFor="icon-button-file">
                                                                      {childsysflag.value ? (
                                                                        <img
                                                                          src={childsysflag.value}
                                                                          alt="notification Url"
                                                                          style={{
                                                                            height: '130px',
                                                                            width: 'auto'
                                                                            // borderRadius: '50%',
                                                                          }}
                                                                        />
                                                                      ) : (
                                                                        <img
                                                                          src="/dummy.png"
                                                                          alt="notification Url"
                                                                          style={{
                                                                            height: '130px',
                                                                            width: 'auto'
                                                                            // borderRadius: '50%',
                                                                          }}
                                                                        />
                                                                      )}
                                                                    </label>
                                                                  </FormGroup>
                                                                )}
                                                                {childsysflag.valueTypeId == 10 && (
                                                                  <>
                                                                    <FormControl
                                                                      sx={{ width: { lg: '100%' } }}
                                                                    >
                                                                      <Select
                                                                        name={childsysflag.id + ""}
                                                                        id={childsysflag.id + ""}
                                                                        multiple
                                                                        value={childsysflag.value}
                                                                        onChange={(e: any) => handleflagChange(e, resp, group, sysflag)}
                                                                        renderValue={(selected) => selected.join(', ')}
                                                                        MenuProps={MenuProps}
                                                                      >
                                                                        {childsysflag.valueList.split(';').map((name) => (
                                                                          <MenuItem key={name} value={name}>
                                                                            <Checkbox checked={childsysflag.value.indexOf(name) > -1} />
                                                                            <ListItemText primary={name} />
                                                                          </MenuItem>
                                                                        ))}
                                                                      </Select></FormControl>

                                                                  </>
                                                                )}
                                                              </>}
                                                            </div>
                                                          )
                                                        )}
                                                      </div>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )
                                      )
                                    }
                                  </TabPanel>
                                ))}
                              </TableContainer>
                            </>
                          )}
                        </div>
                      </TabContext>
                    </Box>
                    {isEditPermission ?
                      <Button
                        className="mt-3"
                        sx={{ mt: { xs: 2, md: 0 } }}
                        variant="contained"
                        disabled={credentail?.email === "demo@admin.com"}
                        onClick={handleClick}
                      >
                        Save
                      </Button>
                      : <></>}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </div>
      </div >
    </>
  );
};

export default Setting;

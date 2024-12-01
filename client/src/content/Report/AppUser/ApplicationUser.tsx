import {
  Autocomplete,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Divider,
  Drawer,
  FormControl,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from '../../../components/PageTitleWrapper';
import HomeIcon from '@mui/icons-material/Home';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
// import FileOpenIcon from '@mui/icons-material/FileOpen';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import PrintIcon from '@mui/icons-material/Print';
import Footer from 'src/components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, ChangeEvent } from 'react';
import Loader from 'src/content/Loader';
import APIservice from 'src/utils/APIservice';
import { CSVLink } from 'react-csv';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../smallScreen.css';

const initialState = {
  id: '',
  image: '',
  name: '',
  contactNo: '',
  email: '',
  gender: '',
  cityId: '',
  stateId: '',
  maritalStatusId: '',
  religionId: '',
  communityId: '',
  occupationId: '',
  educationId: '',
  subCommunityId: '',
  incomeId: '',
  dietId: '',
  heightId: ''
};

const ApplicationUser = () => {
  let [user, setUser] = useState(initialState);
  const [cityId, setCityId] = useState<any>([]);
  const [stateId, setStateId] = useState<any>([]);
  const [occupation, setOccupation] = useState<any>([]);
  const [religion, setReligion] = useState<any>([]);
  const [maritalStatus, setMaritalStatus] = useState<any>([]);
  const [community, setCommunity] = useState<any>([]);
  const [subCommunity, setSubCommunity] = useState<any>([]);
  const [height, setHeight] = useState<any>([]);
  const [diet, setDiet] = useState<any>([]);
  const [education, setEducation] = useState<any>([]);
  const [income, setIncome] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [sidebarToggle, setSidebarToggle] = useState('');
  const [isloading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [data1, setData1] = useState<any>([]);
  const [masterEntry, setMasterEntry] = useState<any>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [row, setRow] = useState<number>(10);
  let [selected, setSelected] = useState<any>('');
  let [selected1, setSelected1] = useState<any>('');
  const [error, setError] = useState<any>('');

  const navigate = useNavigate();

  const toggleSlider = () => {
    setOpen(!open);
  };

  useEffect(() => {
    getdata(page, limit);
    getMasterEntry();
  }, []);

  const getdata = async (startIndex: number, fetchRecord: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        startIndex: startIndex,
        fetchRecord: fetchRecord,
        id: user.id,
        image: user.image,
        name: user.name,
        contactNo: user.contactNo,
        email: user.email,
        gender: user.gender,
        cityName: user.cityId,
        stateName: user.stateId,
        maritalStatusId: user.maritalStatusId,
        religionId: user.religionId,
        communityId: user.communityId,
        occupationId: user.occupationId,
        educationId: user.educationId,
        subCommunityId: user.subCommunityId,
        incomeId: user.incomeId,
        dietId: user.dietId,
        heightId: user.heightId
      };
      const res = await APIservice.httpPost(
        '/api/admin/report/getApplicationUserReport',
        obj,
        token,
        refreshToken
      );
      setData(res.recordList);
      setRow(res.totalRecords);
      if (res && res.status == 200) {
      } else if (res.status == 401) {
        navigate('/admin');
        localStorage.clear();
      } else if (res.status == 400) {
        setOpen(false);
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
        setOpen(false);
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
        setOpen(false);
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
        setOpen(false);
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
      setIsLoading(false);
      setOpen(false);
    } catch (error) {
      setIsLoading(false);
      setOpen(false);
      toast.error(error, {
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
  };

  const getState = async (state: any) => {
    try {
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        stateName: state
      };
      const res = await APIservice.httpPost(
        '/api/admin/states/getStates',
        obj,
        token,
        refreshToken
      );
      if (res && res.status == 200) {
        setStateId(res.recordList);
        setError('');
      } else if (res.status == 401) {
        navigate('/admin');
        localStorage.clear();
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
    } catch (error) {
      toast.error(error, {
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
  };

  const handleChangeState = (e: any) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
    getCity(value);
  };

  const getCity = async (city: string) => {
    try {
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        cityName: city
      };
      const res = await APIservice.httpPost(
        '/api/admin/cities/getCitiesData',
        obj,
        token,
        refreshToken
      );
      if (res && res.status == 200) {
        setCityId(res.recordList);
      } else if (res.status == 401) {
        navigate('/admin');
        localStorage.clear();
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
    } catch (error) {
      toast.error(error, {
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
  };

  const getMasterEntry = async () => {
    try {
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      const res = await APIservice.httpPost(
        '/api/admin/report/getMasterEntryData',
        '',
        token,
        refreshToken
      );
      setMasterEntry(res.recordList);
      setReligion(res.recordList[0].religion);
      setIncome(res.recordList[0].annualIncome);
      setCommunity(res.recordList[0].community);
      setDiet(res.recordList[0].diet);
      setEducation(res.recordList[0].education);
      setHeight(res.recordList[0].height);
      setMaritalStatus(res.recordList[0].maritalStatus);
      setOccupation(res.recordList[0].occupation);
      setSubCommunity(res.recordList[0].subCommunity);
      if (res && res.status == 200) {
      } else if (res.status == 401) {
        navigate('/admin');
        localStorage.clear();
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
    } catch (error) {
      toast.error(error, {
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
  };

  const handleChange = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleChange1 = (e: any, v: any) => {
    setSelected(v);
    user.cityId = v;
    getCity(v);
    // getdata(0, limit)
  };

  const handleChange2 = (e: any, v: any) => {
    setSelected1(v);
    user.stateId = v;
    getState(v);
    // getdata(0, limit)
  };

  const handleClear = (e: any) => {
    user.cityId = '';
    user.stateId = '';
    setUser(initialState);
    user = initialState;
    setOpen(false);
    getdata(0, limit);
  };

  const handlesubmit = () => {
    getdata(page, limit);
    setOpen(false);
  };

  const DataSend = () => {
    const user = data.map((arr: any, index: number) => {
      const dataDetail = {
        Id: index + 1,
        Name: arr.firstName,
        ContactNo: arr.contactNo,
        Email: arr.email,
        Gender: arr.gender,
        City: arr.cityName,
        State: arr.stateName,
        'Marital Status': arr.maritalstatus,
        Religion: arr.religion,
        Community: arr.community,
        Occupation: arr.occupation,
        Education: arr.education,
        'Sub Community': arr.subCommunity,
        Income: arr.annualIncome,
        Diet: arr.diet,
        Height: arr.height
      };
      return dataDetail;
    });
    setData1(user);
  };

  const handlePrint = async () => {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let obj = {
      id: user.id,
      image: user.image,
      name: user.name,
      contactNo: user.contactNo,
      email: user.email,
      gender: user.gender,
      cityName: user.cityId,
      stateName: user.stateId,
      maritalStatusId: user.maritalStatusId,
      religionId: user.religionId,
      communityId: user.communityId,
      occupationId: user.occupationId,
      educationId: user.educationId,
      subCommunityId: user.subCommunityId,
      incomeId: user.incomeId,
      dietId: user.dietId,
      heightId: user.heightId
    };
    const res = await APIservice.httpPost(
      '/api/admin/report/getApplicationUserReport',
      obj,
      token,
      refreshToken
    );
    if (res && res.status == 200) {
    } else if (res.status == 401) {
      navigate('/admin');
      localStorage.clear();
    }
    // if (res && res.length > 0) {
    let html = `<html>
        <div>
            <div class="img-container">
            <img src="/Image20221010173301.png" alt="logo" height="30px"/>
            <span>Application User</span>
        </div>
        <div class="date-container">
        <div>`;
    html +=
      `<p>` +
      (user.name ? `Name - ` + user.name : ` `) +
      ` &nbsp</p>
        </div>
       <div>`;
    html +=
      ` <p>` +
      (user.gender ? `Gender - ` + user.gender : ` `) +
      `&nbsp</p>
         </div>
          <div>`;
    html +=
      ` <p>` +
      (user.stateId ? `State - ` + res.recordList[0].stateName : ` `) +
      `&nbsp</p>
          </div>
         <div>`;
    html +=
      ` <p>` +
      (user.cityId ? `City - ` + res.recordList[0].cityName : ` `) +
      `&nbsp</p>
          </div>
         <div>`;
    html +=
      ` <p>` +
      (user.maritalStatusId
        ? `Marital Status - ` + res.recordList[0].maritalStatus
        : ` `) +
      `&nbsp</p>
          </div>
          <div>`;
    html +=
      ` <p>` +
      (user.religionId ? `Religion - ` + res.recordList[0].religion : ` `) +
      `&nbsp</p>
         </div>
        <div>`;
    html +=
      ` <p>` +
      (user.communityId ? `Community - ` + res.recordList[0].community : ` `) +
      `&nbsp</p>
         
            </div>
         <div>`;
    html +=
      `<p>` +
      (user.subCommunityId
        ? `Subcommunity - ` + res.recordList[0].subCommunity
        : ` `) +
      `&nbsp</p>
            </div>
         <div>`;
    html +=
      ` <p>` +
      (user.occupationId
        ? `Occupation - ` + res.recordList[0].occupation
        : ` `) +
      `&nbsp</p>
            </div>
         <div>`;
    html +=
      ` <p>` +
      (user.educationId ? `Education - ` + res.recordList[0].education : ` `) +
      `&nbsp</p>
            </div> 
       <div>`;
    html +=
      ` <p>` +
      (user.dietId ? `Diet - ` + res.recordList[0].diet : ` `) +
      `&nbsp</p>
            </div> 
          <div>`;
    html +=
      ` <p>` +
      (user.incomeId ? `Income - ` + res.recordList[0].income : ` `) +
      `&nbsp</p>
         </div>
         <div>`;
    html +=
      `<p>` +
      (user.heightId ? `Height - ` + res.recordList[0].height : ` `) +
      `&nbsp</p>
        </div>
              </div>
          <body  onload="window.print(); window.close();">
          <style>

          @media print {
            table {
            }
        }

          @page { 
            size: landscape;
          }
          table 
          {
              page-break-after: always;
          }

          .img-container {
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-Bottom: 20px;
          }

          span{
            font-size: 30px;
            padding-Left: 5px;
          }
          .date-container {
            text-align: right;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          table {
             border-collapse: collapse;
            border: 1px solid black;
            width: 100%;
          }

          .th1 {
            border-top: 0px;
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }


          .th2 {
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .th3 {
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .th4 {
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .th5 {
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .th6 {
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .th7 {
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .th8 {
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .th9 {
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .th10 {
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .th11 {
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .th12 {
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .th13 {
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .th14 {
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .th15 {
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .th16 {
            border-bottom: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .td1 {
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }

          .td2 {
            border-right: 1px solid black;
            text-align: left;
            padding: 8px;
          }
          .td3 {
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }
          .td4 {
            border-right: 1px solid black;
            text-align: left;
            padding: 8px;
          }
          .td5 {
            border-right: 1px solid black;
            text-align: center;
            padding: 8px;
          }
          .td6 {
            border-right: 1px solid black;
            text-align: left;
            padding: 8px;
          }
          .td7 {
            border-right: 1px solid black;
            text-align: left;
            padding: 8px;
          }
          .td8 {
            border-right: 1px solid black;
            text-align: left;
            padding: 8px;
          }
          .td9 {
            border-right: 1px solid black;
            text-align: left;
            padding: 8px;
          }
          .td10 {
            border-right: 1px solid black;
            text-align: left;
            padding: 8px;
          }
          .td11 {
            border-right: 1px solid black;
            text-align: left;
            padding: 8px;
          }
          .td12 {
            border-right: 1px solid black;
            text-align: left;
            padding: 8px;
          }
          .td13 {
            border-right: 1px solid black;
            text-align: left;
            padding: 8px;
          }
          .td14 {
            border-right: 1px solid black;
            text-align: right;
            padding: 8px;
          }
          .td15 {
            border-right: 1px solid black;
            text-align: left;
            padding: 8px;
          }

          .td16 {
              text-align: center;
              padding: 8px;
            }

            tr:nth-child(even) {
                background-color: #f2f2f2;
            }
            </style>
            <table>
            <Divider/>
        <thead>
        <th class="th1">#</th>
        <th class="th2">Name</th>
        <th class="th3">Contact</th>
        <th class="th4">Email</th>
        <th class="th5">Gender</th>
        <th class="th6">City</th>
        <th class="th7">State</th>
        <th class="th8">Martial Status</th>
        <th class="th9">Religion</th>
        <th class="th10">Community</th>
        <th class="th11">Occupation</th>
        <th class="th12">education</th>
        <th class="th13">Sub Community</th>
        <th class="th14">Income</th>
        <th class="th15">Diet</th>
        <th class="th16">Height</th>
        </thead>
        <tbody>`;
    for (let i = 0; i < res.recordList.length; i++) {
      html +=
        `<tr>
             <td class="td1">` +
        (i + 1) +
        `</td>
             <td class="td2">` +
        res.recordList[i].firstName +
        ' ' +
        res.recordList[i].lastName +
        ` </td>
             <td class="td3">` +
        res.recordList[i].contactNo +
        ` </td>
             <td class="td4">` +
        res.recordList[i].email +
        ` </td>
             <td class="td5">` +
        res.recordList[i].gender +
        ` </td>
             <td class="td6">` +
        res.recordList[i].cityName +
        ` </td>
             <td class="td7">` +
        res.recordList[i].state +
        ` </td>
             <td class="td8">` +
        res.recordList[i].maritalStatus +
        ` </td>
             <td class="td9">` +
        res.recordList[i].religion +
        ` </td>
             <td class="td10">` +
        res.recordList[i].community +
        ` </td>
             <td class="td11">` +
        res.recordList[i].occupation +
        ` </td>
             <td class="td12">` +
        res.recordList[i].education +
        ` </td>
             <td class="td13">` +
        res.recordList[i].subCommunity +
        ` </td>
             <td class="td14">` +
        res.recordList[i].annualIncome +
        ` </td>
             <td class="td15">` +
        res.recordList[i].diet +
        ` </td>
             <td class="td16">` +
        res.recordList[i].height +
        ` </td>
             </tr>`;
    }
    html += `</tbody>
          </table>
         </body>
        </html >`;
    let frame1 = document.createElement('iframe');
    frame1.name = 'frame1';
    frame1.style.position = 'absolute';
    frame1.style.top = '-1000000px';
    document.body.appendChild(frame1);
    frame1.contentWindow.document.open();
    frame1.contentWindow.document.write(html);
    frame1.contentWindow.document.close();
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
    getdata(newPage * limit, limit);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
    setPage(0);
    getdata(0, parseInt(event.target.value));
  };

  const theme = useTheme();

  return (
    // eslint-disable-next-line
    <div>
      <ToastContainer
        style={{ top: '8.5%', right: '0%' }}
        // position="top-right"
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
        <title>Application User</title>
      </Helmet>
      <PageTitleWrapper>
        <Box pt={1.3} pb={1.2} pl={1}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <Stack alignItems="left" justifyContent="space-between">
                <Breadcrumbs aria-label="breadcrumb">
                  <Link to="/admin" style={{ display: 'flex', color: 'black' }}>
                    <HomeIcon />
                  </Link>
                  <Typography
                    color="inherit"
                    variant="subtitle2"
                    fontWeight="bold"
                  >
                    Application User
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Grid>
            <Grid item>
              <Tooltip title="Print" arrow>
                <IconButton
                  sx={{
                    '&:hover': { background: theme.colors.primary.lighter },
                    color: theme.palette.primary.main,
                    marginTop: '3px'
                  }}
                  color="inherit"
                  size="small"
                  onClick={handlePrint}
                >
                  <PrintIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export File" arrow>
                <IconButton
                  sx={{
                    '&:hover': { background: theme.colors.primary.lighter },
                    color: theme.palette.primary.main
                  }}
                  color="inherit"
                  size="small"
                  onClick={DataSend}
                >
                  <CSVLink
                    data={data1}
                    filename={'ApplicationUserReport.csv'}
                    style={{
                      '&:hover': { background: theme.colors.primary.lighter },
                      color: theme.palette.primary.main
                    }}
                  >
                    <UploadFileRoundedIcon />
                  </CSVLink>
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter" arrow>
                <IconButton
                  sx={{
                    '&:hover': { background: theme.colors.primary.lighter },
                    color: theme.palette.primary.main
                  }}
                  color="inherit"
                  size="small"
                  onClick={toggleSlider}
                >
                  {!sidebarToggle ? (
                    <FilterAltIcon fontSize="medium" />
                  ) : (
                    <CloseTwoToneIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card className="userProposalcard">
              {isloading ? (
                <Loader title="Loading..." />
              ) : (
                <>
                  <Drawer
                    open={open}
                    anchor="right"
                    onClose={toggleSlider}
                    PaperProps={{
                      sx: { width: 280, border: 'none', overflow: 'auto' }
                    }}
                  >
                    <>
                      <div
                        style={{
                          height: 'calc(100vh - 122px)',
                          overflow: 'auto'
                        }}
                      >
                        <Stack
                          spacing={3}
                          sx={{ mx: 2, mb: 2, mt: 4, backgroundColor: 'white' }}
                        >
                          <FormGroup>
                            <TextField
                              fullWidth
                              id="standard-basic"
                              label="Name"
                              variant="outlined"
                              className="mb-3"
                              name="name"
                              value={user.name}
                              onChange={handleChange}
                            />
                            <FormControl fullWidth className="mb-3">
                              <InputLabel id="demo-simple-select-label">
                                Gender
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="gender"
                                value={user.gender}
                                label="Gender"
                                onChange={handleChange}
                              >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                              </Select>
                            </FormControl>
                            <FormControl fullWidth className="mb-3">
                              <Autocomplete
                                value={user.stateId}
                                onInputChange={(e, v) => {
                                  handleChange2(e, v);
                                }}
                                id="combo-box-demo"
                                sx={{ width: '227px' }}
                                options={stateId.map((e: any) => e.stateName)}
                                getOptionLabel={(option: any) => option}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="State"
                                    variant="outlined"
                                    name="stateId"
                                  />
                                )}
                              />
                            </FormControl>
                            <FormControl fullWidth className="mb-3">
                              <Autocomplete
                                value={user.cityId}
                                inputValue={selected}
                                onInputChange={(e, v) => {
                                  handleChange1(e, v);
                                }}
                                id="combo-box-demo"
                                sx={{ width: '227px' }}
                                options={cityId.map((e: any) => e.cityName)}
                                getOptionLabel={(option: any) => option}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="City"
                                    variant="outlined"
                                    name="cityId"
                                  />
                                )}
                              />
                            </FormControl>
                            <FormControl fullWidth className="mb-3">
                              <InputLabel id="demo-simple-select-label">
                                Marital Status
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="maritalStatusId"
                                value={user.maritalStatusId}
                                label="Marital Status"
                                onChange={handleChange}
                              >
                                {maritalStatus.map((option) => (
                                  <MenuItem value={option.id} key={option.id}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth className="mb-3">
                              <InputLabel id="demo-simple-select-label">
                                Religion
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="religionId"
                                value={user.religionId}
                                label="Religion"
                                onChange={handleChange}
                              >
                                {religion.map((option) => (
                                  <MenuItem value={option.id} key={option.id}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth className="mb-3">
                              <InputLabel id="demo-simple-select-label">
                                Community
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="communityId"
                                value={user.communityId}
                                label="Community"
                                onChange={handleChange}
                              >
                                {community.map((option) => (
                                  <MenuItem value={option.id} key={option.id}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth className="mb-3">
                              <InputLabel id="demo-simple-select-label">
                                Sub Community
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="subCommunityId"
                                value={user.subCommunityId}
                                label="Sub Community"
                                onChange={handleChange}
                              >
                                {subCommunity.map((option) => (
                                  <MenuItem value={option.id} key={option.id}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth className="mb-3">
                              <InputLabel id="demo-simple-select-label">
                                Occupation
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="occupationId"
                                value={user.occupationId}
                                label="Occupation"
                                onChange={handleChange}
                              >
                                {occupation.map((option) => (
                                  <MenuItem value={option.id} key={option.id}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth className="mb-3">
                              <InputLabel id="demo-simple-select-label">
                                Education
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="educationId"
                                value={user.educationId}
                                label="Education"
                                onChange={handleChange}
                              >
                                {education.map((option) => (
                                  <MenuItem value={option.id} key={option.id}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth className="mb-3">
                              <InputLabel id="demo-simple-select-label">
                                Diet
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="dietId"
                                value={user.dietId}
                                label="Diet"
                                onChange={handleChange}
                              >
                                {diet.map((option) => (
                                  <MenuItem value={option.id} key={option.id}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth className="mb-3">
                              <InputLabel id="demo-simple-select-label">
                                Income
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="incomeId"
                                value={user.incomeId}
                                label="Income"
                                onChange={handleChange}
                              >
                                {income.map((option) => (
                                  <MenuItem value={option.id} key={option.id}>
                                    {option.value}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth className="mb-3">
                              <InputLabel id="demo-simple-select-label">
                                Height
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="heightId"
                                value={user.heightId}
                                label="Height"
                                onChange={handleChange}
                              >
                                {height.map((option) => (
                                  <MenuItem value={option.id} key={option.id}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </FormGroup>
                        </Stack>
                      </div>
                      <div>
                        <Box
                          sx={{
                            p: 2,
                            position: 'absolute',
                            bottom: '50px',
                            width: '100%'
                          }}
                        >
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={handlesubmit}
                          >
                            Search
                          </Button>
                        </Box>
                        <Box
                          sx={{
                            p: 2,
                            position: 'absolute',
                            bottom: '0px',
                            width: '100%'
                          }}
                        >
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={(e) => handleClear(e)}
                          >
                            Clear
                          </Button>
                        </Box>
                      </div>
                    </>
                  </Drawer>
                  <Divider />
                  {data && data.length > 0 ? (
                    <>
                      <TableContainer className="userProposalTableContainer">
                        <Table
                          stickyHeader
                          sx={{ overflow: 'auto', minWidth: 'calc(100-90%)' }}
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  Id
                                </Typography>
                              </TableCell>
                              {/* <TableCell >Profile</TableCell> */}
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  Name
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  Contact
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  Email
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  Gender
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  City
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  State
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  Martial Status
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  Religion
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  Community
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  Occupation
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  education
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  Sub Community
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  Income
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  Diet
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  noWrap
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    marginBottom: 'none'
                                  }}
                                >
                                  Height
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data.map((arr: any, index) => {
                              return (
                                <TableRow hover key={index}>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {page * limit + index + 1}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={2}
                                    >
                                      {arr.imageUrl ? (
                                        <Avatar
                                          src={
                                            process.env.REACT_APP_IMAGE_URL +
                                            arr.imageUrl
                                          }
                                        ></Avatar>
                                      ) : (
                                        <Avatar>
                                          {arr.firstName
                                            ? arr.firstName[0]
                                            : null}
                                        </Avatar>
                                      )}
                                      <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                        color="text.primary"
                                        gutterBottom
                                        noWrap
                                        sx={{ textTransform: 'capitalize' }}
                                      >
                                        {arr.firstName} {arr.lastName}
                                      </Typography>
                                    </Stack>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {arr.contactNo ? arr.contactNo : '--'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {arr.email ? arr.email : '--'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {arr.gender ? arr.gender : '--'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {arr.cityName ? arr.cityName : '--'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {arr.stateName ? arr.stateName : '--'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {arr.maritalStatus
                                        ? arr.maritalStatus
                                        : '--'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {arr.religion ? arr.religion : '--'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {arr.community ? arr.community : '--'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {arr.occupation ? arr.occupation : '--'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {arr.education ? arr.education : '--'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {arr.subCommunity
                                        ? arr.subCommunity
                                        : '--'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {arr.annualIncome
                                        ? arr.annualIncome
                                        : '--'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {arr.diet ? arr.diet : '--'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {arr.height ? arr.height : '--'}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Box p={2}>
                        <TablePagination
                          component="div"
                          count={row}
                          onPageChange={handlePageChange}
                          onRowsPerPageChange={handleLimitChange}
                          page={page}
                          rowsPerPage={limit}
                          rowsPerPageOptions={[10, 20, 30, 40]}
                        />
                      </Box>
                    </>
                  ) : (
                    <Paper
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        boxShadow: 'none'
                      }}
                      className="userProposalcard"
                    >
                      <Typography variant="h5" paragraph>
                        Data not Found
                      </Typography>
                    </Paper>
                  )}
                </>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
      {/* <Footer /> */}
    </div>
  );
};

export default ApplicationUser;

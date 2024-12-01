import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader1 from 'src/content/Loader';
import {
  Box,
  Grid,
  Breadcrumbs,
  Typography,
  Stack,
  Button,
  Container,
  Card,
  TableContainer,
  TablePagination,
  Divider,
  IconButton,
  Switch,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormHelperText,
  Paper
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import JoditEditor from 'jodit-react';
import '../smallScreen.css';
import { FormControl } from '@mui/material';
import { useRef } from 'react';
import APIservice from 'src/utils/APIservice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  id: 0,
  question: '',
  answer: '',
  name: ''
};

export default function Question() {
  const [isLoading, setIsLoading] = useState(false);
  const [ischeck, setIsCheck] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDel, setIsDel] = useState(false);
  const [open, setOpen] = useState(false);
  const [check, setCheck] = useState(false);
  const [Del, setDel] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [pageCategories, setPageCategories] = useState<number>(0);
  const [limitCategories, setLimitCategories] = useState<number>(10);
  const [rowCategories, setRowCategories] = useState<number>(10);
  const [question, setQuestion] = useState<any>(initialState);
  const [user, setUser] = useState([]);
  const [isNameError, setNameError] = useState(false);
  const [NameErrorMsg, setNameErrorMsg] = useState('');
  const [answer, setAnswer] = useState<any>('');
  const [isQuestionError, setQuestionError] = useState(false);
  const [QuestionErrorMsg, setQuestionErrorMsg] = useState('');
  const [isAnswerError, setAnswerError] = useState(false);
  const [AnswerErrorMsg, setAnswerErrorMsg] = useState('');
  const [isUserError, setUserError] = useState(false);
  const [UserErrorMsg, setUserErrorMsg] = useState('');
  const [errorFlag, setErrorFlag] = useState(false);
  let [credentail, setCredentail] = useState<any>();

  const [isReadPermission, setIsReadPermission] = useState(true);
  const [isWritePermission, setIsWritePermission] = useState(true);
  const [isEditPermission, setIsEditPermission] = useState(true);
  const [isDeletePermission, setIsDeletePermission] = useState(true);

  useEffect(() => {
    let cred = JSON.parse(localStorage.getItem('Credentials'));
    setCredentail(cred);
    if (cred) {
      if (cred.roleId != 1) {
        let ind = cred.pagePermissions.findIndex((c: any) => c.title === "Block Users");
        if (ind >= 0) {
          setIsReadPermission(cred.pagePermissions[ind].isReadPermission);
          setIsWritePermission(cred.pagePermissions[ind].isAddPermission)
          setIsEditPermission(cred.pagePermissions[ind].isEditPermission);
          setIsDeletePermission(cred.pagePermissions[ind].isDeletePermission);

          if (cred.pagePermissions[ind].isReadPermission)
            getData(page, limit, pageCategories, limitCategories);
        }
      } else {
        getData(page, limit, pageCategories, limitCategories);
      }
    }
  }, []);

  const editor = useRef(null);

  const navigate = useNavigate();

  const reg = new RegExp(/^[a-zA-Z_ ]+$/);
  const validateName = (arr) => {
    const { name, value } = arr.target;
    if (value) {
      if (reg.test(arr.target.value)) {
        setNameError(false);
        setNameErrorMsg('');
      } else {
        setNameError(true);
        setNameErrorMsg('Alphabet and space allowed');
      }
    } else {
      setNameError(true);
      setNameErrorMsg('Question Category is required');
    }
  };

  const validateQuestion = (arr: any) => {
    const { name, value } = arr.target;
    if (value) {
      setQuestionError(false);
      setQuestionErrorMsg('');
    } else {
      setQuestionError(true);
      setQuestionErrorMsg('Question is required');
    }
  };

  const validateAnswer = (e: string) => {
    if (e) {
      setAnswerError(false);
      setAnswerErrorMsg('');
    } else {
      setAnswerError(true);
      setAnswerErrorMsg('Answer is required');
    }
  };

  const validateForm = (e: any) => {
    e.preventDefault();
    var flag = true;
    if (!question.name) {
      setNameError(true);
      setNameErrorMsg('Question Category is required');
      flag = false;
    } else {
      if (reg.test(question.name)) {
        setNameError(false);
        setNameErrorMsg('');
        flag = true;
      } else {
        setNameError(true);
        setNameErrorMsg('Alphabet and space allowed');
        flag = false;
      }
    }
    return flag;
  };

  const validateForm1 = (e: any) => {
    e.preventDefault();
    let flag = true;
    if (!question.question) {
      setQuestionError(true);
      setQuestionErrorMsg('Question is required');
      flag = false;
    } else {
      setQuestionError(false);
      setQuestionErrorMsg('');
    }
    if (!answer) {
      setAnswerError(true);
      setAnswerErrorMsg('Answer is required');
      flag = false;
    } else {
      setAnswerError(false);
      setAnswerErrorMsg('');
    }
    return flag;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setQuestion({
      ...question,
      [name]: value
    });
    if (errorFlag === true) {
      setUserError(false);
      setErrorFlag(false);
    }
  };

  const handleChange1 = (e: any) => {
    let obj = {
      answer: e
    };
    setAnswer(obj);
    if (errorFlag === true) {
      setUserError(false);
      setErrorFlag(false);
    }
  };

  const handleClose = () => {
    setIsCheck(false);
    setIsOpen(false);
    setIsDel(false);
    setOpen(false);
    setCheck(false);
    setDel(false);
  };

  const handleClickisAdd = async (id: any, str: any) => {
    setQuestion({ categoriesId: id, name: str });
    setIsOpen(true);
    setNameError(false);
    setNameErrorMsg('');
    setUserError(false);
    setUserErrorMsg('');
    setAnswerError(false);
    setAnswerErrorMsg('');
    setQuestionError(false);
    setQuestionErrorMsg('');
  };

  const handleClickisEdit = (
    no: number,
    que: string,
    ans: string,
    name: any
  ) => {
    let obj = {
      id: no,
      question: que,
      answer: ans,
      name: name
    };
    setQuestion(obj);
    setIsOpen(true);
    setUserError(false);
    setUserErrorMsg('');
    setNameError(false);
    setNameErrorMsg('');
    setAnswerError(false);
    setAnswerErrorMsg('');
    setQuestionError(false);
    setQuestionErrorMsg('');
  };

  const handleSwitch = (id: number, status: number) => {
    let obj = {
      id: id,
      status: status
    };
    setQuestion(obj);
    setIsCheck(true);
  };

  const handleSwitchCheck = async () => {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let obj = {
      id: question.id
    };
    const res = await APIservice.httpPost(
      '/api/admin/questionCategories/activeInactiveQuestion',
      obj,
      token,
      refreshToken
    );
    setIsCheck(false);
    getData(
      page * limit,
      limit,
      pageCategories * limitCategories,
      limitCategories
    );
  };

  const handleClickisDelete = (id: number) => {
    let obj = {
      id: id
    };
    setQuestion(obj);
    setIsDel(true);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let obj = {
      id: question.id
    };
    const res = await APIservice.httpPost(
      '/api/admin/questionCategories/deleteQuestion',
      obj,
      token,
      refreshToken
    );
    setIsDel(false);
    getData(
      page * limit,
      limit,
      pageCategories * limitCategories,
      limitCategories
    );
  };

  const getData = async (
    startIndex: number,
    fetchRecord: number,
    startIndexCategories: number,
    fetchRecordCategories: number
  ) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        startIndex: startIndex,
        fetchRecord: fetchRecord,
        startIndexCategories: startIndexCategories,
        fetchRecordCategories: fetchRecordCategories
      };
      const res = await APIservice.httpPost(
        '/api/admin/questionCategories/getQuestion',
        obj,
        token,
        refreshToken
      );
      setUser(res.recordList);
      setRowCategories(res.totalRecords);
      if (res && res.status == 200) {
        setIsOpen(false);
      } else if (res.status == 401) {
        navigate('/admin');
        localStorage.clear();
      } else if (res.status == 400) {
        setIsOpen(false);
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
        setIsOpen(false);
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
        setIsOpen(false);
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
        setIsOpen(false);
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
      setIsLoading(false);
      setIsOpen(false);
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
    setIsLoading(false);
  };

  const saveQuestion = async (arr: any) => {
    try {
      let flag = validateForm1(arr);
      if (flag) {
        if (question.id) {
          const token = localStorage.getItem('SessionToken');
          const refreshToken = localStorage.getItem('RefreshToken');
          let val = {
            id: question.id,
            question: question.question,
            answer: answer.answer
          };
          const res = await APIservice.httpPost(
            '/api/admin/questionCategories/insertUpdateQuestion',
            val,
            token,
            refreshToken
          );
          if (res && res.status === 200) {
            setIsOpen(false);
            getData(
              page * limit,
              limit,
              pageCategories * limitCategories,
              limitCategories
            );
          } else if (res && res.status === 401) {
            navigate('/admin');
            localStorage.clear();
          } else if (res && res.status === 400) {
            flag = false;
            if (!(flag && errorFlag)) {
              setUserError(true);
              setUserErrorMsg(res.message);
              setErrorFlag(true);
            }
          } else if (res.status == 500) {
            setIsOpen(false);
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
            setIsOpen(false);
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
            setIsOpen(false);
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
        } else {
          const token = localStorage.getItem('SessionToken');
          const refreshToken = localStorage.getItem('RefreshToken');
          let obj = {
            question: question.question,
            answer: answer.answer,
            categoriesId: question.categoriesId
          };
          const res = await APIservice.httpPost(
            '/api/admin/questionCategories/insertUpdateQuestion',
            obj,
            token,
            refreshToken
          );
          if (res && res.status == 200) {
            getData(0, limit, 0, limitCategories);
            setPage(0);
            setIsOpen(false);
          } else if (res.status == 401) {
            navigate('/admin');
            localStorage.clear();
          } else if (res.status == 400) {
            flag = false;
            if (!(flag && errorFlag)) {
              setUserError(true);
              setUserErrorMsg(res.message);
              setErrorFlag(true);
            }
          } else if (res.status == 500) {
            setIsOpen(false);
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
            setIsOpen(false);
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
            setIsOpen(false);
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
        }
      }
    } catch (error) {
      console.log(error);
      setIsOpen(false);
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

  const saveQuestionCategories = async (e: any) => {
    try {
      let flag = validateForm(e);
      if (flag) {
        if (question.id) {
          const token = localStorage.getItem('SessionToken');
          const refreshToken = localStorage.getItem('RefreshToken');
          let val = {
            id: question.id,
            name: question.name
          };
          const res = await APIservice.httpPost(
            '/api/admin/questionCategories/insertUpdateQuestionCategories',
            val,
            token,
            refreshToken
          );
          if (res && res.status === 200) {
            setOpen(false);
            getData(
              page * limit,
              limit,
              pageCategories * limitCategories,
              limitCategories
            );
          } else if (res && res.status === 401) {
            navigate('/admin');
            localStorage.clear();
          } else if (res && res.status === 400) {
            flag = false;
            if (!(flag && errorFlag)) {
              setUserError(true);
              setUserErrorMsg(res.message);
              setErrorFlag(true);
            }
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
          }
        } else {
          const token = localStorage.getItem('SessionToken');
          const refreshToken = localStorage.getItem('RefreshToken');
          let obj = {
            name: question.name
          };
          const res = await APIservice.httpPost(
            '/api/admin/questionCategories/insertUpdateQuestionCategories',
            obj,
            token,
            refreshToken
          );
          if (res && res.status === 200) {
            setOpen(false);
            getData(0, limit, 0, limitCategories);
          } else if (res && res.status === 401) {
            navigate('/admin');
            localStorage.clear();
          } else if (res && res.status === 400) {
            flag = false;
            if (!(flag && errorFlag)) {
              setUserError(true);
              setUserErrorMsg(res.message);
              setErrorFlag(true);
            }
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
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddForCategoryName = async () => {
    setOpen(true);
    setQuestion(initialState);
    setNameError(false);
    setNameErrorMsg('');
    setAnswerError(false);
    setAnswerErrorMsg('');
    setUserError(false);
    setUserErrorMsg('');
    setQuestionError(false);
    setQuestionErrorMsg('');
  };

  const handleEditCategoryName = (id: any, str: string) => {
    let obj = {
      id: id,
      name: str
    };
    setQuestion(obj);
    setOpen(true);
    setNameError(false);
    setNameErrorMsg('');
    setAnswerError(false);
    setAnswerErrorMsg('');
    setUserError(false);
    setUserErrorMsg('');
    setQuestionError(false);
    setQuestionErrorMsg('');
  };

  const handleSwitchCategories = (id: number, status: number) => {
    let obj = {
      id: id,
      status: status
    };
    setQuestion(obj);
    setCheck(true);
  };

  const handleSwitchCheckCategories = async () => {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let obj = {
      id: question.id
    };
    const res = await APIservice.httpPost(
      '/api/admin/questionCategories/activeInactiveQuestionCategories',
      obj,
      token,
      refreshToken
    );
    setCheck(false);
    getData(
      page * limit,
      limit,
      pageCategories * limitCategories,
      limitCategories
    );
  };

  const handleDeleteCategoriesDialog = (id: number) => {
    let obj = {
      id: id
    };
    setQuestion(obj);
    setDel(true);
  };

  const handleDeleteCategories = async () => {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let obj = {
      id: question.id
    };
    const res = await APIservice.httpPost(
      '/api/admin/questionCategories/deleteQuestionCategories',
      obj,
      token,
      refreshToken
    );
    setDel(false);
    getData(
      page * limit,
      limit,
      pageCategories * limitCategories,
      limitCategories
    );
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
    getData(
      newPage * limit,
      limit,
      pageCategories * limitCategories,
      limitCategories
    );
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
    setPage(0);
    getData(0, parseInt(event.target.value), 0, limitCategories);
  };

  const handleCategoriesPageChange = (event: any, newPage: number): void => {
    setPageCategories(newPage);
    getData(newPage * limitCategories, limitCategories, page * limit, limit);
  };

  const handleCategoriesLimitChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setLimitCategories(parseInt(event.target.value));
    setPageCategories(0);
    getData(0, parseInt(event.target.value), 0, limit);
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
        <title>FAQs</title>
      </Helmet>
      <PageTitleWrapper>
        <Box pt={1.1} pb={1.1} pl={1}>
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
                    FAQs
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Grid>
            <Grid item>
              {isWritePermission ?
                <>
                  <Button
                    className="buttonLarge"
                    sx={{ lineHeight: '2.04' }}
                    variant="contained"
                    onClick={handleAddForCategoryName}
                    size="small"
                  >
                    <AddTwoToneIcon fontSize="small" /> Create Question Categories
                  </Button>
                  <Button
                    className="button"
                    sx={{ lineHeight: '2.04' }}
                    variant="contained"
                    onClick={handleAddForCategoryName}
                    size="small"
                  >
                    <AddTwoToneIcon fontSize="small" />
                  </Button>
                </>
                : <></>}

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
            <Card className="appcard">
              <div>
                {isLoading ? (
                  <Loader1 title="Loading..." />
                ) : (
                  <>
                    {user && user.length > 0 ? (
                      <>
                        <TableContainer className="apptableContainer">
                          {user.map((arr: any, index: number) => (
                            <Accordion key={arr.id} sx={{ mt: 1 }}>
                              <AccordionSummary
                                expandIcon={
                                  <ExpandMoreIcon sx={{ color: '#495fff' }} />
                                }
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                sx={{
                                  bgcolor: '#c7cdfd',
                                  display: 'flex',
                                  justifyContent: 'space-between'
                                }}
                              >
                                <Grid container justifyContent="space-between">
                                  <Grid
                                    item
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center'
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: '17px',
                                        fontWeight: 'bold',
                                        textTransform: 'capitalize',
                                        color: '#495fff'
                                      }}
                                    >
                                      {arr.name}
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center'
                                    }}
                                  >
                                    {isEditPermission ?
                                      <>
                                        <Tooltip
                                          title={
                                            arr.isActive === 0
                                              ? 'Inactive'
                                              : 'Active'
                                          }
                                          arrow
                                        >
                                          <Switch
                                            disabled={credentail?.email === "demo@admin.com"}
                                            checked={
                                              arr.isActive === 0 ? false : true
                                            }
                                            onClick={(e) =>
                                              handleSwitchCategories(
                                                arr.id,
                                                arr.isActive
                                              )
                                            }
                                            inputProps={{
                                              'aria-label': 'controlled'
                                            }}
                                          />
                                        </Tooltip>
                                        <Tooltip title="Edit " arrow>
                                          <Button
                                            disabled={credentail?.email === "demo@admin.com"}
                                            sx={{
                                              backgroundColor: '#5569ff',
                                              color: 'white',
                                              mr: 1
                                            }}
                                            size="small"
                                            variant="contained"
                                            onClick={(e) =>
                                              handleEditCategoryName(
                                                arr.id,
                                                arr.name
                                              )
                                            }
                                          >
                                            <EditTwoToneIcon fontSize="small" />
                                          </Button>
                                        </Tooltip>
                                      </>
                                      : <></>}
                                    {isWritePermission ?
                                      <Tooltip title="Add " arrow>
                                        <Button
                                          disabled={credentail?.email === "demo@admin.com"}
                                          sx={{
                                            backgroundColor: '#5569ff',
                                            color: 'white',
                                            mr: 1
                                          }}
                                          size="small"
                                          variant="contained"
                                          onClick={(e) => {
                                            handleClickisAdd(arr.id, arr.name);
                                          }}
                                        >
                                          <AddTwoToneIcon fontSize="small" />
                                        </Button>
                                      </Tooltip>
                                      : <></>}
                                    {isDeletePermission ?
                                      <Tooltip title="Delete" arrow>
                                        <Button
                                          disabled={credentail?.email === "demo@admin.com"}
                                          sx={{
                                            backgroundColor: '#5569ff',
                                            color: 'white',
                                            mr: 1
                                          }}
                                          size="small"
                                          variant="contained"
                                          onClick={(e) =>
                                            handleDeleteCategoriesDialog(arr.id)
                                          }
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </Button>
                                      </Tooltip>
                                      : <></>}

                                  </Grid>
                                </Grid>
                              </AccordionSummary>
                              {arr.question.map((data: any, index: number) => (
                                <>
                                  <AccordionDetails key={data.id}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        bgcolor: 'aliceblue',
                                        alignItems: 'center'
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: {
                                            lg: '18px',
                                            md: '17px',
                                            sm: '16px',
                                            xs: '15px'
                                          },
                                          fontWeight: 'bold',
                                          p: 1
                                        }}
                                      >
                                        {data.question}
                                      </Typography>
                                      <div
                                        style={{
                                          padding: '9px',
                                          display: 'flex'
                                        }}
                                      >
                                        {isEditPermission ? <>
                                          <Tooltip
                                            title={
                                              data.isActive === 0
                                                ? 'Inactive'
                                                : 'Active'
                                            }
                                            arrow
                                          >
                                            <Switch
                                              disabled={credentail?.email === "demo@admin.com"}
                                              checked={
                                                data.isActive === 0 ? false : true
                                              }
                                              onClick={(e) =>
                                                handleSwitch(
                                                  data.id,
                                                  data.isActive
                                                )
                                              }
                                              inputProps={{
                                                'aria-label': 'controlled'
                                              }}
                                            />
                                          </Tooltip>
                                          <Tooltip title="Edit " arrow>
                                            <Button
                                              disabled={credentail?.email === "demo@admin.com"}
                                              sx={{
                                                backgroundColor: '#5569ff',
                                                color: 'white',
                                                mx: 1
                                              }}
                                              size="small"
                                              variant="contained"
                                              onClick={(e) =>
                                                handleClickisEdit(
                                                  data.id,
                                                  data.question,
                                                  data.answer,
                                                  arr.name
                                                )
                                              }
                                            >
                                              <EditTwoToneIcon fontSize="small" />
                                            </Button>
                                          </Tooltip>
                                        </> : <></>}
                                        {isDeletePermission ?
                                          <Tooltip title="Delete" arrow>
                                            <Button
                                              disabled={credentail?.email === "demo@admin.com"}
                                              sx={{
                                                backgroundColor: '#5569ff',
                                                color: 'white'
                                              }}
                                              size="small"
                                              variant="contained"
                                              onClick={(e) =>
                                                handleClickisDelete(data.id)
                                              }
                                            >
                                              <DeleteIcon fontSize="small" />
                                            </Button>
                                          </Tooltip>
                                          : <></>}
                                      </div>
                                    </Box>
                                    <Typography
                                      sx={{ fontSize: '16.5px', p: 1 }}
                                      dangerouslySetInnerHTML={{
                                        __html: data.answer
                                      }}
                                    />
                                  </AccordionDetails>
                                </>
                              ))}
                              <Divider />
                              <Box p={2}>
                                <TablePagination
                                  component="div"
                                  count={arr.questionCount}
                                  onPageChange={handlePageChange}
                                  onRowsPerPageChange={handleLimitChange}
                                  page={page}
                                  rowsPerPage={limit}
                                  rowsPerPageOptions={[10, 20, 30, 40]}
                                />
                              </Box>
                            </Accordion>
                          ))}
                        </TableContainer>
                        <Box p={2}>
                          <TablePagination
                            component="div"
                            count={rowCategories}
                            onPageChange={handleCategoriesPageChange}
                            onRowsPerPageChange={handleCategoriesLimitChange}
                            page={pageCategories}
                            rowsPerPage={limitCategories}
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
                        className="apptableContainer"
                      >
                        <Typography variant="h5" paragraph>
                          Data not Found
                        </Typography>
                      </Paper>
                    )}
                  </>
                )}
              </div>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* question */}
      <div>
        <Dialog open={ischeck} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
          >
            {question.status === 0 ? 'Inactive' : 'Active'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
            >
              {question.status === 0
                ? 'Are you sure you want to Active?'
                : 'Are you sure you want to Inactive?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleSwitchCheck} variant="outlined" style={{marginRight: '10px'}}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog open={isDel} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
          >
            Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
            >
              Are you sure you want to Delete?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleDelete} variant="outlined" style={{marginRight: '10px'}}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog open={isOpen} onClose={handleClose} fullWidth>
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: '18px', fontWeight: 'bold' }}
          >
            {question.id ? 'Edit Question' : 'Add Question'}{' '}
            {'(' + question.name + ')'}
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 13,
                top: 13,
                color: (theme) => theme.palette.grey[500]
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <FormControl fullWidth>
              <label>Question</label>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Question"
                type="text"
                fullWidth
                variant="outlined"
                name="question"
                value={question.question}
                onChange={(e) => {
                  handleChange(e);
                  validateQuestion(e);
                }}
                required={true}
              />
            </FormControl>
            <FormHelperText style={{ color: 'red', height: '22px' }}>
              {isQuestionError && QuestionErrorMsg}
            </FormHelperText>
            <FormControl sx={{ mt: 2 }} fullWidth>
              <label>Answer</label>
              <div style={{ marginTop: '9px' }}>
                <JoditEditor
                  ref={editor}
                  value={question.answer}
                  className="answer"
                  onChange={(e: any) => {
                    handleChange1(e);
                    validateAnswer(e);
                  }}
                />
              </div>
              <FormHelperText style={{ color: 'red', height: '22px' }}>
                {isAnswerError && AnswerErrorMsg}
              </FormHelperText>
            </FormControl>
          </DialogContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px'
            }}
          >
            <FormHelperText
              style={{
                color: 'red',
                height: '22px',
                margin: 'none',
                padding: '8px 0px'
              }}
            >
              {isUserError && UserErrorMsg}
            </FormHelperText>
            <Button disabled={credentail?.email === "demo@admin.com"} onClick={saveQuestion}>Save</Button>
          </Box>
        </Dialog>
      </div>

      {/* Categories */}
      <div>
        <Dialog open={check} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
          >
            {question.status === 0 ? 'Inactive' : 'Active'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
            >
              {question.status === 0
                ? 'Are you sure you want to Active?'
                : 'Are you sure you want to Inactive?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleSwitchCheckCategories} variant="outlined" style={{marginRight: '10px'}}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog open={Del} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
          >
            Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
            >
              Are you sure you want to Delete?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleDeleteCategories} variant="outlined" style={{marginRight: '10px'}}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{ sx: { height: '40%' } }}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: '18px', fontWeight: 'bold' }}
          >
            {question.id ? 'Edit Question Category ' : 'Add Question Category'}
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 13,
                top: 13,
                color: (theme) => theme.palette.grey[500]
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Question Category"
              type="text"
              fullWidth
              variant="outlined"
              name="name"
              value={question.name}
              onChange={(arr) => {
                handleChange(arr);
                validateName(arr);
              }}
              required={true}
            />
            <FormHelperText style={{ color: 'red', height: '22px' }}>
              {isNameError && NameErrorMsg}
            </FormHelperText>
          </DialogContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px'
            }}
          >
            <FormHelperText
              style={{
                color: 'red',
                height: '22px',
                margin: 'none',
                padding: '8px 0px'
              }}
            >
              {isUserError && UserErrorMsg}
            </FormHelperText>
            <Button disabled={credentail?.email === "demo@admin.com"} onClick={saveQuestionCategories}>Save</Button>
          </Box>
        </Dialog>
      </div>
    </>
  );
}

import { useContext, useEffect, useRef, useState } from 'react';

import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem,
  Backdrop,
  CircularProgress,
  MenuItem,
  TextField,
  ListItemText,
  Popover,
  Menu,
  ListItemButton,
  Collapse,
  ListItemIcon
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TaskIcon from '@mui/icons-material/Task';
import FeedIcon from '@mui/icons-material/Feed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { NavLink, NavLink as RouterLink, useNavigate } from 'react-router-dom';
import { SidebarContext } from 'src/contexts/SidebarContext';
import School from '@mui/icons-material/School';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DiningIcon from '@mui/icons-material/Dining';
import HeightIcon from '@mui/icons-material/Height';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import LockIcon from '@mui/icons-material/Lock';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import SynagogueIcon from '@mui/icons-material/Synagogue';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import SummarizeIcon from '@mui/icons-material/Summarize';
import TempleHinduSharpIcon from '@mui/icons-material/TempleHinduSharp';
import PeopleIcon from '@mui/icons-material/People';
import { AssignmentInd } from '@mui/icons-material';
import BadgeIcon from '@mui/icons-material/Badge';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeviceUnknownIcon from '@mui/icons-material/DeviceUnknown';
import PercentIcon from '@mui/icons-material/Percent';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PublicIcon from '@mui/icons-material/Public';
import TuneIcon from '@mui/icons-material/Tune';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItemButton-root {
        display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiListItemButton{
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
      }

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }

        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }

          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }


        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
    'transform',
    'opacity'
  ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const { closeSidebar } = useContext(SidebarContext);

  const ref = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);

  const [user, setUser] = useState<any>();
  const [isEnableCustomFields, setEnableCustomFields] = useState(true);
  const [isEnableSubCommunity, setIsEnableSubCommunity] = useState(true);
  const [isEnableCommunity, setIsEnableCommunity] = useState(true);

  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(!open);
    setIsOpen(false);
    setIsApprovalOpen(false);
  };

  const handleIsClick = () => {
    setIsOpen(!isOpen);
    setOpen(false);
    setIsApprovalOpen(false);
  };

  const handleIsApprovalClick = () => {
    setIsApprovalOpen(!isApprovalOpen);
    setOpen(false);
    setIsOpen(false);
  }

  useEffect(() => {
    if (localStorage.getItem('Credentials')) {
      let user = (JSON.parse(localStorage.getItem('Credentials')) as any);
      console.log(user);
      setUser(user);
    }
    let isEnableCustomFields = JSON.parse(localStorage.getItem('isEnableCustomFields'));
    setEnableCustomFields(isEnableCustomFields);

    let isEnableCommunity = JSON.parse(localStorage.getItem('isEnableCommunity'));
    setIsEnableCommunity(isEnableCommunity);

    let isEnableSubCommunity = JSON.parse(localStorage.getItem('isEnableSubCommunity'));
    setIsEnableSubCommunity(isEnableSubCommunity);
  }, []);

  //#region Page Route Link
  const handleSend = () => {
    navigate('/admin/requestSendReport');
  };
  const handleAccept = () => {
    navigate('/admin/requestAcceptReport');
  };
  const handleReject = () => {
    navigate('/admin/requestRejectReport');
  };
  const handleReceiveUser = () => {
    navigate('/admin/requestReceiveUser');
  };
  const handleRejectUser = () => {
    navigate('/admin/requestRejectUser');
  };
  const handleSendUser = () => {
    navigate('/admin/requestSendUser');
  };

  const handleRequestSend = () => {
    navigate('/admin/requestsend');
  };
  const handleRequestReceive = () => {
    navigate('/admin/requestreceive');
  };
  const handleApplicationUser = () => {
    navigate('/admin/applicationuser');
  };

  const handlePremiumAppUser = () => {
    navigate('/admin/premiumAppUser');
  };

  const handleSystemBlockedUsers = () => {
    navigate('/admin/systemBlockedUser');
  };

  const handleIncome = () => {
    navigate('/admin/income');
  };

  const handleCurrency = () => {
    navigate('/admin/currency');
  };

  const handleCoupons = () => {
    navigate('/admin/coupon');
  };

  const handlePaymentGateway = () => {
    navigate('/admin/paymentGateway');
  };

  const handleDocumentType = () => {
    navigate('/admin/document-type');
  };

  const handleRegion = () => {
    navigate('/admin/region');
  };

  const handleReligion = () => {
    navigate('/admin/religion');
  };

  const handleCommunity = () => {
    navigate('/admin/community');
  };

  const handleSubCommunity = () => {
    navigate('/admin/subcommunity');
  };

  const handleMaritalStatus = () => {
    navigate('/admin/maritalstatus');
  };

  const handleEmployment = () => {
    navigate('/admin/employment');
  };

  const handleOccupation = () => {
    navigate('/admin/occupation');
  };

  const handleEducationType = () => {
    navigate('/admin/educationtype');
  };

  const handleEducation = () => {
    navigate('/admin/education');
  };

  const handleEducationMedium = () => {
    navigate('/admin/educationmedium');
  };

  const handleHeight = () => {
    navigate('/admin/height');
  };

  const handleWeight = () => {
    navigate('/admin/weight');
  };

  const handleCustomNotification = () => {
    navigate('/admin/custom-notification')
  }

  const handleCustomFields = () => {
    navigate('/admin/manage-custom-fields')
  }

  const handleBlogs = () => {
    navigate('/admin/blog')
  }

  const handleFAQs = () => {
    navigate('/admin/FAQs')
  }

  const handleSuccessStory = () => {
    navigate('/admin/successStory')
  }

  const handleFeedback = () => {
    navigate('/admin/feedback')
  }

  const handleCustomerPackage = () => {
    navigate('/admin/user-packages')
  }
  //#endregion Page Route Link

  return (
    <>
      <MenuWrapper>
        <List component="div">
          <SubMenuWrapper>
            {(user && user.roleId == 1) ?
              <List component="div">
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/admin/dashboard"
                    startIcon={<DashboardIcon />}
                  >
                    Dashboard
                  </Button>
                </ListItem>

                <List
                  component="div"
                  subheader={
                    <ListSubheader component="div" disableSticky>
                      User Management
                    </ListSubheader>
                  }
                  sx={{ mt: 1.5 }}
                >
                  <SubMenuWrapper>
                    <List component="div">
                      <ListItem component="div">
                        <Button
                          disableRipple
                          component={RouterLink}
                          onClick={closeSidebar}
                          to="/admin/appuser"
                          startIcon={<AccountCircleTwoToneIcon />}
                        >
                          App Users
                        </Button>
                      </ListItem>
                      <ListItem component="div">
                        <Button
                          disableRipple
                          component={RouterLink}
                          onClick={closeSidebar}
                          to="/admin/users"
                          startIcon={<GroupAddIcon />}
                        >
                          Admin Users
                        </Button>
                      </ListItem>
                      <ListItem component="div">
                        <Button
                          disableRipple
                          component={RouterLink}
                          onClick={closeSidebar}
                          to="/admin/blockuser"
                          startIcon={<LockIcon />}
                        >
                          Block Users
                        </Button>
                      </ListItem>

                    </List>
                  </SubMenuWrapper>
                </List>
                <List
                  component="div"
                  subheader={
                    <ListSubheader component="div" disableSticky>
                      Packages
                    </ListSubheader>
                  }
                >
                  <SubMenuWrapper>
                    <List component="div">
                      {/* <ListItem component="div">
                        <Button
                          disableRipple
                          component={RouterLink}
                          onClick={closeSidebar}
                          to="/admin/premiumaccount"
                          startIcon={<ImportantDevicesIcon />}
                        >
                          Premium Account
                        </Button>
                      </ListItem> */}
                      <ListItem component="div">
                        <Button
                          disableRipple
                          component={RouterLink}
                          onClick={closeSidebar}
                          to="/admin/premiumfacility"
                          startIcon={<LocalActivityIcon />}
                        >
                          Facilities
                        </Button>
                      </ListItem>
                      <ListItem component="div">
                        <Button
                          disableRipple
                          component={RouterLink}
                          onClick={closeSidebar}
                          to="/admin/timeduration"
                          startIcon={<AccessTimeIcon />}
                        >
                          Duration
                        </Button>
                      </ListItem>
                      <ListItem component="div">
                        <Button
                          disableRipple
                          component={RouterLink}
                          onClick={closeSidebar}
                          to="/admin/premiumaccount"
                          startIcon={<ImportantDevicesIcon />}
                        >
                          Packages
                        </Button>
                      </ListItem>
                    </List>
                  </SubMenuWrapper>
                </List>
                <List>
                  <SubMenuWrapper>
                    <List component="div">
                      <ListItemButton onClick={handleIsClick}>
                        {
                          <MenuBookIcon
                            sx={{ ml: '-14px', fontSize: '1.25rem' }}
                          />
                        }
                        <ListItemText
                          primary="Admin Setup"
                          sx={{
                            ml: 1,
                            transition:
                              'color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
                          }}
                        />
                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={isOpen} timeout="auto">
                        <List component="div" disablePadding>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleDocumentType();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Document Type" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleRegion();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Region" />
                          </ListItemButton>

                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleReligion();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Religion" />
                          </ListItemButton>
                          {isEnableCommunity == true &&
                            <ListItemButton
                              sx={{ pl: 4 }}
                              onClick={() => {
                                handleCommunity();
                                closeSidebar();
                              }}
                            >
                              <ListItemText primary="Community" />
                            </ListItemButton>
                          }
                          {(isEnableSubCommunity == true && isEnableCommunity == true) &&
                            <ListItemButton
                              sx={{ pl: 4 }}
                              onClick={() => {
                                handleSubCommunity();
                                closeSidebar();
                              }}
                            >
                              <ListItemText primary="Sub Community" />
                            </ListItemButton>}
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleEmployment();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Employment" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleOccupation();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Occupation" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleEducationMedium();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Education Medium" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleEducationType();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Education Type" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleEducation();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Education" />
                          </ListItemButton>

                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleHeight();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Height" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleWeight();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Weight" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleIncome();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Annual income" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleCurrency();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Currency" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleCoupons();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Coupons" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleCustomNotification();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Custom Notifications" />
                          </ListItemButton>
                          {isEnableCustomFields == true &&
                            <ListItemButton
                              sx={{ pl: 4 }}
                              onClick={() => {
                                handleCustomFields();
                                closeSidebar();
                              }}
                            >
                              <ListItemText primary="Custom Fields" />
                            </ListItemButton>
                          }
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleBlogs();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Blogs" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleFAQs();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="FAQs" />
                          </ListItemButton>


                        </List>
                      </Collapse>

                      <ListItemButton onClick={handleIsApprovalClick}>
                        {
                          <TaskIcon
                            sx={{ ml: '-14px', fontSize: '1.25rem' }}
                          />
                        }
                        <ListItemText
                          primary="Admin Approval"
                          sx={{
                            ml: 1,
                            transition:
                              'color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
                          }}
                        />
                        {isApprovalOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={isApprovalOpen} timeout="auto">
                        <List component="div" disablePadding>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handlePaymentGateway();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Payment Gateway" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleSuccessStory();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Success Story" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleCustomerPackage();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Customer Packages" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleFeedback();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Feedback" />
                          </ListItemButton>
                        </List>
                      </Collapse>


                      <ListItemButton onClick={handleClick}>
                        {
                          <SummarizeIcon
                            sx={{ ml: '-14px', fontSize: '1.25rem' }}
                          />
                        }
                        <ListItemText primary="Reports" sx={{ ml: 1 }} />
                        {open ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={open} timeout="auto">
                        <List component="div" disablePadding>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleSend();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Proposal Request Send" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleAccept();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Proposal Request Accept" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleReject();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Proposal Request Reject" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleReceiveUser();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Proposal Receive User" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleRejectUser();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Proposal Reject User" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleSendUser();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Proposal Send User" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleRequestSend();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Top Request Send" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleRequestReceive();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Top Request Receive" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleApplicationUser();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Application User" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handlePremiumAppUser();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="Premium App User" />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleSystemBlockedUsers();
                              closeSidebar();
                            }}
                          >
                            <ListItemText primary="System Blocked User" />
                          </ListItemButton>
                        </List>
                      </Collapse>
                    </List>
                  </SubMenuWrapper>
                </List>

                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/admin/setting"
                    startIcon={<SettingsIcon />}
                  >
                    Setting
                  </Button>
                </ListItem>
              </List>
              : <>
                {user && user.pagePermissions && user.pagePermissions.length > 0 ?
                  <List component="div">
                    {user.pagePermissions.findIndex(c => c.title == "Dashboard") > -1 &&
                      <ListItem component="div">
                        <Button
                          disableRipple
                          component={RouterLink}
                          onClick={closeSidebar}
                          to="/admin/dashboard"
                          startIcon={<DashboardIcon />}
                        >
                          Dashboard
                        </Button>
                      </ListItem>
                    }
                    {user.pagePermissions.findIndex(c => c.title == "App Users" || c.title == "Block Users" || c.title == "Admin Users") > -1 &&
                      <List
                        component="div"
                        subheader={
                          <ListSubheader component="div" disableSticky>
                            Users
                          </ListSubheader>
                        }
                        sx={{ mt: 1.5 }}
                      >
                        <SubMenuWrapper>
                          <List component="div">
                            {user.pagePermissions.findIndex(c => c.title == "App Users") > -1 &&
                              <ListItem component="div">
                                <Button
                                  disableRipple
                                  component={RouterLink}
                                  onClick={closeSidebar}
                                  to="/admin/appuser"
                                  startIcon={<AccountCircleTwoToneIcon />}
                                >
                                  App Users
                                </Button>
                              </ListItem>
                            }
                            {user.pagePermissions.findIndex(c => c.title == "Admin Users") > -1 &&
                              <ListItem component="div">
                                <Button
                                  disableRipple
                                  component={RouterLink}
                                  onClick={closeSidebar}
                                  to="/admin/users"
                                  startIcon={<GroupAddIcon />}
                                >
                                  Admin Users
                                </Button>
                              </ListItem>
                            }
                            {user.pagePermissions.findIndex(c => c.title == "Block Users") > -1 &&
                              <ListItem component="div">
                                <Button
                                  disableRipple
                                  component={RouterLink}
                                  onClick={closeSidebar}
                                  to="/admin/blockuser"
                                  startIcon={<LockIcon />}
                                >
                                  Block Users
                                </Button>
                              </ListItem>
                            }

                          </List>
                        </SubMenuWrapper>
                      </List>
                    }
                    {user.pagePermissions.findIndex(c => c.title == "Packages" || c.title == "Facilities" || c.title == "Duration") > -1 &&
                      <List
                        component="div"
                        subheader={
                          <ListSubheader component="div" disableSticky>
                            Packages
                          </ListSubheader>
                        }
                      >
                        <SubMenuWrapper>
                          <List component="div">

                            {user.pagePermissions.findIndex(c => c.title == "Facilities") > -1 &&
                              <ListItem component="div">
                                <Button
                                  disableRipple
                                  component={RouterLink}
                                  onClick={closeSidebar}
                                  to="/admin/premiumfacility"
                                  startIcon={<LocalActivityIcon />}
                                >
                                  Facilities
                                </Button>
                              </ListItem>
                            }
                            {user.pagePermissions.findIndex(c => c.title == "Duration") > -1 &&
                              <ListItem component="div">
                                <Button
                                  disableRipple
                                  component={RouterLink}
                                  onClick={closeSidebar}
                                  to="/admin/timeduration"
                                  startIcon={<AccessTimeIcon />}
                                >
                                  Duration
                                </Button>
                              </ListItem>
                            }
                            {user.pagePermissions.findIndex(c => c.title == "Packages") > -1 &&
                              <ListItem component="div">
                                <Button
                                  disableRipple
                                  component={RouterLink}
                                  onClick={closeSidebar}
                                  to="/admin/premiumaccount"
                                  startIcon={<ImportantDevicesIcon />}
                                >
                                  Packages
                                </Button>
                              </ListItem>
                            }
                          </List>
                        </SubMenuWrapper>
                      </List>
                    }

                    <List>
                      <SubMenuWrapper>
                        <List component="div">
                          {user.pagePermissions.findIndex(c => c.title == "Document Type" || c.title == "Religion" || c.title == "Region" || c.title == "Community" || c.title == "Sub Community"
                            || c.title == "Employment" || c.title == "Occupation" || c.title == "Education Type" || c.title == "Education" || c.title == "Education Medium" || c.title == "Height" || c.title == "Weight" || c.title == "Annual income" || c.title == "Currency" || c.title == "Annual income" || c.title == "Currency" || c.title == "Coupons" || c.title == "Custom Notification" || c.title == "Custom Fields" || c.title == "Blogs" || c.title == "FAQs") > -1 &&
                            <>
                              <ListItemButton onClick={handleIsClick}>
                                {
                                  <MenuBookIcon
                                    sx={{ ml: '-14px', fontSize: '1.25rem' }}
                                  />
                                }
                                <ListItemText
                                  primary="Master Entry"
                                  sx={{
                                    ml: 1,
                                    transition:
                                      'color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
                                  }}
                                />
                                {isOpen ? <ExpandLess /> : <ExpandMore />}
                              </ListItemButton>
                              <Collapse in={isOpen} timeout="auto">
                                <List component="div" disablePadding>
                                  {user.pagePermissions.findIndex(c => c.title == "Document Type") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleDocumentType();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Document Type" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Region") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleRegion();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Region" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Religion") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleReligion();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Religion" />
                                    </ListItemButton>
                                  }
                                  {(user.pagePermissions.findIndex(c => c.title == "Community") > -1 && isEnableCommunity == true) &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleCommunity();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Community" />
                                    </ListItemButton>
                                  }
                                  {(user.pagePermissions.findIndex(c => c.title == "Sub Community") > -1 && (isEnableSubCommunity == true && isEnableCommunity == true) ) &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleSubCommunity();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Sub Community" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Marital Status") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleMaritalStatus();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Marital Status" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Employment") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleEmployment();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Employment" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Occupation") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleOccupation();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Occupation" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Education Type") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleEducationType();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Education Type" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Education") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleEducation();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Education" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Education Medium") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleEducationMedium();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Education Medium" />
                                    </ListItemButton>
                                  }

                                  {user.pagePermissions.findIndex(c => c.title == "Height") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleHeight();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Height" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Annual income") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleIncome();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Annual income" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Currency") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleCurrency();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Currency" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Custom Notifications") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleCustomNotification();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Custom Notifications" />
                                    </ListItemButton>
                                  }
                                  {(user.pagePermissions.findIndex(c => c.title == "Custom Fields") > -1 && isEnableCustomFields == true) &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleCustomFields();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Custom Fields" />
                                    </ListItemButton>
                                  }

                                  {user.pagePermissions.findIndex(c => c.title == "Blogs") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleBlogs();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Blogs" />
                                    </ListItemButton>
                                  }

                                  {user.pagePermissions.findIndex(c => c.title == "FAQs") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleBlogs();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="FAQs" />
                                    </ListItemButton>
                                  }

                                </List>
                              </Collapse>
                            </>
                          }
                          {user.pagePermissions.findIndex(c => c.title == "Payment Gateway" || c.title == "Success Story" || c.title == "Customer Packages" || c.title == "Feedback") > -1 &&
                            <>
                              <ListItemButton onClick={handleIsApprovalClick}>
                                {
                                  <MenuBookIcon
                                    sx={{ ml: '-14px', fontSize: '1.25rem' }}
                                  />
                                }
                                <ListItemText
                                  primary="Admin Approval"
                                  sx={{
                                    ml: 1,
                                    transition:
                                      'color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
                                  }}
                                />
                                {isApprovalOpen ? <ExpandLess /> : <ExpandMore />}
                              </ListItemButton>
                              <Collapse in={isApprovalOpen} timeout="auto">
                                <List component="div" disablePadding>
                                  {user.pagePermissions.findIndex(c => c.title == "Payment Gateway") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handlePaymentGateway();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Payment Gateway" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Success Story") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleSuccessStory();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Success Story" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Customer Packages") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleCustomerPackage();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Customer Packages" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Feedback") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleFeedback();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Feedback" />
                                    </ListItemButton>
                                  }

                                </List>
                              </Collapse>
                            </>
                          }
                          {user.pagePermissions.findIndex(c => c.title == "Proposal Request Send" || c.title == "Proposal Request Accept" || c.title == "Proposal Request Reject" || c.title == "Proposal Receive User"
                            || c.title == "Proposal Reject User" || c.title == "Proposal Send User" || c.title == "Top Request Send" || c.title == "Top Request Receive" || c.title == "Application User"
                            || c.title == "Premium App User" || c.title == "System Blocked User") > -1 &&
                            <>
                              <ListItemButton onClick={handleClick}>
                                {
                                  <SummarizeIcon
                                    sx={{ ml: '-14px', fontSize: '1.25rem' }}
                                  />
                                }
                                <ListItemText primary="Reports" sx={{ ml: 1 }} />
                                {open ? <ExpandLess /> : <ExpandMore />}
                              </ListItemButton>
                              <Collapse in={open} timeout="auto">
                                <List component="div" disablePadding>
                                  {user.pagePermissions.findIndex(c => c.title == "Proposal Request Send") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleSend();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Proposal Request Send" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Proposal Request Accept") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleAccept();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Proposal Request Accept" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Proposal Request Reject") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleReject();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Proposal Request Reject" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Proposal Receive User") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleReceiveUser();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Proposal Receive User" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Proposal Reject User") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleRejectUser();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Proposal Reject User" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Proposal Send User") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleSendUser();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Proposal Send User" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Top Request Send") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleRequestSend();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Top Request Send" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Top Request Receive") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleRequestReceive();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Top Request Receive" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Application User") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleApplicationUser();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Application User" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "Premium App User") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handlePremiumAppUser();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="Premium App User" />
                                    </ListItemButton>
                                  }
                                  {user.pagePermissions.findIndex(c => c.title == "System Blocked User") > -1 &&
                                    <ListItemButton
                                      sx={{ pl: 4 }}
                                      onClick={() => {
                                        handleSystemBlockedUsers();
                                        closeSidebar();
                                      }}
                                    >
                                      <ListItemText primary="System Blocked User" />
                                    </ListItemButton>
                                  }
                                </List>
                              </Collapse>
                            </>
                          }
                        </List>
                      </SubMenuWrapper>
                    </List>
                    {user.pagePermissions.findIndex(c => c.title == "Setting") > -1 &&
                      <ListItem component="div">
                        <Button
                          disableRipple
                          component={RouterLink}
                          onClick={closeSidebar}
                          to="/admin/setting"
                          startIcon={<SettingsIcon />}
                        >
                          Setting
                        </Button>
                      </ListItem>
                    }
                  </List>
                  : <></>}
              </>}

          </SubMenuWrapper >
        </List >
      </MenuWrapper >
      {/* <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Master Entry
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/admin/religion"
                  startIcon={<SynagogueIcon />}
                >
                  Religion
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/admin/community"
                  startIcon={<TempleHinduSharpIcon />}
                >
                  Community
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/admin/subcommunity"
                  startIcon={<PeopleIcon />}
                >
                  Sub Community
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/admin/marital"
                  startIcon={<FavoriteIcon />}
                >
                  Marital Status
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/admin/employment"
                  startIcon={<BadgeIcon />}
                >
                  Employment
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/admin/occupation"
                  startIcon={<AssignmentInd />}
                >
                  Occupation
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/admin/education"
                  startIcon={<School />}
                >
                  Education
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/admin/diet"
                  startIcon={<DiningIcon />}
                >
                  Diet
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/admin/height"
                  startIcon={<HeightIcon />}
                >
                  Height
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/admin/income"
                  startIcon={<CurrencyRupeeIcon />}
                >
                  Income
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List> */}
    </>
  );
}

export default SidebarMenu;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import {
  Divider,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import CssBaseline from '@material-ui/core/CssBaseline';
import { setIsDrawerOpen } from '../redux/slices/drawer';

const drawerWidth = 240;

// Define styles for this component
const useStyles = makeStyles((theme) => ({
  button: {
    '&:active': {
      outline: 'none',
    },
    '&:blur': {
      outline: 'none',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  title: {
    flexGrow: 1,
  },
  linkDefault: {
    'color': 'inherit',
    'textDecoration': 'none',
    '&:hover': {
      color: 'inherit',
      textDecoration: 'none',
    },
  },
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    display: 'flex',
    flexDirection: 'column',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Navigation() {
  // Use the styles
  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();

  const isDrawerOpen = useSelector((state) => state.drawer.isOpen);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // List of options in the drawer
  const list = [
    { type: 'entry', title: 'Home', to: '/home', icon: <HomeIcon /> },
    { type: 'entry', title: 'Dashboard', to: '/dashboard', icon: <DashboardIcon /> },
  ];
  // List of options in the drawer which will be shown at bottom
  const listBottom = [
    {
      type: 'entry',
      title: `${isLoggedIn ? 'Logout' : 'Login'}`,
      to: `${isLoggedIn ? '/auth/logout' : '/auth'}`,
      icon: isLoggedIn ? <LockIcon /> : <LockOpenIcon/>,
      color: isLoggedIn ? 'red' : 'green',
    },
  ];

  // Open/close the side navigation drawer
  const toggleDrawer = (open) => (event) => {
    if (
      event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    dispatch(setIsDrawerOpen(open));
  };

  return (
    <div className={classes.root}>
      <CssBaseline />

      {/* Top nav bar */}
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          {/* Branding */}
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.linkDefault}>
                Fark
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Side navigation drawer */}
      <Drawer
        anchor={'left'}
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: isDrawerOpen,
          [classes.drawerClose]: !isDrawerOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: isDrawerOpen,
            [classes.drawerClose]: !isDrawerOpen,
          }),
        }}
      >
        <div className={classes.toolbar} />

        {/* List all the options to be shown in the drawer */}
        <List component="nav" style={{ width: '100%', flexGrow: 1 }}>
          {list.map((item, pos) => {
            // Render divider
            if (item.type === 'divider') {
              return (
                <Divider key={pos}/>
              );
            };

            // Render link
            return <Link
              key={pos}
              to={{ pathname: item.to, state: { from: location.pathname } }}
              className={classes.linkDefault}
            >
              <ListItem button selected={location.pathname.startsWith(item.to)}>
                <ListItemIcon style={{ color: item.color || 'black' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            </Link>;
          })}
        </List>

        <Divider/>
        {/* List all the options to be shown to the drawer's bottom */}
        <List component="nav" style={{ width: '100%' }}>
          {listBottom.map((item, pos) => {
            // Render divider
            if (item.type === 'divider') {
              return (
                <Divider key={pos} />
              );
            };

            // Render link
            return <Link
              key={pos}
              to={{ pathname: item.to, state: { from: location.pathname } }}
              className={classes.linkDefault}
            >
              <ListItem
                button
                selected={location.pathname.startsWith(item.to)}>
                <ListItemIcon style={{ color: item.color || 'black' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            </Link>;
          })}
        </List>

        <Divider />
        {/* Toggle drawer open */}
        <div style={
          { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '4px' }
        }>
          <IconButton onClick={toggleDrawer(!isDrawerOpen)}>
            {isDrawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
      </Drawer>
    </div>
  );
}

export default Navigation;

/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import { AppBar, Box } from "@mui/material";
import "../NavbarComponent/Navbar.css";
import { useTheme, useMediaQuery } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import NavDrawer from "./NavDrawer";
import SoundLogo from "../../assets/sound.png";


export default function Navbar({ handleFavNavigation, handleLoginNavigation }) {
  // state for keeping the value of the tab
  const [tabValue, setTabValue] = useState(0);

  //setting state for opening and closing drawer
  const [openDrawer, setOpenDrawer] = useState(true);
  const theme = useTheme();

  const isMatch = useMediaQuery(theme.breakpoints.down("sm"));


 //Function to set value of the tab or option for navigation bar

  const handleChange = ( event, newValue) => {
    setTabValue(newValue);
  };


  const navigate = useNavigate();
  useEffect(() => {
    if (tabValue === 0) navigate("/");
    if (tabValue === 1) {
      navigate("/favourites");
      handleFavNavigation();
    }
    if (tabValue === 2) {
      navigate("/signup");
    handleLoginNavigation();}
  }, [tabValue]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        className="navbar"
        position="fixed"
        sx={{ height: "6rem", width: "100%" }}
      >
        <div className="nav--container">
          <div className="title--image">
            <Link to="/">
              <img src={SoundLogo} className="podcast--logo" />
            </Link>
            <p>Podcast Hub</p>
          </div>
          {!isMatch && (
            <Tabs
              className="tabs"
              textColor="secondary"
              value={tabValue}
              onChange={handleChange}
              sx={{
                "& button": { borderRadius: 2 },
                "& button:hover": { backgroundColor: "#008033" },
                "& button:focus": { backgroundColor: "white" },
                ml: "15rem",
              }}
            >
              <Tab
                icon={<HomeIcon />}
                iconPosition="top"
                sx={{ color: "white" }}
                label="Home"
              />
              <Tab
                icon={<FavoriteIcon />}
                iconPosition="top"
                sx={{ color: "white" }}
                label="Favourites"
              />
              <Tab
                icon={<PersonIcon />}
                iconPosition="top"
                sx={{ color: "white" }}
                label="Login"
              />
            </Tabs>
          )}
          <MenuIcon
            onClick={setOpenDrawer}
            sx={{ m: "auto", cursor: "pointer", pr: "1rem", mr: "3.5rem" }}
          />
        </div>
      </AppBar>
      {isMatch && (
        <NavDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      )}
    </Box>
  );
}


import { useNavigate } from "react-router-dom";
import theme from "../../utils/theme";
import { Drawer, List, ListItemText, ListItem } from "@mui/material";
import { ListItemIcon } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";

export default function NavDrawer(props) {
  // eslint-disable-next-line react/prop-types
  const { openDrawer, setOpenDrawer } = props;

  const navigate = useNavigate();

  const navigation = (link) => {
    navigate(`/${link}`);
  };

  return (
    <Drawer
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.primary.main,
        },
      }}
      open={openDrawer}
      onClose={() => setOpenDrawer(false)}
      anchor="right"
    >
      <List sx={{ color: "white" }}>
        <ListItem>
          <ListItemIcon>
            <HomeIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            sx={{ cursor: "pointer" }}
            onClick={() => navigation("")}
            primary="Home"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon >
            <FavoriteIcon sx={{ color: "white" }}/>
          </ListItemIcon>
          <ListItemText
            sx={{ cursor: "pointer" }}
            onClick={() => navigation("favourites")}
            primary="Favourites"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PersonIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            sx={{ cursor: "pointer" }}
            onClick={() => navigation("login")}
            primary="Login"
          />
        </ListItem>
      </List>
    </Drawer>
  );
}

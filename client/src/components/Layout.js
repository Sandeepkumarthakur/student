import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { AppBar, CssBaseline } from "@mui/material";
import Appbar from "./Appbar";
import { Outlet, useNavigate } from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Layout() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const id = localStorage.getItem("id");
    const name = localStorage.getItem("name");
    if (!token || !name || !id || !email) {
      navigate("/auth/login");
    }
  }, [navigate]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ width: "100%" }}>
        <Appbar />
      </Box>

      <Outlet />
    </Box>
  );
}

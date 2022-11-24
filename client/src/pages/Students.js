import {
  Alert,
  Card,
  CardContent,
  CssBaseline,
  Grid,
  IconButton,
  Input,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import axios from "axios";
import React, { useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";

function Students() {
  const [query, setQuery] = React.useState("");
  const [students, setStudents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const search = async () => {
    try {
      setLoading(true);
      var url;
      console.log(query);
      if (query.trim() === "") {
        url = "http://localhost:8080/students";
      } else {
        url = "http://localhost:8080/students?query=" + query;
      }
      const res = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(res);

      if (res.data.status) {
        console.log(res);
        setStudents([...res.data.data]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    search();
  }, []);
  return (
    <Container>
      <CssBaseline />
      <Grid>
        <Grid container>
          <Grid item xs={9}></Grid>
          <Grid item xs={3} display={"flex"} justifyContent={"center"}>
            <Box mt={2}>
              <TextField
                id='outlined-basic'
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                label='Search'
                variant='outlined'
              />
              <IconButton onClick={search}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Grid mt={2}>
          {loading ? (
            <LinearProgress />
          ) : (
            <Box
              display={"flex"}
              flexDirection='column'
              justifyContent={"space-between"}
            >
              {students.length === 0 && (
                <Alert severity='info'>No Student found</Alert>
              )}
              {students.map((s, i) => (
                <Card sx={{ minWidth: 275 }} style={{ marginTop: "10px" }}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color='text.secondary'
                      gutterBottom
                    >
                      {s.first_name + " " + s.last_name}
                    </Typography>
                    <Typography variant='h5' component='div'></Typography>
                    <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                      {s.location}
                    </Typography>
                    {/* <Typography variant='body2'>
              <br />
              {'"a benevolent smile"'}
            </Typography> */}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Students;

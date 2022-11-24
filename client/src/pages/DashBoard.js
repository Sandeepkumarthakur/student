import { LinearProgress, Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Box } from "@mui/system";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: "Chart.js Bar Chart - Stacked",
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const labels = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Gurugram",
];

function DashBoard() {
  const [pass, setPass] = useState(0);
  const [fail, setFail] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataP, setDataP] = useState([0, 0, 0, 0, 0, 0]);
  const [dataF, setDataF] = useState([0, 0, 0, 0, 0, 0]);

  const [passFail, setPassFail] = useState({
    labels: ["Pass", "Fail"],
    datasets: [
      {
        label: "Result",
        data: [12, 19],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  });
  const [data, setData] = useState({
    labels,
    datasets: [
      {
        label: "Pass",
        data: [100, 100],
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: "Fail",
        data: [200, 300],
        backgroundColor: "rgb(75, 192, 192)",
      },
    ],
  });
  const getData = async () => {
    let p = 0;
    let f = 0;
    try {
      const res = await axios.get("http://localhost:8080/passfail", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(res.data);
      if (res?.data?.status) {
        f = res.data.data[0].c;
        p = res.data.data[1].c;
      }
    } catch (err) {
    } finally {
      setPassFail({
        labels: ["Pass", "Fail"],
        datasets: [
          {
            label: "Result",
            data: [p, f],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      });
    }
  };
  const getDataLoc = async () => {
    try {
      const res = await axios.get("http://localhost:8080/passfailloc", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res?.data?.status) {
        let dp = 0,
          df = 0,
          mf = 0,
          mp = 0,
          hf = 0,
          hp = 0,
          cf = 0,
          cp = 0,
          gf = 0,
          gp = 0,
          bf = 0,
          bp = 0;
        res.data.data.map((_) => {
          if (_.location === "Delhi") {
            if (_.status === "PASS") {
              dp = _.c;
            } else {
              df = _.c;
            }
          }
          if (_.location === "Mumbai") {
            if (_.status === "PASS") {
              mp = _.c;
            } else {
              mf = _.c;
            }
          }
          if (_.location === "Bangalore") {
            if (_.status === "PASS") {
              bp = _.c;
            } else {
              bf = _.c;
            }
          }
          if (_.location === "Hyderabad") {
            if (_.status === "PASS") {
              hp = _.c;
            } else {
              hf = _.c;
            }
          }
          if (_.location === "Chennai") {
            if (_.status === "PASS") {
              cp = _.c;
            } else {
              cf = _.c;
            }
          }
          if (_.location === "Gurugram") {
            if (_.status === "PASS") {
              gp = _.c;
            } else {
              gf = _.c;
            }
          }
          return _;
        });
        setData({
          labels,
          datasets: [
            {
              label: "Pass",
              data: [dp, bp, mp, hp, gp, cp],
              backgroundColor: "rgb(255, 99, 132)",
            },
            {
              label: "Fail",
              data: [df, bf, mf, hf, gf, cf],
              backgroundColor: "rgb(75, 192, 192)",
            },
          ],
        });
      }
    } catch (err) {}
  };

  useEffect(() => {
    setLoading(true);
    getData();
    getDataLoc();
    setLoading(false);
  }, []);

  if (loading)
    return (
      <Container>
        <LinearProgress />
      </Container>
    );
  return (
    <Container display='flex'>
      <Box sx={{ width: "40vw", height: "40vh" }}>
        <Bar options={options} data={data} />
      </Box>
      <Box mt={6} sx={{ width: "40vw", height: "40vh" }}>
        <Doughnut data={passFail} />
      </Box>
    </Container>
  );
}

export default DashBoard;

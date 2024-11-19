import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { BarChart } from "@mui/x-charts/BarChart";
import { supabase } from "./client";
import AvatarComponent from "./Avatar/AvatarComponent";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// import React, { useState, useEffect, useRef } from "react";

const chartSetting = {
  xAxis: [
    {
      label: "Student Vote Percentage",
    },
  ],

  width: 675,
  height: 400,
};

function Home() {
  const [candidates, setCandidates] = useState([]);
  const [voteCounts, setVoteCounts] = useState({});
  const [totalVoters, setTotalVoters] = useState(0);
  const [totalVoted, setTotalVoted] = useState(0);
  const [courseData, setCourseData] = useState([]);
  const [orderedPositions, setOrderedPositions] = useState([]);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchPositions = async () => {
      const { data, error } = await supabase
        .from("positions")
        .select("*")
        .order("position_order", { ascending: true });

      if (error) {
        console.error("Error fetching positions:", error);
        return;
      }

      // Store the ordered positions
      setOrderedPositions(data.map((position) => position.positions));
    };

    fetchPositions();
  }, []);

  // Fetch total number of users and users who have voted
  useEffect(() => {
    const fetchVoterStats = async () => {
      const { data: users, error: userError } = await supabase
        .from("users")
        .select("voteStatus, course");
      if (userError) {
        console.error("Error fetching user data:", userError);
        return;
      }

      const totalUsers = users.length;
      const votedUsers = users.filter(
        (user) => user.voteStatus === "voted"
      ).length;

      setTotalVoters(totalUsers);
      setTotalVoted(votedUsers);

      // Calculate the number of votes per course
      const courseVoteCounts = users.reduce((acc, user) => {
        const course = user.course || "Unknown";
        acc[course] = acc[course] || { total: 0, voted: 0 };
        acc[course].total += 1;
        if (user.voteStatus === "voted") {
          acc[course].voted += 1;
        }
        return acc;
      }, {});

      // Format data for BarChart
      const formattedData = Object.entries(courseVoteCounts).map(
        ([course, counts]) => ({
          course,
          voted: Math.round((counts.voted / counts.total) * 100),
        })
      );

      setCourseData(formattedData);
    };

    fetchVoterStats();
  }, []);

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const totalSeconds =
            prevTime.days * 86400 +
            prevTime.hours * 3600 +
            prevTime.minutes * 60 +
            prevTime.seconds;

          if (totalSeconds <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
          }
          const newDays = Math.floor((totalSeconds - 1) / 86400);
          const newHours = Math.floor((totalSeconds - 1) / 3600);
          const newMinutes = Math.floor(((totalSeconds - 1) % 3600) / 60);
          const newSeconds = (totalSeconds - 1) % 60;

          return {
            days: newDays,
            hours: newHours,
            minutes: newMinutes,
            seconds: newSeconds,
          };
        });
      }, 1000);
      setIsRunning(true);
    }
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setTime((prev) => ({
      ...prev,
      [name]: Math.max(0, Math.min(parseInt(value, 10) || 0, 59)),
    }));
  };

  // Fetch candidates from the database
  useEffect(() => {
    const fetchCandidates = async () => {
      const { data, error } = await supabase.from("candidates").select("*");
      if (error) {
        console.error("Error fetching candidates:", error);
        return;
      }
      setCandidates(data);
    };

    fetchCandidates();
  }, []);

  // Fetch vote counts for each candidate from the voteCountManage table
  useEffect(() => {
    const fetchVoteCounts = async () => {
      const { data, error } = await supabase
        .from("voteCountManage")
        .select("*");
      if (error) {
        console.error("Error fetching vote counts:", error);
        return;
      }
      const voteCountsMap = {};
      data.forEach((record) => {
        voteCountsMap[record.candidateVoteName] = record;
      });
      setVoteCounts(voteCountsMap);
    };

    fetchVoteCounts();
  }, []);

  // Group candidates by positions, ordered by `position_order`
  const groupedCandidates = orderedPositions.reduce((acc, position) => {
    const candidatesForPosition = candidates.filter(
      (candidate) => candidate.position === position
    );
    if (candidatesForPosition.length > 0) {
      acc[position] = candidatesForPosition;
    }
    return acc;
  }, {});

  const valueFormatter = (value) => `${value} %`;

  return (
    <div className="homeRow">
      <div className="navSpace"></div>

      <div className="homeContainer">
        <div className="timer">
          {/* <div className="timer1"><div className="timer1">
  {`${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(
    2,
    "0"
  )}:${String(time.seconds).padStart(2, "0")}`}
</div>
</div> */}
          <div className="timer1">
            <TextField
              label="Hours"
              type="number"
              name="hours"
              value={time.hours}
              onChange={handleTimeChange}
              InputProps={{ inputProps: { min: 0 } }}
              sx={{ width: "80px", marginRight: "10px" }}
              disabled={isRunning} // Disable when timer is running
            />
            <TextField
              label="Minutes"
              type="number"
              name="minutes"
              value={time.minutes}
              onChange={handleTimeChange}
              InputProps={{ inputProps: { min: 0, max: 59 } }}
              sx={{ width: "80px", marginRight: "10px" }}
              disabled={isRunning} // Disable when timer is running
            />
            <TextField
              label="Seconds"
              type="number"
              name="seconds"
              value={time.seconds}
              onChange={handleTimeChange}
              InputProps={{ inputProps: { min: 0, max: 59 } }}
              sx={{ width: "80px" }}
              disabled={isRunning} // Disable when timer is running
            />
          </div>

          <div className="timerBtn">
            <Button
              style={{ width: "100%" }}
              variant="outlined"
              sx={{
                borderWidth: "5px",
                color: isRunning ? "red" : "#1ab394",
                // backgroundColor: isRunning ? "red" : "#fff",
                "&:hover": {
                  backgroundColor: isRunning ? "red" : "#1ab394",
                  color: "#fff",
                },
                borderColor: isRunning ? "red" : "#1ab394",
                borderRadius: "10px",
                fontSize: "2rem",
                height: "70px",
              }}
              onClick={handleStartStop}
            >
              {isRunning ? "STOP" : "START"}
            </Button>
          </div>
        </div>
        {/* <div className="voters">
          <label className="numVoter">
            <Gauge
              width={100}
              height={100}
              value={totalVoters}
              valueMin={0}
              valueMax={totalVoters || 1} // Avoid division by zero
              sx={(theme) => ({
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 20,
                },
                [`& .${gaugeClasses.valueText} text`]: {
                  fill: "#1ab394",
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: "#1ab394",
                },
              })}
            />
            Student Voters
          </label>

          <label className="numVoted">
            <Gauge
              width={100}
              height={100}
              value={totalVoted}
              valueMin={0}
              valueMax={totalVoters || 1} // Same max as totalVoters
              sx={(theme) => ({
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 20,
                },
                [`& .${gaugeClasses.valueText} text`]: {
                  fill: "#1ab394",
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: "#1ab394",
                },
              })}
            />
            Student Voted
          </label>
        </div> */}

        <div className="charts">
          <div className="chart1">
            <BarChart
              // margin={{
              //   left: 20,
              //   right: 0,
              //   top: 0,
              //   bottom: 0,
              // }}
              //  width={400}
              //  height={100}
              dataset={courseData}
              yAxis={[{ scaleType: "band", dataKey: "course" }]}
              series={[
                {
                  dataKey: "voted",
                  label: "Students Participated",
                  valueFormatter,
                  color: "#1ab394",
                },
              ]}
              layout="horizontal"
              grid={{ vertical: true, horizontal: true }}
              {...chartSetting}
              borderRadius={50}
            />
          </div>
          <div className="chart2">
            <div className="voters">
              <label className="numVoter">
                <Gauge
                  width={100}
                  height={100}
                  value={totalVoters}
                  valueMin={0}
                  valueMax={totalVoters || 1}
                  sx={(theme) => ({
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 20,
                    },
                    [`& .${gaugeClasses.valueText} text`]: {
                      fill: "#1ab394",
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: "#1ab394",
                    },
                  })}
                />
                Student Voters
              </label>

              <label className="numVoted">
                <Gauge
                  width={100}
                  height={100}
                  value={totalVoted}
                  valueMin={0}
                  valueMax={totalVoters || 1}
                  sx={(theme) => ({
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 20,
                    },
                    [`& .${gaugeClasses.valueText} text`]: {
                      fill: "#1ab394",
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: "#1ab394",
                    },
                  })}
                />
                Student Voted
              </label>
            </div>
            <div className="chart22">
              <div>
                <TextField
                  sx={{ width: "30ch" }}
                  label="Subject"
                  id="outlined-size-small"
                  size="small"
                  required
                  autoComplete="off"
                  value={"LC STUDENT ELECTION"}
                />
              </div>
              <div>
                <Box
                  component="form"
                  sx={{ "& .MuiTextField-root": { m: 1, width: "30ch" } }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <TextField
                      id="outlined-multiline-static"
                      label="Message"
                      multiline
                      rows={6}
                      required
                      value={
                        "Hello {name} <br/> The election for Student Council has Started <br/> <br/> From<br/> BSIT 4B Researchers"
                      }
                    />
                  </div>
                </Box>
              </div>
            </div>
          </div>
        </div>

        <div className="listContainer homeListContainer">
          <div>
            <h2 className="topLabel homeTopLabel">CANDIDATES</h2>
          </div>
          <div>
            {Object.keys(groupedCandidates).map((position) => (
              <div key={position}>
                <h3 className="HomePosition">
                  {position
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .toUpperCase()}
                </h3>
                <div className="HomeprofileContainer">
                  <div>
                    {groupedCandidates[position].map((candidate) => {
                      const candidateVoteData =
                        voteCounts[candidate.candidateID] || {};
                      // const totalVotes = Object.values(candidateVoteData).reduce(
                      //   (sum, value) =>
                      //     sum + (typeof value === "number" ? value : 0),
                      //   0
                      // );
                      return (
                        <div
                          key={candidate.candidateID}
                          className="HomeCandidate"
                        >
                          <div className="HomeprofileRow">
                            <div>
                              <AvatarComponent
                                imgStyle={{
                                  height: "55px",
                                  width: "55px",
                                  borderRadius: "50%",
                                }}
                                imgSrc={candidate.avatarUrl}
                              />
                            </div>
                          </div>
                          <div>
                            <BarChart
                              layout="horizontal"
                              width={850}
                              height={70}
                              leftAxis={null}
                              bottomAxis={null}
                              slotProps={{ legend: { hidden: true } }}
                              margin={{
                                left: 20,
                                right: 0,
                                top: 0,
                                bottom: 0,
                              }}
                              series={[
                                {
                                  data: [candidateVoteData.BSIT || 0],
                                  stack: "total",
                                  color: "#1ab394",
                                  label: "BSIT",
                                  tooltip: {
                                    label: `BSIT: ${
                                      candidateVoteData.BSIT || 0
                                    }`,
                                  },
                                },
                                {
                                  data: [candidateVoteData.BSCS || 0],
                                  stack: "total",
                                  color: "#00796B",
                                  label: "BSCS",
                                  tooltip: {
                                    label: `BSCS: ${
                                      candidateVoteData.BSCS || 0
                                    }`,
                                  },
                                },
                                {
                                  data: [candidateVoteData.BSCA || 0],
                                  stack: "total",
                                  color: "#1ab394",
                                  label: "BSCA",
                                  tooltip: {
                                    label: `BSCA: ${
                                      candidateVoteData.BSCA || 0
                                    }`,
                                  },
                                },
                                {
                                  data: [candidateVoteData.BSBA || 0],
                                  stack: "total",
                                  color: "#00796B",
                                  label: "BSBA",
                                  tooltip: {
                                    label: `BSBA: ${
                                      candidateVoteData.BSBA || 0
                                    }`,
                                  },
                                },
                                {
                                  data: [candidateVoteData.BSHM || 0],
                                  stack: "total",
                                  color: "#1ab394",
                                  label: "BSHM",
                                  tooltip: {
                                    label: `BSHM: ${
                                      candidateVoteData.BSHM || 0
                                    }`,
                                  },
                                },
                                {
                                  data: [candidateVoteData.BSTM || 0],
                                  stack: "total",
                                  color: "#00796B",
                                  label: "BSTM",
                                  tooltip: {
                                    label: `BSTM: ${
                                      candidateVoteData.BSTM || 0
                                    }`,
                                  },
                                },
                                {
                                  data: [candidateVoteData.BSED || 0],
                                  stack: "total",
                                  color: "#1ab394",
                                  label: "BSED",
                                  tooltip: {
                                    label: `BSED: ${
                                      candidateVoteData.BSED || 0
                                    }`,
                                  },
                                },
                                {
                                  data: [candidateVoteData.BSE || 0],
                                  stack: "total",
                                  color: "#00796B",
                                  label: "BSE",
                                  tooltip: {
                                    label: `BSE: ${candidateVoteData.BSE || 0}`,
                                  },
                                },
                                {
                                  data: [candidateVoteData.BSPSY || 0],
                                  stack: "total",
                                  color: "#1ab394",
                                  label: "BSPSY",
                                  tooltip: {
                                    label: `BSPSY: ${
                                      candidateVoteData.BSPSY || 0
                                    }`,
                                  },
                                },
                                {
                                  data: [candidateVoteData.BSCRIM || 0],
                                  stack: "total",
                                  color: "#00796B",
                                  label: "BSCRIM",
                                  tooltip: {
                                    label: `BSCRIM: ${
                                      candidateVoteData.BSCRIM || 0
                                    }`,
                                  },
                                },
                                {
                                  data: [
                                    totalVoted -
                                      (candidateVoteData.BSIT +
                                        candidateVoteData.BSCS +
                                        candidateVoteData.BSCA +
                                        candidateVoteData.BSBA +
                                        candidateVoteData.BSHM +
                                        candidateVoteData.BSTM +
                                        candidateVoteData.BSED +
                                        candidateVoteData.BSE +
                                        candidateVoteData.BSPSY +
                                        candidateVoteData.BSCRIM),
                                  ],
                                  stack: "total",
                                  color: "#fff",
                                  // label: "Total Voters",
                                  // tooltip: {
                                  //   label: `BSCRIM: ${
                                  //     candidateVoteData.BSCRIM || 0
                                  //   }`,
                                  // },
                                },
                                // Other courses go here
                              ]}
                              yAxis={[
                                {
                                  scaleType: "band",
                                  data: [
                                    `${candidate.name} =${
                                      candidateVoteData.BSIT +
                                      candidateVoteData.BSCS +
                                      candidateVoteData.BSCA +
                                      candidateVoteData.BSBA +
                                      candidateVoteData.BSHM +
                                      candidateVoteData.BSTM +
                                      candidateVoteData.BSED +
                                      candidateVoteData.BSE +
                                      candidateVoteData.BSPSY +
                                      candidateVoteData.BSCRIM
                                    }`,
                                  ],
                                  categoryGapRatio: 0.8,
                                },
                              ]}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

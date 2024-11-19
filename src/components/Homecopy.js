import React, { useState, useEffect } from "react";
import "../App.css";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { BarChart } from "@mui/x-charts/BarChart";
import { supabase } from "./client";
import { dataset, valueFormatter } from "./dataset/courses";
// import { ChartsSurface } from "@mui/x-charts/ChartsSurface";
import {
  BSIT,
  BSCS,
  BSCA,
  BSBA,
  BSHM,
  BSTM,
  BSE,
  BSED,
  BSPSY,
  BSCRIM,
  SPACE,
} from "./dataset/poll";
import AvatarComponent from "./Avatar/AvatarComponent";

const chartSetting = {
  xAxis: [
    {
      label: "Student Vote Percentage",
    },
  ],
  width: 500,
  height: 400,
};

function Home() {
  const [candidates, setCandidates] = useState([]);

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

  const groupedCandidates = candidates.reduce((acc, candidate) => {
    acc[candidate.position] = acc[candidate.position] || [];
    acc[candidate.position].push(candidate);
    return acc;
  }, {});

  return (
    <div className="homeRow">
      <div className="navSpace"></div>

      <div className="homeContainer">
        <div className="voters">
          <label className="numVoter">
            <Gauge
              width={100}
              height={100}
              value={400}
              valueMin={10}
              valueMax={400}
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
              value={250}
              valueMin={10}
              valueMax={400}
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

        <div className="charts">
          <div className="chart1">
            <BarChart
              dataset={dataset}
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
              grid={{ vertical: true }}
              {...chartSetting}
              borderRadius={50}
            />
          </div>
          <div className="chart2"></div>
        </div>

        {}
        <div className="listContainer">
          <div>
            <h2 className="topLabel">CANDIDATES</h2>
          </div>
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
                  {groupedCandidates[position].map((candidate, index) => (
                    <div key={index}>
                      <div className="HomeCandidate">
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
                              { ...BSIT, stack: "total", color: "#1ab394" },
                              { ...BSCS, stack: "total", color: "#00a695" },
                              { ...BSCA, stack: "total", color: "#009995" },
                              { ...BSBA, stack: "total", color: "#008b91" },
                              { ...BSHM, stack: "total", color: "#0b7e8b" },
                              { ...BSTM, stack: "total", color: "#1c7183" },
                              { ...BSE, stack: "total", color: "#276479" },
                              { ...BSE, stack: "total", color: "#2d576c" },
                              { ...BSED, stack: "total", color: "#304b5f" },
                              { ...BSPSY, stack: "total", color: "#303f50" },
                              { ...BSCRIM, stack: "total", color: "#272f3f" },
                              {
                                ...SPACE,
                                stack: "total",
                                // valueFormatter,
                                color: "#fff",
                                backgroundColor: "#1ab394",
                                // color: "rgba(255, 255, 255, 0)", // Fully transparent white color
                                // data: [30], // Keep the data value to affect the layout
                                label: "", // Hide label for SPACE
                                // tooltip: { enabled: false }, // Optionally disable tooltip for SPACE
                              },
                            ]}
                            yAxis={[
                              {
                                scaleType: "band",
                                data: [candidate.name],
                                categoryGapRatio: 0.8,

                                // barGapRatio: 1.6,
                              },
                            ]}
                          />
                        </div>

                        {/* <div className="HomeCandidateName">
                          <div>
                            <p>{candidate.name}</p>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
                <div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

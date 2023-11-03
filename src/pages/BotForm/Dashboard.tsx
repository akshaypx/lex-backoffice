import React, { useEffect } from "react";
import styles from "./Dashboard.module.scss";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import { fetchSlots } from "../../store/slice/slotSlice";
import { PulseLoader } from "react-spinners";
import {
  fetchIntentMetrics,
  fetchUtteranceAnalyticsData,
  fetchUtteranceMetrics,
} from "../../store/slice/analyticsSlice";
import PieChat from "../../components/PieChat/PieChat";
import HorizontalBar from "../../components/HorizontalBar/HorizontalBar";
import BasicChart from "../../components/BasicChart/BasicChart";
import { Card } from "primereact/card";

const Dashboard = () => {
  const dispatch = useAppDispatch();

  const loadingIntent = useAppSelector(
    (state: RootState) => state.analytics.loading
  );
  const intentMetrics = useAppSelector(
    (state: RootState) => state.analytics.intentMetrics
  );
  const utteranceMetrics = useAppSelector(
    (state: RootState) => state.analytics.utteranceMetrics
  );
  const utteranceAnalyticsData = useAppSelector(
    (state: RootState) => state.analytics.utteranceAnalyticsData
  );
  const { understoodUtterances, intentDistribution, slotUsage } =
    useAppSelector((state: RootState) => state.analytics);

  // const [utterancesUnderstood, setUtterancesUnderstood] = useState(0);
  const totalUtterances = utteranceAnalyticsData?.utterances?.length || 0;
  const notUnderstoodUtterances = totalUtterances - understoodUtterances;

  useEffect(() => {
    dispatch(fetchSlots());
    dispatch(fetchIntentMetrics());
    dispatch(fetchUtteranceMetrics());
    dispatch(fetchUtteranceAnalyticsData());
  }, [dispatch]);

  // console.log(slotData);

  return (
    <>
      <div className={styles.parentContainer}>
        <div className={styles.container}>
          <div className={styles.card}>
            <Card
              className={styles.cardSpacing}
              title="User Answer Analytics Data"
            >
              <div className={styles.grid}>
                {loadingIntent === "pending" && (
                  <div className={styles.loading}>
                    <PulseLoader
                      color="rgb(108, 108, 255)"
                      size={10}
                      speedMultiplier={1}
                    />
                  </div>
                )}
                {loadingIntent === "succeeded" && utteranceAnalyticsData && (
                  <>
                    <div className={styles.chartCard}>
                      <b>Answers Distribution</b>
                      <PieChat
                        labels={["Understood", "Not Understood"]}
                        dataArray={[
                          understoodUtterances,
                          notUnderstoodUtterances,
                        ]}
                      />
                    </div>

                    <div className={styles.chartCard}>
                      <b>Categories Answered Most</b>
                      <HorizontalBar
                        dataSetName="Answers"
                        labels={Object.keys(slotUsage)}
                        dataArray={Object.values(slotUsage)}
                      />
                    </div>

                    <div className={styles.chartCard}>
                      <b>Input Intent Distribution</b>
                      <BasicChart
                        labels={Object.keys(intentDistribution)}
                        dataArray={Object.values(intentDistribution)}
                      />
                    </div>
                    {/* RESPONSE Types HIDDEN  */}
                    {/* <div className={styles.chartCard}>
                    <b>Response Types</b>
                    <HorizontalBar
                      dataSetName="Response Types"
                      labels={Object.keys(responseTypes)}
                      dataArray={Object.values(responseTypes)}
                    />
                  </div> */}
                  </>
                )}
              </div>
            </Card>
            <Card className={styles.cardSpacing} title="User Intent Metrics">
              <div className={styles.grid}>
                {loadingIntent === "pending" && (
                  <div className={styles.loading}>
                    <PulseLoader
                      color="rgb(108, 108, 255)"
                      size={10}
                      speedMultiplier={1}
                    />
                  </div>
                )}
                {loadingIntent === "succeeded" &&
                  intentMetrics &&
                  intentMetrics!.results &&
                  intentMetrics!.results[0].metricsResults?.map((val, i) => (
                    <div className={styles.dashCard} key={i}>
                      <b>{val.name}</b>
                      <p>
                        {val.value}
                        <i>({val.statistic})</i>
                      </p>
                    </div>
                  ))}
              </div>
            </Card>
            <Card className={styles.cardSpacing} title="User Answer Metrics">
              <div className={styles.grid}>
                {loadingIntent === "pending" && (
                  <div className={styles.loading}>
                    <PulseLoader
                      color="rgb(108, 108, 255)"
                      size={10}
                      speedMultiplier={1}
                    />
                  </div>
                )}
                {loadingIntent === "succeeded" &&
                  utteranceMetrics &&
                  utteranceMetrics!.results &&
                  utteranceMetrics!.results[0].metricsResults?.map((val, i) => (
                    <div className={styles.dashCard} key={i}>
                      <b>{val.name}</b>
                      <p>
                        {val.value}
                        <i>({val.statistic})</i>
                      </p>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

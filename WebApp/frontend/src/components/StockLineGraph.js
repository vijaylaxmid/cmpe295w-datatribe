import React, { useEffect, useState } from 'react'
import apiClient from "../libs/apiClient";
import { Line } from 'react-chartjs-2';

const StockLineGraph = (props) => {

    const [trend, setTrend] = useState({
        labels: [],
        datasets: [
            {
                label: 'Close',
                fill: false,
                backgroundColor: 'rgba(75,192,192,1)',
                // borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: []
            }
        ]
    })

    useEffect(() => {
        async function fetchData() {
            const stocks = await apiClient(`/api/stock/predictions?symbol=${props.stockTicker}`, { method: "GET" });
            const trend = {
                labels: stocks ? Object.keys(stocks).slice(-60) : [],
                datasets: [
                    {
                        label: 'Actual',
                        fill: false,
                        backgroundColor: 'rgba(75,192,192,1)',
                        // borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 2,
                        data: Object.values(stocks).map((d) => {
                            return d.true_adj_close_1_days
                        }).slice(-60).slice(0, -1)
                    },
                    {
                        label: 'Prediction',
                        fill: false,
                        backgroundColor: '#FF7F50',
                        // borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 2,
                        data: Object.values(stocks).map((d) => {
                            return d.adj_close_1_days
                        }).slice(-60)
                    },
                    
                ],
                options: {
                    spanGaps: true,
                }
            }
            setTrend(trend);
        }
        fetchData();

        return () => {
            // cleanup
        }
    }, [])


    return (
        <div>
            <Line
                data={trend}
                width={100}
                height={35}></Line>
        </div>
    );
}

export default StockLineGraph;

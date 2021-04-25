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
            const stocks = await apiClient(`/api/stock/history?symbol=${props.stockTicker}`, { method: "GET" });
            const trend = {
                labels: stocks.Close ? Object.keys(stocks.Close).map(item => {
                    const dateString = new Date(Number(item)).toLocaleDateString();
                    return dateString
                }) : [],
                datasets: [
                    {
                        label: 'Close',
                        fill: false,
                        backgroundColor: 'rgba(75,192,192,1)',
                        // borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 2,
                        data: Object.values(stocks.Close)
                    },
                ]
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

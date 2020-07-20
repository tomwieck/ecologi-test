import React, { useEffect, useState, PureComponent } from 'react';

import { Treemap } from 'recharts';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";


// need to have original unchanged data,
// and a new array that can be modified and show in the current chart
// filteredTrees

// import {
//     LineChart,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Line,
// } from "recharts";
// pass in charting libray

// filter by date

// charting libray needed at all?

// 1 convert date formats into 'orderable' state - smaller momentjs react?
 /// done

// 2  allow filtering, assume this is possible with library
// pass in props of specific filters,
// one parent component which handles each childs overall state
// or does react provide a robust state system out the box
// if spare time, write this using a standalone component
// apply url filtering, pagination if time

// 3 show last month or specific times

// 4 timeline, be able to filter by trees from very specific dates
// remember work on blackbeard, date filters are usually complex types
// worth creating service that allows string to be passed in
// and a parsed date to be returned (getDateFromString(input) => output)


export function formatResults(results) {
  let total = 0;
  results.forEach(element => {
    element.createdAt = new Date(element.createdAt);
    total = element.value + total;
  });
  results.total = total;
  return results;
};

export default function GetTrees() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const selectedDate = new Date().toISOString().split("T")[0];
    console.log(selectedDate);

    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
        fetch("https://public.ecologi.com/trees")
            .then(res => res.json())
            .then(
                (result) => {
                  let results = result.splice(0, 100);

                  formatResults(results);

                  setIsLoaded(true);
                  setItems(results);
                },
                (error) => {
                    console.log(error)
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
          <div>
            <label htmlFor="start">Start date:</label>

            <input
              type="date"
              id="start"
              value={"2020-07-20"}
              min="2018-01-01"
              max="2018-12-31"
            />

            <label htmlFor="end">End date:</label>

            <input
              type="date"
              id="end"
              value={"2020-07-20"}
              min="2018-01-01"
              max="2018-12-31"
            />

            <LineChart
              width={1000}
              height={500}
              data={items}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="createdAt" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="total" stroke="#82ca9d" />
            </LineChart>
          </div>
        );
    }
}

import React, { useEffect, useState } from 'react';

import {
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Line,
} from "recharts";
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


                  //  createdAt: "2020-07-16T22:16:02.114Z"
                    // needs to be converted
                  //   value: 1;
                    // what does value mean? not unique

                  // values need to be added up (generateTotalTrees())
                  // and then saved in similar object matching the date

                  // for each item, take its value and add it to
                  // running total of previous value {
                      // totalTrees: totalTrees + value
                      // date: convertedDate )

                  // similar to this, use milestones from their website
                  setIsLoaded(true);
                  setItems(results);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
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
          // <ul>
          //     {items.map((item, index) => (
          //         <li key={index}>
          //             {item.value}
          //         </li>
          //     ))}
          // </ul>
          //   <LineChart width={500} height={300} data={items}>
          <LineChart width={1000} height={1000}  data={items}>
            <XAxis dataKey="createdAt" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        );
    }
}
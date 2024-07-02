import React, { useState } from "react";
import FactorContext from "./factorContext";
var XLSX = require("xlsx");

const FactorState = (props) => {
  const host = "http://localhost:5000"
  const factorsInitial = []
  const [factors, setFactors] = useState(factorsInitial)

  //Get all factors
  const getFactors = async () => {
    try {
      const response = await fetch(`${host}/api/factor/displayData`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
          "session-token":sessionStorage.getItem("session-token")
        },
      });

      if (!response.ok) {
        if ((response.status === 404 || response.status === 401) && window.location.pathname === '/main') {
          window.location.href = '/home'; 
        } else {
          throw new Error(`Failed to fetch factors: ${response.statusText}`);
        }
      }

      const blob = await response.blob();
      const reader = new FileReader();

      reader.onload = () => {
        const data = new Uint8Array(reader.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming the first sheet contains the data
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet);


        setFactors(excelData); // Update state with fetched data
      };

      reader.readAsArrayBuffer(blob);
    } catch (error) {
      console.error("Error fetching factors:", error);
    }
  };



  //Add a factor
  const addFactor = async (datalayer, noofclasses, classes, classpixel, floodpixel) => {
    try {
      //API call
      const response = await fetch(`${host}/api/factor/submitData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
          "session-token":sessionStorage.getItem("session-token")
        },

        body: JSON.stringify({datalayer, noofclasses, classes, classpixel, floodpixel }),
      });

      if (!response.ok) {
        if ((response.status === 404 || response.status === 401) && window.location.pathname === '/main') {
          window.location.href = '/home'; 
        } else {
          throw new Error(`Failed to add factors: ${response.statusText}`);
        }
      }
      const json = await response.json();
     
      const factor = {
        datalayer: json.datalayer,
        noofclasses: json.noofclasses,
        classes: json.classes,
        classpixel: json.classpixel,
        floodpixel: json.floodpixel,
        calculatedResult: json.calculatedResult,
        _id: json._id
      };

      setFactors(factors.concat(factor));
    } catch (error) {
      console.error("Error adding factor results:", error);

    }
  };


  // Download factor results
  const downloadFactorResults = async () => {
    try {
      const response = await fetch(`${host}/api/factor/displayData`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
          "session-token":sessionStorage.getItem("session-token")
        }
      });

      if (!response.ok) {
        if ((response.status === 404 || response.status === 401) && window.location.pathname === '/main') {
          window.location.href = '/home'; 
        } else {
          throw new Error(`Failed to download factors: ${response.statusText}`);
        }
      }

      const blob = await response.blob();

      // Create a URL for the blob data
      const url = window.URL.createObjectURL(blob);

      // Create a hidden <a> element
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "calculated_result.xlsx"; // Specify the filename

      // Append the <a> element to the document body
      document.body.appendChild(a);

      // Programmatically trigger a click event on the <a> element
      a.click();

      // Clean up: remove the <a> element and revoke the URL
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading factor results:", error);
    }
  };


  //Exit from a factorState
  const exitFactor = async () => {
    try {
      //API call
      const response = await fetch(`${host}/api/factor/exit`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
          "session-token":sessionStorage.getItem("session-token")

        },
      });
      if (!response.ok) {
        throw new Error('Failed to end session');
      } 
      await response.text();
    } catch (error) {
      console.error('Error ending session:', error.message);
    }
  };



  return (
    <FactorContext.Provider value={{ factors,addFactor, getFactors, downloadFactorResults, exitFactor }}>
      {props.children}
    </FactorContext.Provider>
  )
}


export default FactorState;
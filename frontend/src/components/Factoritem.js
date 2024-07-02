import React from 'react'

const Factoritem = ({ factor}) => {
  
  return (
    <tr>
      <td>{factor["SL.NO"]}</td>
      <td>{factor["Data Layer"]}</td>
      <td>{factor["Class"]}</td>
      <td>{factor["Class Pixel"]}</td>
      <td>{factor["Total Class Pixel"]}</td>
      <td>{factor["% Class Pixel"]}</td>
      <td>{factor["Flood Pixel"]}</td>
      <td>{factor["Total Flood Pixel"]}</td>
      <td>{factor["% Flood Pixel"]}</td>
      <td>{factor["FR"]}</td>
      <td>{factor["Total FR"]}</td>
      <td>{factor["RF"]}</td>
      <td>{factor["RF(NON%)"]}</td>
      <td>{factor["RF(INT)"]}</td>
      <td>{factor["Min RF"]}</td>
      <td>{factor["Max RF"]}</td>
      <td>{factor["MAX-MIN RF"]}</td>
      <td>{factor["(MAX-MIN)MIN RF"]}</td>
      <td>{factor["PR"]}</td>
    </tr>
  );
};




export default Factoritem

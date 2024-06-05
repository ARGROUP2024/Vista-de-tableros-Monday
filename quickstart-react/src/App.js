import React, { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";

const monday = mondaySdk();

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const query = `
    query {
      me {
        name
      }
      boards(ids: 6715436980) {
        name
        columns {
          title
          id
          type
        }
        groups {
          title
          id
        }
        items_page (query_params: {order_by:[{column_id:"name"}]}) {
          cursor
          items {
            id 
            name 
            
            column_values{           
              text             
            }
          }
        }
      }
    }`;

    fetch("https://api.monday.com/v2", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "",
      },
      body: JSON.stringify({
        query: query,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
      });
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }
  const items = data.boards[0].items_page.items;
  const columns= data.boards[0].columns;

  return (
    <div>
      <h1>Nombre del Usuario: {data.me.name}</h1>
      <h2>Nombre del Tablero: {data.boards[0].name}</h2>
      <h3>Columnas:</h3>
      <ul>
        {data.boards[0].columns.map((column) => (
          <li key={column.id}>
            {column.title} (Tipo: {column.type})
          </li>
        ))}
      </ul>
      <h3>Grupos:</h3>
      <ul>
        {data.boards[0].groups.map((group) => (
          <li key={group.id}>{group.title}</li>
        ))}
      </ul>
      <table>
        <thead>
          <tr>
          {columns.map((column)=>(
            <th key = {column.id}>
              {column.title}
            </th>

          ))}</tr>
          
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              {item.column_values.map((value, index) => (
                <td key={index}>{value.text}</td>
              ))}
              <td>{item.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
  </div>
  );
};
export default App;

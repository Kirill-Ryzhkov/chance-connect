import React, { useState } from 'react';
import Button from "../common/Button";
import "../../assets/css/body.css";

export const OrderTablesWithTabs = ({ orders, completeOrder, statusCafe, toggleCafe, clearHistory }) => {
  const [activeTab, setActiveTab] = useState(0);

  const orders1 = orders.filter(order => !order.complete);
  const orders2 = orders.filter(order => order.complete);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="table-container">
      <h2 className="text-2xl">Order Tables</h2>
      
      <div className="header">
        <div>
          <Button
            handleClick={toggleCafe}
            text={statusCafe ? 'Close Cafe' : 'Open Cafe'}
          />
          { activeTab === 1 && <Button
            handleClick={clearHistory}
            text={'Clear History'}
          />}
        </div>
        <div className="tabs">
          <button
            className={activeTab === 0 ? 'active' : 'text-black'}
            onClick={() => handleTabClick(0)}
          >
            Orders
          </button>
          <button
            className={activeTab === 1 ? 'active' : 'text-black'}
            onClick={() => handleTabClick(1)}
          >
            History
          </button>
        </div>
      </div>
      

      <div className="tab-content">
        {activeTab === 0 && (
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Order ID</th>
                <th>Ready</th>
              </tr>
            </thead>
            <tbody>
              {orders1.map((order, key) => (
                <tr key={key+1}>
                  <td>{key+1}</td>
                  <td>{order.name}</td>
                  <td>{order.id_number}</td>
                  <td>
                    <button onClick={() => completeOrder(order._id)}>Complete Order</button>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 1 && (
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Order ID</th>
              </tr>
            </thead>
            <tbody>
              {orders2.map((order, key) => (
                <tr key={key+1}>
                  <td>{key+1}</td>
                  <td>{order.name}</td>
                  <td>{order.id_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
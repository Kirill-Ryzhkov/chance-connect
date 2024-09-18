import React, { useState } from 'react';


export const OrderTablesWithTabs = ({ orders, updateOrders, completeOrder, statusCafe, toggleCafe, auth }) => {
  const [activeTab, setActiveTab] = useState(0);

  const orders1 = orders.filter(order => !order.complete);
  const orders2 = orders.filter(order => order.complete);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="table-container">
      <h2>Order Tables</h2>
      
      <div className="header">
        <div>
          <button className="redirect-button" onClick={toggleCafe}>{ statusCafe ? 'Close Cafe' : 'Open Cafe' }</button>
        </div>
        <div className="tabs">
          <button
            className={activeTab === 0 ? 'active' : ''}
            onClick={() => handleTabClick(0)}
          >
            Orders
          </button>
          <button
            className={activeTab === 1 ? 'active' : ''}
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
import React from "react";

export const SummaryOrder = ({ drinkType, selectedDrink, syrup = "", addOn = "", handleBack, handleFinish}) => {
    return (
        <>
            <h2>Your order</h2>
            <p>Type: {drinkType}</p>
            <p>Drink: {selectedDrink}</p>
            {drinkType === 'coffee' && (
                <>
                    <p>Syrup: {syrup}</p>
                    <p>Add-on: {addOn}</p>
                </>
            )}
            <div className="buttons-container">
                <button className="back-last-button" onClick={handleBack}>Back</button>
                <button className="finish-button" onClick={handleFinish}>Order</button>
            </div>
        </>
    )
}
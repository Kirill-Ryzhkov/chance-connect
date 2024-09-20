import React from "react";
import Button from "../common/Button";

export const SummaryOrder = ({ drinkType, selectedDrink, syrup = "", addOn = "", handleBack, handleFinish}) => {
    return (
        <div className="grid grid-col-1 w-full justify-items-center text-center items-center">
            <div className="bg-white text-black md:w-1/3 lg:w-1/4 xl:w-1/6 rounded p-3">
                <h2 className="text-4xl font-semibold">Your order</h2>
                <p className="text-xl">Type: {drinkType}</p>
                <p className="text-xl">Drink: {selectedDrink}</p>
                {drinkType === 'coffee' && (
                    <>
                        <p className="text-xl">Syrup: {syrup}</p>
                        <p className="text-xl">Add-on: {addOn}</p>
                    </>
                )}
            </div>
            <div className="flex justify-between">
                <Button handleClick={handleBack} text={"Back"} />
                <Button handleClick={handleFinish} text={"Finish"} />
            </div>
        </div>
    )
}
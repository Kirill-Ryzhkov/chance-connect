import React, { useState } from "react";
import '../../assets/css/cafe.css';
import { SummaryOrder } from "./SummaryOrder";
import { CafeGrid } from "./CafeGrid";
import { FinalOrder } from "./FinalOrder";
import { coffeeOrTea, coffeeList, teaList, syrupList, addOnList } from "../../assets/cafeList";

const API_URI = process.env.REACT_APP_BACKEND_API_URI;

const CafeMenu = ({ user, updateBalance, auth }) =>  {
    const [step, setStep] = useState(1);
    const [drinkType, setDrinkType] = useState('');
    const [selectedDrink, setSelectedDrink] = useState('');
    const [syrup, setSyrup] = useState('');
    const [addOn, setAddOn] = useState('');
    const [order, setOrder] = useState('');
    const [updatedBalance, setUpdatedBalance] = useState(false);

    const handleDrinkType = (type) => {
        setDrinkType(type);
        setStep(2);
    }

    const handleDrinkSelect = (drink) => {
        setSelectedDrink(drink);
        setStep(3);
    };

    const handleSyrup = (drink) => {
        setSyrup(drink);
        setStep(4);
    };

    const handleAddOn = (drink) => {
        setAddOn(drink);
        setStep(5);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const changeBalance = () => {
        const updatedUser = {
            ...user,
            balance: user.balance - 500
        };
        updateBalance(updatedUser);
        setUpdatedBalance(true);
    }

    const handleFinish = () => {
        setStep(step + 1);
        const url = `${API_URI}/order`;
        const header = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + auth
        };

        let orderName;
        if (drinkType === 'tea') {
            orderName = `${drinkType}, ${selectedDrink}`;
        } else {
            orderName = `${drinkType}, ${selectedDrink}, ${syrup}, ${addOn}`;
        }

        const body = {
            name: orderName
        };

        fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(body)
        })
            .then((response) => response.json())
            .then((data) => {
                setOrder(data.newOrder);
            })
            .catch((error) => console.error("Error:", error));
    }

    return (
        <div className="menu-container">
            {step === 1 && 
                <CafeGrid
                    options={coffeeOrTea}
                    onTileClick={handleDrinkType}
                    title="Choose the type of your drink"
                />
            }

            {step === 2 &&
                <CafeGrid
                    options={(drinkType === 'coffee' ? coffeeList : teaList)}
                    onTileClick={handleDrinkSelect}
                    title={"Choose the " + drinkType}
                    handleBack={handleBack}
                /> 
            }

            {step === 3 && drinkType === 'tea' &&
                <SummaryOrder
                    drinkType={drinkType}
                    selectedDrink={selectedDrink}
                    handleBack={handleBack}
                    handleFinish={handleFinish}
                />
            }

            {step === 3 && drinkType === 'coffee' &&
                <CafeGrid
                    options={syrupList}
                    onTileClick={handleSyrup}
                    title="Choose the syrup"
                    handleBack={handleBack}
                />
            }

            {step === 4 && drinkType === 'coffee' &&
                <CafeGrid
                    options={addOnList}
                    onTileClick={handleAddOn}
                    title="Choose the add-on"
                    handleBack={handleBack}
                />
            }

            {step === 5 &&
                <SummaryOrder 
                    drinkType={drinkType} 
                    selectedDrink={selectedDrink}
                    syrup={syrup}
                    addOn={addOn}
                    handleBack={handleBack}
                    handleFinish={handleFinish}
                />
            }

            {(step === 6 || (step === 4 && drinkType == 'tea')) &&
                <FinalOrder
                    order={order}
                    balance={changeBalance}
                />
            }


        </div>
    )
}

export default CafeMenu;
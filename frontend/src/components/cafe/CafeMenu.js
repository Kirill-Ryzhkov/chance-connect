import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SummaryOrder } from "./SummaryOrder";
import { CafeGrid } from "./CafeGrid";
import RedirectButton from "../common/RedirectButton";
import { coffeeOrTea, coffeeList, teaList, syrupList, addOnList } from "../../assets/cafeList";
import { useCreateOrderMutation } from "../../services/apiSlice";

const CafeMenu = ({ user, updateBalance, auth }) =>  {
    const [step, setStep] = useState(1);
    const [drinkType, setDrinkType] = useState('');
    const [selectedDrink, setSelectedDrink] = useState('');
    const [syrup, setSyrup] = useState('');
    const [addOn, setAddOn] = useState('');
    const [order, setOrder] = useState('');
    const [updatedBalance, setUpdatedBalance] = useState(false);

    const navigate = useNavigate();

    //  RTK Query хук для создания заказа
    const [createOrder] = useCreateOrderMutation();

    const handleDrinkType = (type) => {
        setDrinkType(type);
        setStep(2);
    };

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
        let newBalance;
        if (user.balance <= 500) {
            newBalance = 0;
        } else {
            newBalance = user.balance - 500;
        }
        const updatedUser = {
            ...user,
            balance: newBalance
        };
        updateBalance(updatedUser);
        setUpdatedBalance(true);
    };

    const handleFinish = async () => {
        setStep(step + 1);

        let orderName;
        if (drinkType === 'tea') {
            orderName = `${drinkType}, ${selectedDrink}`;
        } else {
            orderName = `${drinkType}, ${selectedDrink}, ${syrup}, ${addOn}`;
        }

        const orderData = {
            name: orderName
        };

        try {
            const response = await createOrder(orderData).unwrap(); // запрос через RTK Query
            setOrder(response.result);

            navigate("/done", {
                state: { order: response }
            });
        } catch (error) {
            console.error("Error:", error); // Обрабатываем ошибку
        }
    };

    return (
        <>
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
            </div>
            <div className="absolute bottom-10 left-20 z-50">
                <RedirectButton 
                    text={"Go Home"}
                    url={'/'}
                />
            </div>
        </>
    );
}

export default CafeMenu;

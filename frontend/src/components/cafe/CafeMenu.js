import React, { useState } from "react";
import '../../assets/css/cafe.css';
import { SummaryOrder } from "./SummaryOrder";
import { CafeGrid } from "./CafeGrid";
import { coffeeOrTea, coffeeList, teaList, syrupList, addOnList } from "../../assets/cafeList";

const CafeMenu = ({ user }) =>  {
    const [step, setStep] = useState(1);
    const [drinkType, setDrinkType] = useState('');
    const [selectedDrink, setSelectedDrink] = useState('');
    const [syrup, setSyrup] = useState('');
    const [addOn, setAddOn] = useState('');

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
                />
            }


        </div>
    )
}

export default CafeMenu;
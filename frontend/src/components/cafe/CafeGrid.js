import React from "react";
import Button from "../common/Button";

export const CafeGrid = ({ options, onTileClick,  title = "", handleBack = ""}) => {
    return (
        <div className="grid w-full text-center items-center justify-items-center">
            {title && <h2 className="text-3xl">{title}</h2>}
            <div className="grid grid-cols-2 gap-5 justify-items-center mt-5 md:w-1/2 lg:w-2/3 sm:w-3/4 xl:w-1/2">
                {options.map((option, index) => (
                    <div className="flex flex-col items-center lg:w-60 p-3 bg-white rounded shadow-md" onClick={() => onTileClick(option.name.toLowerCase())} key={index}>
                        <img src={option.imgSrc} alt={option.name} className="w-full h-full object-cover rounded" />
                        <div className="mt-3 text-lg text-black font-bold">{option.name}</div>
                    </div>
                ))}
            </div>
            {handleBack && <Button handleClick={handleBack} text={"Back"} />}
        </div>
    );
}
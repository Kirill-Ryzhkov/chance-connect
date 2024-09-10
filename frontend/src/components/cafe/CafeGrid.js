import React from "react";

export const CafeGrid = ({ options, onTileClick,  title = "", handleBack = ""}) => {
    return (
        <>
            {title && <h2>{title}</h2>}
            <div className="tiles-container">
                {options.map((option, index) => (
                <div className="tile" onClick={() => onTileClick(option.name.toLowerCase())} key={index}>
                    <img src={option.imgSrc} alt={option.name} className="drink-image" />
                    <div className="tile-title">{option.name}</div>
                </div>
                ))}
            </div>
            {handleBack && <button className="back-button" onClick={handleBack}>Back</button>}
        </>
    );
}
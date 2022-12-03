import React from "react";
import {UserData} from "../../contexts/UserData";

class AddNewDrinkSelector extends React.Component {

    static contextType = UserData;

    constructor(props) {
        super(props);
        this.state = {}



    }

    render() {
        return (
            <select className="New-drink-form-selector form-select" name="new_drink_selector" required>
                {this.props.drinks.map((drink, index) => {
                    return <option value={drink.alcoholPercent+"@"+index}
                                   key={index}>{drink.drinkName + " - " + (drink.drinkName==="RosieLand"?(drink.alcoholPercent * 100):parseInt(drink.alcoholPercent * 100)) + "%"}</option>
                })}
            </select>
        );

    }


}

export default AddNewDrinkSelector;
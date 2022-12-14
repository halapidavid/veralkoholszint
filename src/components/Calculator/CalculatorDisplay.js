import React from 'react';
import CalculatorPerMill from "./CalculatorPerMill";
import {UserData} from "../../contexts/UserData"
import CalculatedDrinks from "./CalculatedDrinks";
import CalculatorInfoBox from "./CalculatorInfoBox";
import {CalculateRemainingDrinksAfterElapsedTime} from "../../functions/CalculateElapsedTime";
import {CalculateAmount} from "../../functions/CalculateAmount";
import config from "../../config.json";


class CalculatorDisplay extends React.Component {

    static  contextType = UserData;

    constructor(props, context) {
        super(props);
        this.state = {}

        context.elapsedTime = null;
        context.lastUpdatedArray= Array(0);
        context.drinkIntervals = [];


       if(localStorage.getItem('personalData') !== null){

           let personalData = JSON.parse(localStorage.getItem('personalData'));
           context.weight = personalData.weight;
           context.gender = personalData.gender;
           context.consumeRate = personalData.consumeRate;

        }

        context.timeRate = 1000* config.counterStepsInSeconds;



        if (localStorage.getItem('drinks') !== null && context.drunkenDrinks.length === 0 && localStorage.getItem('lastUpdated') !== null) {

            context.drunkenDrinks = JSON.parse(localStorage.getItem('drinks'));
            let lastUpdatedArray= JSON.parse(localStorage.getItem('lastUpdated'));
            context.lastUpdatedArray = lastUpdatedArray;

            for(let lastUpdatedArrayIteral = 0; lastUpdatedArrayIteral < lastUpdatedArray.length; lastUpdatedArrayIteral++) {

                let elapsedHours = Math.floor(Math.abs(new Date() - new Date(lastUpdatedArray[lastUpdatedArrayIteral])) / context.timeRate);

                context.drunkenDrinks[lastUpdatedArrayIteral] = CalculateRemainingDrinksAfterElapsedTime(context.drunkenDrinks,lastUpdatedArrayIteral, elapsedHours);
                lastUpdatedArray[lastUpdatedArrayIteral] = new Date(new Date(lastUpdatedArray[lastUpdatedArrayIteral]).getTime() + (elapsedHours*context.timeRate)).toLocaleString() ;
                context.lastUpdatedArray = lastUpdatedArray;


                localStorage.setItem('lastUpdated', JSON.stringify(lastUpdatedArray));

                let remainingTime = context.timeRate - ((Math.abs((context.timeRate*elapsedHours) - (Math.abs(new Date().getTime() - new Date(lastUpdatedArray[lastUpdatedArrayIteral]).getTime())))) % context.timeRate);


                console.log(remainingTime);
                setTimeout(function(context, index){



                    if (context.drunkenDrinks.filter(drink =>{return drink.displayed}).length !== 0) {

                        context.drunkenDrinks[index].drinkTime++;
                        lastUpdatedArray[index] = Date();
                        context.lastUpdatedArray = lastUpdatedArray;
                        context.amount =  CalculateAmount(context.drunkenDrinks, context.consumeRate, config.consumeTimeInMin, config.maxElapsedMinutes);
                        localStorage.setItem('drinks', JSON.stringify(context.drunkenDrinks));
                        localStorage.setItem('lastUpdated', JSON.stringify(context.lastUpdatedArray));
                        context.updateDisplay();


                        context.drunkenDrinks.refreshInterval =  setInterval(function (context, index) {

                           lastUpdatedArray[index] = Date();
                            context.lastUpdatedArray = lastUpdatedArray;
                            context.amount =  CalculateAmount(context.drunkenDrinks, context.consumeRate,  config.consumeTimeInMin, config.maxElapsedMinutes);
                            context.drunkenDrinks[index].drinkTime ++;
                            localStorage.setItem('drinks', JSON.stringify(context.drunkenDrinks));
                            localStorage.setItem('lastUpdated', JSON.stringify(context.lastUpdatedArray));
                            context.updateDisplay();



                        }, context.timeRate, context, index);


                    }

                }, remainingTime, context, lastUpdatedArrayIteral);




            }

            context.amount = CalculateAmount(context.drunkenDrinks, context.consumeRate, config.consumeTimeInMin, config.maxElapsedMinutes);

        }



        this.updateFromChild = this.updateFromChild.bind(this);





    }


    updateFromChild() {
        this.setState({});
    }

    render() {

        this.context.updateDisplay = this.updateFromChild;

        return (

            <div className="Calculatordisplay">

                <CalculatedDrinks/>
                <CalculatorPerMill/>
                <CalculatorInfoBox/>
            </div>
        );

    }

}

export default CalculatorDisplay;
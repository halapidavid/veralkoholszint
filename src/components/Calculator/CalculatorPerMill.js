import React from 'react';
import {UserData} from "../../contexts/UserData";
import fontawesome from '@fortawesome/fontawesome'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHelicopter, faCar, faBan} from '@fortawesome/free-solid-svg-icons';

fontawesome.library.add(faHelicopter, faCar, faBan);

class CalculatorPerMill extends React.Component {

    static contextType = UserData;


    calculateBloodPerMille() {

        let amount = this.context.amountPerHour[23];
        let genderConstant = this.context.gender === "male" ? 8 : 10;
        let pounds = this.context.weight * 2.2026;

        let bacestimatex = (amount * 0.6 * 1.055 * (genderConstant / pounds)) - (0.015) * 10;


        return bacestimatex > 0 ? bacestimatex : 0;


    }

    calculateReamainingTime() {

        let amount = this.context.amountPerHour[23];
        let consumeRate = this.context.consumeRate;


        return Math.ceil(amount / consumeRate);

    }


    render() {

        this.context.bac = this.calculateBloodPerMille();
        let remainingTime = this.calculateReamainingTime();


        if (this.context.weight === 0 || this.context.gender === "") {
            return (<div className="Calculator-display m-3 p-3 text-dark text-center bg-info">
                Kérlek add meg az adataidat, mielőtt folytatnánk!
            </div>)
        } else if (this.context.drunkenDrinks.filter(drink => drink.displayed === true).length === 0) {
            return (<div className="Calculator-display m-3 p-3 text-white text-center bg-success">
                Nem fogyasztottál alkoholt!
            </div>)
        } else {

            let returnableText;

            if (this.context.bac > 0) {

                if ( this.context.bac < 4) {
                    returnableText =
                        <div
                            className={"Calculator-display-calculated-data m-3 p-3 text-white text-center" + (( this.context.bac > 0) ? " bg-danger" : " bg-success")}>
                            Vérezrelék: {this.context.bac} <br/>
                            Ittaság várható időtartama: legalább további {remainingTime} óra. <br/>
                            <h1><FontAwesomeIcon icon={'ban'}/> <FontAwesomeIcon icon={'car'}/> NE ÜLJ GÉPJÁRMŰBE! <a
                                href="https://www.youtube.com/watch?v=a0DbzUe-r4Q&ab_channel=Fazlija"
                                className="helicopter-link"><FontAwesomeIcon icon={'helicopter'}/></a> <FontAwesomeIcon
                                icon={'ban'}/></h1>
                        </div>;
                } else {

                    returnableText = <div
                        className={"Calculator-display-calculated-data m-3 p-3 text-white text-center" + (( this.context.bac > 0) ? " bg-danger" : " bg-success")}>
                        Vérezrelék: { this.context.bac} <br/>
                        <h1>Ezen a ponton már nem vagy képes gépjárműbe ülni. <br/>
                            A Mindenható Erő legyen irgalmas a lelkedhez.</h1>

                    </div>;
                }

            } else {

                returnableText =
                    <div
                        className="Calculator-display-calculated-data m-3 p-3 text-white text-center bg-success">
                        Vérezrelék: 0 <br/>
                    </div>;
            }

            return returnableText;

        }


    }

}

export default CalculatorPerMill;
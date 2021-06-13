import React from 'react'

export default function Row(props) {

    return (
        <div className="custom-select">
            <input type="number" className="me-3" value={props.amount} onChange={props.changeInput}/>
            <select value={props.choice} onChange={props.changeCurrency}>
                {props.currency.map(option => (
                    <option value={option}>{option}</option>
                ))}
            </select>
        </div>
    )
}

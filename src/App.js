import './App.css';
import React, {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Row from './components/Row'

const API_KEY = process.env.REACT_APP_EXRATE_KEY

function App() {

  //states
  const [currency, setCurrency] = useState([])
  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const [amount, setAmount] = useState(1)  //the aount to convert
  const [inFrom, setInFrom] = useState(true)   //since we allow two ways change, this tell where the input is coming from
  const [rate, setRate] = useState()


  let toAmt, fromAmt 
  if (inFrom) {
    //if the input is coming from the first box, set the value in the first box (from box) to the amount entered in. The value in the other box will be the result
    fromAmt = amount
    toAmt = amount*rate
  }
  else{
    toAmt = amount
    fromAmt = amount/rate
  }

  //effects
  //load the rate at the very beginning
  useEffect(async() => {
    const response = await fetch(`http://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`)
    const data = await response.json()

    setCurrency([data.base, ...Object.keys(data.rates)])
    setFrom(data.base)
    setTo(Object.keys(data.rates)[153])
    setRate(data.rates[Object.keys(data.rates)[153]])
  }, [])


  //allow changing the currency within a session. before this you must reload the page to do conversion in another pair of currency
  useEffect(async() =>{
    //prevent calling effect when the values are still undefined
    if (from!=null && to!=null){
      const response = await fetch(`http://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}&base=${from}&symbols=${to}`)
      const data = await response.json()
      //console.log(data)


      //NOTICE: cannot change the base currency on a free account. So if you attemp to change the from currency, it will throw an error
      setRate(data.rates[to])
    }
  }, [from, to])


  //functions
  function handleFromChange(e){
    setAmount(e.target.value)
    setInFrom(true)
  }

  function handleToChange(e){
    setAmount(e.target.value)
    setInFrom(false)
  }

  return (
    <div className="App position-relative">
      <div className="container w-75 d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <h1 className="my-5">Currency converter</h1>
        <Row 
          currency={currency} 
          choice={from} 
          changeCurrency={e => setFrom(e.target.value)}
          changeInput={handleFromChange}
          amount={fromAmt}
        />

        <h3>=</h3>

        <Row 
          currency={currency} 
          choice={to} 
          changeCurrency={e => setTo(e.target.value)}
          changeInput={handleToChange}
          amount={toAmt}
        />
      </div>
    </div>
  );
}

export default App;

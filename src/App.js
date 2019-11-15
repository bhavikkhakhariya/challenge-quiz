import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import Questions from './containers/Questions'
import './assets/css/quiz.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App () {
  return (
    <Router>
      <div className='main'>
        <Route exact path='/' component={Questions} />
      </div>
    </Router>
  )
}

export default App

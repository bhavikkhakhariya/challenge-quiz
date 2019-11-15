
import React from 'react'
import { Row, Col, Alert } from 'react-bootstrap'
import StarRatings from 'react-star-ratings'

const Question = (props) => {
  const { category, options, isCorrect, question, difficulty, onPickOption, selectedOption, activeIndex = 0, rightAnswerIndex, total } = props
  const onPick = (index) => {
    if (!isCorrect && isCorrect !== false) { onPickOption(index) }
  }
  const difficulties = {
    hard: 3,
    medium: 2,
    easy: 1
  }
  return (
    <div className='question'>
      <h2>Question {activeIndex + 1} of {total}</h2>
      <small>{decodeURIComponent(category)}</small>
      <div className='ratings mb-3'>
        <StarRatings
          rating={difficulties[difficulty] || 0}
          starDimension='15px'
          starRatedColor='grey'
          numberOfStars={3}
          name='rating'
        />
      </div>
      <h4>{decodeURIComponent(question)}</h4>
      <Row className='options'>
        { options.map((option, index) =>
          <Col md='6' sm='12' className='option' key={`option-${index}`}>
            <Alert
              variant={(isCorrect || isCorrect === false) && rightAnswerIndex === index ? 'success' : (selectedOption === index ? 'primary' : 'dark')}
              onClick={() => onPick(index)}
            >
              {decodeURIComponent(option)}
            </Alert>
          </Col>
        ) }
      </Row>
    </div>
  )
}

export default Question

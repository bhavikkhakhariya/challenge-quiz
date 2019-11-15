import React, {Component} from 'react';
import {Button, ProgressBar, Spinner} from 'react-bootstrap';
import Question from './components/Question';
import {getAllQuestions} from '../actions/services';

class Questions extends Component {
  
  constructor(props){
    super(props)
    this.state = {
        questions: [],
        loading: false,
        activeIndex: 0,
    }
  }  
  
  async componentDidMount() {
    const data = await getAllQuestions();
    if (!data || data.error) {
      this.setState({
        loading: false,
        error: data.error || 'Something went wrong'
      })
    } else {
      const questions = (data || []).map(question => {
        const rightAnswerIndex = Math.floor(Math.random() * ((question.incorrect_answers || [])).length + 1);
        const options = (question.incorrect_answers || []);
        if (options.length) {
          options.splice(rightAnswerIndex, 0, question.correct_answer);
        }
        return {
          ...question,
          selectedOption: -1,
          options,
          rightAnswerIndex,
        }
      });
      this.setState({
        loading: false,
        questions
      })
    }
  }
  
  onPickOption = index => {
    const {questions, activeIndex} = this.state;
    questions[activeIndex].selectedOption = index;
    questions[activeIndex].isCorrect = questions[activeIndex].rightAnswerIndex === questions[activeIndex].selectedOption;
    this.setState({
      questions
    });
  }
  
  onNext = () => {
    const {questions, activeIndex } = this.state;
    questions[activeIndex].isCorrect = questions[activeIndex].rightAnswerIndex === questions[activeIndex].selectedOption;
    this.setState({
      activeIndex: activeIndex + 1,
      questions,
    });
  }
  
  render() {
    const {loading, questions = [], activeIndex} = this.state;
    if (loading) {
      return <div><Spinner style={{ width: '3rem', height: '3rem' }} /></div>;
    };
    const currentQuestion = questions[activeIndex] || {};
    const totalQuestions = questions.length;
    const rightAnswers = questions.filter(x => x.isCorrect).length;
    let totalScore = (rightAnswers * 100) / totalQuestions;
    let overallScore = parseFloat(((rightAnswers * 100) / ((activeIndex + (!currentQuestion.hasOwnProperty('isCorrect') ? 0 : 1)) || 1)) || 0).toFixed(2);
    let maxScore = ((rightAnswers + (totalQuestions - activeIndex - (!currentQuestion.hasOwnProperty('isCorrect') ? 0 : 1))) * 100) / totalQuestions;
    const currentProgress = ((activeIndex + 1) * 100) / totalQuestions;

    return (
      <div className="questions-list">
        {
          totalQuestions ?
            <>
            {
              activeIndex < totalQuestions &&
              <div className="mb-5">
                <ProgressBar now={currentProgress} />
              </div>
            }
            {
              activeIndex < totalQuestions ?
                <Question 
                  {...currentQuestion}
                  total={questions.length}
                  activeIndex={activeIndex}
                  onPickOption={this.onPickOption}
                /> :
                <div className="mt-5">
                  <h5>Your quiz completed! Your score <b>{rightAnswers}</b> out of <b>{questions.length}</b>!</h5>
                </div>
            }
            {
              !currentQuestion.hasOwnProperty('isCorrect') ? null :
                currentQuestion.isCorrect === false ? <h3 className="text-center">Sorry!</h3> : <h3 className="text-center">Correct!</h3>
            }
            {
              activeIndex < totalQuestions && currentQuestion.hasOwnProperty('isCorrect') ?
              <div className="text-center">
                <Button disabled={((!currentQuestion.selectedOption && currentQuestion.selectedOption !== 0) || currentQuestion.selectedOption < 0) }
                        color="primary" size="md" onClick={this.onNext}>
                  Next Question
                </Button>
              </div> : null
            }
            
            {
              activeIndex < totalQuestions &&
              <div className="mt-5">
                <div className="overflow-auto">
                  <small className="float-left">Score: {overallScore}%</small>
                  <small className="float-right">Max Score: {maxScore}%</small>
                </div>
                <div className="miniBar">
                  <div className="black" style={{left: 0, width: `${totalScore}%`}}/>
                  <div className="grey" style={{left: 0, width: `${overallScore}%`}}/>
                  <div className="light-grey" style={{left: 0, width: `${maxScore}%`}}/>
                </div>
              </div>
            }
            </> : <h2>Questions not found!</h2>
        }
      </div>
    );
  }
}

export default Questions;

import axios from 'axios'

export const getAllQuestions = async () => {
  try {
    let data = ''
    const response = await axios.get('https://raw.githubusercontent.com/outlier-org/challenge-quiz/master/src/questions.json')
    return data || response.data
  } catch (_err) {
    return { error: 'something went wrong' }
  }
}

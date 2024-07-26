let path = "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple";
let p = fetch(path);

let list = [];
p.then((response) => {
  return response.json();
}).then((value) => {
  value = value["results"];
  for (let item in value) {
    let q = {};
    q["question"] = value[item]["question"];
    q["answers"] = [];
    q["answers"].push({ text: value[item]["correct_answer"], correct: true });
    for (let itemm in value[item]["incorrect_answers"]) {
      q["answers"].push({
        text: value[item]["incorrect_answers"][itemm],
        correct: false,
      });
    }

    // shuffle q ['answers]
    q["answers"].sort(() => Math.random() - 0.5);
    list.push(q);
  }
  return list;
}).then((list) => {
  const QuestionElement = document.getElementById("question");
  const OptionElements = document.getElementById("answer-buttons");
  const nextButton = document.getElementById("next-btn");

  let CurrentQuestionIndex = 0;
  let score = 0;

  function StartQuiz() {
    CurrentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    ShowQuestion();
  }

  function ShowQuestion() {
    resetState();
    let CurrentQuestion = list[CurrentQuestionIndex];
    let questionNo = CurrentQuestionIndex + 1;
    QuestionElement.innerHTML = questionNo + ". " + CurrentQuestion.question;
    CurrentQuestion.answers.forEach(answer => {
      const button = document.createElement("button");
      button.innerHTML = answer.text;
      button.classList.add("btn");
      OptionElements.appendChild(button);
      if (answer.correct) {
        button.dataset.correct = answer.correct;
      }
      button.addEventListener('click', selectAnswer);
    });
  }

  function selectAnswer(e) {
    let selectedBtn = e.target;
    let correct = selectedBtn.dataset.correct;
    if (correct) {
      score++;
      selectedBtn.classList.add('correct');
    } else {
      selectedBtn.classList.add('incorrect');
    }
    Array.from(OptionElements.children).forEach(button => {
      if (button.dataset.correct === "true") {
        button.classList.add('correct');
      }
      button.disabled = true;
    });
    nextButton.style.display = "block";
  }

  function resetState() {
    nextButton.style.display = 'none';
    while (OptionElements.firstChild) {
      OptionElements.removeChild(OptionElements.firstChild);
    }
  }

  function ShowScore() {
    resetState();
    QuestionElement.innerHTML = `Your Score is ${score} out of ${list.length}`;
    nextButton.innerHTML = "Take Again";
    nextButton.style.display = "block";
    nextButton.addEventListener("click", () => {
      CurrentQuestionIndex = 0;
      score = 0;
      location.reload();
    })
  }

  function handleNextButton() {
    CurrentQuestionIndex++;
    if (CurrentQuestionIndex < list.length) {
      ShowQuestion();
    } else {
      ShowScore();
    }
  }

  const nextB = () => {
    if (CurrentQuestionIndex < list.length) {
      handleNextButton();
    } else {
      StartQuiz();
    }
  }

  nextButton.addEventListener("click", nextB)
  StartQuiz();
});

const API_KEY = "AIzaSyA_Fs_Tv4tH83m9qFof-v0mjQVKmHXDUG8";

const btn = document.getElementById("btn");
const loader = document.getElementById("loader");
const resultDiv = document.getElementById("result");
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const showAnsBtn = document.getElementById("showAns");

btn.addEventListener("click", getQuiz);

async function getQuiz() {
  const topic = document.getElementById("topic").value;

  if (!topic) {
    alert("Enter a topic 😑");
    return;
  }

  loader.classList.remove("hidden");
  resultDiv.classList.add("hidden");

  const prompt = `Create 1 very simple question and answer on ${topic}.
Return ONLY in JSON format:
{
 "question": "...",
 "answer": "..."
}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await res.json();

    let text = data.candidates[0].content.parts[0].text;

    // Clean JSON (Gemini kabhi extra text deta hai)
    let json = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);

    questionEl.innerText = "Q: " + json.question;
    answerEl.innerText = "A: " + json.answer;

    loader.classList.add("hidden");
    resultDiv.classList.remove("hidden");
    showAnsBtn.classList.remove("hidden");
    answerEl.classList.add("hidden");

  } catch (err) {
    console.log(err);
    loader.innerText = "Error 😢 Check API Key";
  }
}

showAnsBtn.addEventListener("click", () => {
  answerEl.classList.remove("hidden");
});
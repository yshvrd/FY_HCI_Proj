const startBtn = document.getElementById('start-btn');
const transcriptEl = document.getElementById('transcript');
const responseEl = document.getElementById('response');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

startBtn.addEventListener('click', () => {
  recognition.start();
  transcriptEl.textContent = 'Listening...';
  responseEl.textContent = '';
});

recognition.addEventListener('result', (event) => {
  const speech = event.results[0][0].transcript.toLowerCase().trim();
  transcriptEl.textContent = `You said: "${speech}"`;

  let reply = '';

  if (speech.includes('hello')) {
    reply = 'Hello there!';
  } else if (speech.includes('time')) {
    reply = `Current time is ${new Date().toLocaleTimeString()}`;
  } else if (speech.startsWith('open ')) {
    const target = speech.replace('open ', '').trim();
    let url = '';

    // if target is a domain, treat it as URL
    if (target.includes('.') || target.includes('www')) {
      url = target.startsWith('http') ? target : `https://${target}`;
    } else {
      // not a direct domain — search it
      url = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
    }

    reply = `Opening ${target}`;
    window.open(url, '_blank');
  } else {
    // default fallback: search the spoken phrase
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(speech)}`;
    reply = `Searching for "${speech}"`;
    window.open(searchUrl, '_blank');
  }

  responseEl.textContent = reply;
  const utterance = new SpeechSynthesisUtterance(reply);
  speechSynthesis.speak(utterance);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.addEventListener('error', (event) => {
  transcriptEl.textContent = `Error: ${event.error}`;
  responseEl.textContent = '';
});

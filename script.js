const letters = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ'];
let current = 0;
const runner = document.getElementById('runner');
const input = document.getElementById('input-letter');
const target = document.getElementById('target-letter');
const message = document.getElementById('message');

function nextLetter() {
  current++;
  if (current >= letters.length) {
    message.textContent = '🎉 فزت!';
    input.disabled = true;
    return;
  }
  target.textContent = letters[current];
}

input.addEventListener('input', () => {
  if (input.value === letters[current]) {
    runner.style.left = `${(current + 1) * 10}%`;
    message.textContent = '✅ صحيح!';
    input.value = '';
    nextLetter();
  } else {
    message.textContent = '❌ حاول مرة أخرى';
  }
});

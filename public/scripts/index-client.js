// Typing animation for hero section

document.addEventListener('DOMContentLoaded', function () {
  console.log('index-client.js loaded');
  const typingSpan = document.querySelector('.typing');
  if (!typingSpan) {
    console.log('No .typing element found');
    return;
  }

  let words = typingSpan.getAttribute('data-words');
  console.log('data-words attribute:', words);
  try {
    words = JSON.parse(words);
  } catch {
    words = [];
  }
  console.log('Parsed words:', words);
  if (!Array.isArray(words) || words.length === 0) {
    console.log('No words to animate');
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 120;
  let pauseTime = 1200;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typingSpan.textContent = currentWord.substring(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 400);
      } else {
        setTimeout(type, typingSpeed / 2);
      }
    } else {
      typingSpan.textContent = currentWord.substring(0, charIndex++);
      if (charIndex > currentWord.length) {
        isDeleting = true;
        setTimeout(type, pauseTime);
      } else {
        setTimeout(type, typingSpeed);
      }
    }
  }

  type();
}); 
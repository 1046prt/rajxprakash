// Typing animation for hero section

document.addEventListener('DOMContentLoaded', function () {
  // Typing animation
  const typingSpan = document.querySelector('.typing');
  if (!typingSpan) {
    return;
  }

  let words = typingSpan.getAttribute('data-words');
  try {
    words = JSON.parse(words);
  } catch {
    words = [];
  }
  if (!Array.isArray(words) || words.length === 0) {
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

  // Add scroll down button functionality
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function () {
      // Find the about section or the next section after hero
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

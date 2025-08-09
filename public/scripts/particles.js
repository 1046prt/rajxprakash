function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particlesArray = [];
  const numberOfParticles = Math.min(100, Math.floor(window.innerWidth / 20));
  const colors = ['#ff6f00', '#ffb74d', '#ffffff'];
}

document.addEventListener('DOMContentLoaded', initParticles);

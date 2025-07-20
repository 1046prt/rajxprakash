// Your particles.js content here
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Particle settings
  const particlesArray = [];
  const numberOfParticles = Math.min(100, Math.floor(window.innerWidth / 20));
  const colors = ['#ff6f00', '#ffb74d', '#ffffff'];

  // Rest of your particles implementation...
}

document.addEventListener('DOMContentLoaded', initParticles);

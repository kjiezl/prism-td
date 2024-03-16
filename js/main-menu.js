const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1920;
canvas.height = 960;

ctx.fillStyle = 'rgb(179, 204, 255)';
ctx.fillRect(0, 0, canvas.width, canvas.height)
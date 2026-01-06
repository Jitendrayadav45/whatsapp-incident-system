module.exports = function generateTicketId() {
  const time = Date.now().toString().slice(-6);
  const rand = Math.floor(100 + Math.random() * 900);
  return `TKT-${time}-${rand}`;
};

// console.log(generateTicketId());
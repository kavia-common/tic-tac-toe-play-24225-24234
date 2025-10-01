(function () {
  const statusEl = document.getElementById('status');
  const boardEl = document.getElementById('board');
  const cells = Array.from(boardEl.querySelectorAll('.cell'));
  const resetBtn = document.getElementById('resetBtn');

  const WIN_PATTERNS = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diags
  ];

  let board = Array(9).fill(null);
  let current = 'X';
  let gameOver = false;

  function updateStatus(text) {
    statusEl.textContent = text;
  }

  function setIndicator() {
    const players = document.querySelectorAll('.player');
    players.forEach(p => p.classList.remove('active'));
    const activeSel = current === 'X' ? '.player-x' : '.player-o';
    const activeEl = document.querySelector(activeSel);
    if (activeEl) activeEl.classList.add('active');
  }

  function announceCell(index) {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    const val = board[index] || 'empty';
    cells[index].setAttribute('aria-label', `Row ${row}, Column ${col}, ${val}`);
  }

  function checkWinner() {
    for (const pattern of WIN_PATTERNS) {
      const [a,b,c] = pattern;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return pattern;
      }
    }
    return null;
  }

  function boardFull() {
    return board.every(Boolean);
  }

  function setCell(index, mark) {
    board[index] = mark;
    cells[index].textContent = mark;
    announceCell(index);
  }

  function handleWin(pattern) {
    pattern.forEach(i => cells[i].classList.add('win'));
    updateStatus(`Winner: ${current}`);
    gameOver = true;
    disableBoard();
  }

  function disableBoard() {
    cells.forEach(c => c.disabled = true);
  }

  function enableBoard() {
    cells.forEach(c => c.disabled = false);
  }

  function nextPlayer() {
    current = current === 'X' ? 'O' : 'X';
    setIndicator();
    updateStatus(`Current turn: ${current}`);
  }

  function handleCellClick(e) {
    const btn = e.currentTarget;
    const index = Number(btn.dataset.index);
    if (gameOver || board[index]) return;

    setCell(index, current);

    const win = checkWinner();
    if (win) {
      handleWin(win);
      return;
    }

    if (boardFull()) {
      updateStatus('Draw!');
      gameOver = true;
      disableBoard();
      return;
    }

    nextPlayer();
  }

  function reset() {
    board.fill(null);
    cells.forEach((c, i) => {
      c.textContent = '';
      c.classList.remove('win', 'accent');
      c.removeAttribute('disabled');
      const row = Math.floor(i / 3) + 1;
      const col = (i % 3) + 1;
      c.setAttribute('aria-label', `Row ${row}, Column ${col}, empty`);
    });
    current = 'X';
    gameOver = false;
    setIndicator();
    updateStatus('Current turn: X');
    enableBoard();
    cells[0].focus();
  }

  function handleKeyNav(e) {
    const currentIndex = Number(e.currentTarget.dataset.index);
    let target = null;
    switch (e.key) {
      case 'ArrowUp': target = currentIndex - 3; break;
      case 'ArrowDown': target = currentIndex + 3; break;
      case 'ArrowLeft': target = currentIndex - 1; break;
      case 'ArrowRight': target = currentIndex + 1; break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        e.currentTarget.click();
        return;
      default:
        return;
    }
    if (target != null && target >= 0 && target < 9) {
      e.preventDefault();
      cells[target].focus();
    }
  }

  // Initialize
  cells.forEach((c) => {
    c.addEventListener('click', handleCellClick);
    c.addEventListener('keydown', handleKeyNav);
  });
  resetBtn.addEventListener('click', reset);

  // Initial UI
  setIndicator();
  updateStatus('Current turn: X');
  cells[0].focus();
})();

const API = `${window.API_BASE_URL}/api/game`,
    board = document.getElementById('board'),
    statusEl = document.getElementById('status');

async function load() {
    const r = await fetch(API);
    render(await r.json());
}

async function move(index) {
    try {
        const r = await fetch(`${API}/move`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ index })
        });

        if (!r.ok) {
            throw new Error((await r.json()).message || 'Move failed');
        }

        render(await r.json());
    } catch (e) {
        alert(e.message);
    }
}

async function reset() {
    const r = await fetch(`${API}/reset`, { method: 'POST' });
    render(await r.json());
}

function render(g) {
    board.innerHTML = '';

    g.board.forEach((v, i) => {
        const b = document.createElement('button');
        b.className = 'cell';
        b.textContent = v || '';
        b.disabled = !!v || g.status !== 'IN_PROGRESS';
        b.onclick = () => move(i);
        board.appendChild(b);
    });

    statusEl.textContent =
        g.status === 'WON'
            ? `Player ${g.winner} wins!`
            : g.status === 'DRAW'
                ? "It's a draw!"
                : `Player ${g.currentPlayer}'s turn`;
}

document.getElementById('reset').onclick = reset;
load().catch((e) => (statusEl.textContent = e.message));

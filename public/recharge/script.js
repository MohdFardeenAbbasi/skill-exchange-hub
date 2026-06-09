/* Skill Exchanger — Wallet Recharge (Frontend only, modular & scalable) */

const CONFIG = {
  UPI_ID: '9773819327@ptsbi',
  PAYEE_NAME: 'SkillExchanger',
  STORAGE: {
    BALANCE: 'sx_wallet_balance',
    HISTORY: 'sx_wallet_history',
    UTRS: 'sx_used_utrs',
  },
};

/* ---------- Storage helpers (swap with backend later) ---------- */
const Store = {
  getBalance: () => Number(localStorage.getItem(CONFIG.STORAGE.BALANCE) || 0),
  setBalance: (v) => localStorage.setItem(CONFIG.STORAGE.BALANCE, String(v)),
  getHistory: () => {
    try { return JSON.parse(localStorage.getItem(CONFIG.STORAGE.HISTORY) || '[]'); }
    catch { return []; }
  },
  pushHistory: (entry) => {
    const list = Store.getHistory();
    list.unshift(entry);
    localStorage.setItem(CONFIG.STORAGE.HISTORY, JSON.stringify(list.slice(0, 50)));
  },
  getUtrs: () => {
    try { return JSON.parse(localStorage.getItem(CONFIG.STORAGE.UTRS) || '[]'); }
    catch { return []; }
  },
  addUtr: (utr) => {
    const utrs = Store.getUtrs();
    utrs.push(utr);
    localStorage.setItem(CONFIG.STORAGE.UTRS, JSON.stringify(utrs));
  },
};

/* ---------- UPI ---------- */
const buildUpiLink = (amount) =>
  `upi://pay?pa=${encodeURIComponent(CONFIG.UPI_ID)}` +
  `&pn=${encodeURIComponent(CONFIG.PAYEE_NAME)}` +
  `&am=${encodeURIComponent(amount)}` +
  `&cu=INR` +
  `&tn=${encodeURIComponent('SkillExchanger Wallet Recharge')}`;

const buildQrUrl = (upiLink) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodeURIComponent(upiLink)}`;

const isMobile = () => /Android|webOS|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);

/* ---------- UI ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

const els = {
  balance: $('#walletBalance'),
  historyBody: $('#historyBody'),
  modal: $('#paymentModal'),
  payAmount: $('#payAmount'),
  payPoints: $('#payPoints'),
  qrSection: $('#qrSection'),
  qrImage: $('#qrImage'),
  mobileSection: $('#mobileSection'),
  upiLink: $('#upiLink'),
  utrInput: $('#utrInput'),
  verifyBtn: $('#verifyBtn'),
  successPopup: $('#successPopup'),
  successMsg: $('#successMsg'),
  errorPopup: $('#errorPopup'),
  errorMsg: $('#errorMsg'),
};

let currentTxn = null; // {amount, points}

function renderBalance() {
  els.balance.textContent = Store.getBalance().toLocaleString();
}

function renderHistory() {
  const list = Store.getHistory();
  if (!list.length) {
    els.historyBody.innerHTML = '<tr class="empty"><td colspan="5">No transactions yet.</td></tr>';
    return;
  }
  els.historyBody.innerHTML = list.map(t => `
    <tr>
      <td>${new Date(t.ts).toLocaleString()}</td>
      <td>₹${t.amount}</td>
      <td>+${t.points}</td>
      <td>${t.utr}</td>
      <td><span class="status-pill status-${t.status}">${t.status}</span></td>
    </tr>
  `).join('');
}

function openPaymentModal(amount, points) {
  currentTxn = { amount, points };
  els.payAmount.textContent = `₹${amount}`;
  els.payPoints.textContent = points;
  els.utrInput.value = '';

  const upi = buildUpiLink(amount);

  if (isMobile()) {
    els.qrSection.style.display = 'none';
    els.mobileSection.style.display = 'block';
    els.upiLink.href = upi;
    // try auto-open
    setTimeout(() => { window.location.href = upi; }, 350);
  } else {
    els.qrSection.style.display = 'block';
    els.mobileSection.style.display = 'none';
    els.qrImage.src = buildQrUrl(upi);
  }

  els.modal.classList.add('active');
}

function closeModal() {
  els.modal.classList.remove('active');
  currentTxn = null;
}

function showSuccess(msg) {
  els.successMsg.textContent = msg;
  els.successPopup.classList.add('active');
}
function showError(msg) {
  els.errorMsg.textContent = msg;
  els.errorPopup.classList.add('active');
}

/* ---------- Verification ---------- */
function verifyPayment() {
  if (!currentTxn) return;
  const utr = els.utrInput.value.trim();

  if (utr.length < 6) return showError('Please enter a valid UTR / Transaction ID.');
  if (Store.getUtrs().includes(utr)) return showError('This UTR has already been used.');

  // Loading state
  const label = els.verifyBtn.querySelector('.btn-label');
  const spinner = els.verifyBtn.querySelector('.spinner');
  label.textContent = 'Verifying';
  spinner.hidden = false;
  els.verifyBtn.disabled = true;

  // Simulated verification — replace with backend call later
  setTimeout(() => {
    spinner.hidden = true;
    label.textContent = 'Verify & Add Points';
    els.verifyBtn.disabled = false;

    const { amount, points } = currentTxn;
    Store.addUtr(utr);
    Store.setBalance(Store.getBalance() + points);
    Store.pushHistory({
      ts: Date.now(), amount, points, utr, status: 'success',
    });

    renderBalance();
    renderHistory();
    closeModal();
    showSuccess(`${points} points added to your wallet.`);
  }, 1400);
}

/* ---------- Events ---------- */
document.addEventListener('click', (e) => {
  const recharge = e.target.closest('.btn-recharge');
  if (recharge) {
    openPaymentModal(Number(recharge.dataset.amount), Number(recharge.dataset.points));
    return;
  }
  if (e.target.matches('[data-close]') || e.target === els.modal) closeModal();
  if (e.target.matches('[data-close-popup]')) {
    els.successPopup.classList.remove('active');
    els.errorPopup.classList.remove('active');
  }
});
els.verifyBtn.addEventListener('click', verifyPayment);
els.utrInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') verifyPayment(); });

/* ---------- Init ---------- */
renderBalance();
renderHistory();

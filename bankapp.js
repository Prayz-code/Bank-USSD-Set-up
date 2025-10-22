   

(() => {
  const accounts = [];
  let activeAccountNumber = null;
  let running = true;
  //  Utilities
  const now = () => new Date().toLocaleString();
  const fmtMoney = (n) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);
  const randomAcct = () => String(Math.floor(1000000000 + Math.random() * 9000000000)); // 10-digit
  function alertLines(lines) {
    const text = Array.isArray(lines) ? lines.join("\n") : String(lines || "");
    alert(text);
  }
  function promptNonEmpty(message, defVal = "") {
    while (true) {
      const v = prompt(message, defVal);
      if (v === null) return null;
      if (v.trim() !== "") return v.trim();
      alert("Please enter a value.");
    }
  }
  function promptChoice(message, choices) {
    // choices: array of strings like ["1","2","3"]
    while (true) {
      const v = prompt(message);
      if (v === null) return null;
      if (choices.includes(v.trim())) return v.trim();
      alert("Invalid input. Try again.");
    }
  }
  function promptNumber(message, min = 0.01) {
    while (true) {
      const v = prompt(message);
      if (v === null) return null;
      const n = Number(v);
      if (!Number.isNaN(n) && n >= min) return n;
      alert(`Enter a valid number${min ? ` (≥ ${min})` : ""}.`);
    }
  }
  function promptPin(message = "Enter your 4-digit PIN:") {
    while (true) {
      const v = prompt(message);
      if (v === null) return null;
      if (/^\d{4}$/.test(v)) return v;
      alert("PIN must be exactly 4 digits.");
    }
  }
  function findAccountByNumber(acctNumber) {
    return accounts.find(a => a.number === acctNumber) || null;
  }
  function chooseAccount(optionalHeader = "Select an account by number") {
    if (accounts.length === 0) { alert("No accounts yet."); return null; }
    const list = accounts
      .map(a => `• ${a.number} — ${a.name} (${a.type}) ${activeAccountNumber === a.number ? "[ACTIVE]" : ""}`)
      .join("\n");
    const picked = prompt(`${optionalHeader}:\n${list}\n\nEnter account number:`);
    if (picked === null) return null;
    const acct = findAccountByNumber(picked.trim());
    if (!acct) { alert("Account not found."); return null; }
    return acct;
  }
  function requireActiveOrPick() {
    if (activeAccountNumber) {
      const acct = findAccountByNumber(activeAccountNumber);
      if (acct) return acct;
      activeAccountNumber = null;
    }
    return chooseAccount("No active account set. Pick one to proceed");
  }
  function logTx(acct, type, amount = 0, note = "") {
    acct.transactions.push({ ts: now(), type, amount, balance: acct.balance, note });
  }
  // main Actions
  function openAccount() {
    const name = promptNonEmpty("Enter your full name:", "Harry Potter");
    if (name === null) return;
    const phone = promptNonEmpty("Enter your phone number:");
    if (phone === null) return;
    const username = promptNonEmpty("Choose a username:", "harrypotter24");
    if (username === null) return;
    const password = promptNonEmpty("Choose a password:", "password@1234");
    if (password === null) return;
    const pin = promptPin("Set a 4-digit PIN (numbers only):");
    if (pin === null) return;
    const typeChoice = promptChoice(
      "Account type:\n [1] Savings\n [2] Current\nSelect:",
      ["1","2"]
    );
    if (typeChoice === null) return;
    const type = typeChoice === "1" ? "Savings" : "Current";
    const number = randomAcct();
    const acct = {
      number,
      name,
      phone,
      username,
      password,
      pin,
      type,
      balance: 0,
      transactions: []
    };
    accounts.push(acct);
    activeAccountNumber = number;
    logTx(acct, "OPEN", 0, `Account opened (${type}).`);
    alert(`Account created!\nName: ${name}\nType: ${type}\nAccount Number: ${number}\n\nThis is now your ACTIVE account.`);
  }
  function deposit() {
    const acct = requireActiveOrPick();
    if (!acct) return;
    const amount = promptNumber("Enter amount to deposit:");
    if (amount === null) return;
    acct.balance += amount;
    logTx(acct, "DEPOSIT", amount, "Cash deposit");
    alert(`Deposit successful!\nNew Balance: ${fmtMoney(acct.balance)}`);
  }
  function withdraw() {
    const acct = requireActiveOrPick();
    if (!acct) return;
    const pin = promptPin("For security, enter your 4-digit PIN to withdraw:");
    if (pin === null) return;
    if (pin !== acct.pin) { alert("Incorrect PIN."); return; }
    const amount = promptNumber("Enter amount to withdraw:");
    if (amount === null) return;
    if (amount > acct.balance) {
      alert("Insufficient funds.");
      return;
    }
    acct.balance -= amount;
    logTx(acct, "WITHDRAW", amount, "Cash withdrawal");
    alert(`Withdrawal successful!\nNew Balance: ${fmtMoney(acct.balance)}`);
  }
  function viewBalance() {
    const acct = requireActiveOrPick();
    if (!acct) return;
    const pin = promptPin();
    if (pin === null) return;
    if (pin !== acct.pin) { alert("Incorrect PIN."); return; }
    alert(`Account: ${acct.number}\nName: ${acct.name}\nType: ${acct.type}\nBalance: ${fmtMoney(acct.balance)}`);
  }
  function viewTransactions() {
    const acct = requireActiveOrPick();
    if (!acct) return;
    if (acct.transactions.length === 0) {
      alert("No transactions yet.");
      return;
    }
    const lines = [
      `Transactions for ${acct.name} (${acct.number})`,
      ...acct.transactions.map(t => `${t.ts} | ${t.type} | ${t.amount ? fmtMoney(t.amount) : ""} | Bal: ${fmtMoney(t.balance)} ${t.note ? `| ${t.note}` : ""}`)
    ];
    alertLines(lines);
  }
  function switchActiveAccount() {
    const acct = chooseAccount("Select the account to set ACTIVE");
    if (!acct) return;
    activeAccountNumber = acct.number;
    alert("Active account updated. All new transactions will now be processed from this account.");
  }
  function closeAccount() {
    const acct = requireActiveOrPick();
    if (!acct) return;
    const confirm = promptChoice(
      `You are about to close account ${acct.number} (${acct.name}). This action is permanent.\n [1] Yes, close it\n [2] Cancel`,
      ["1","2"]
    );
    if (confirm === null || confirm === "2") { alert("Action cancelled."); return; }
    // final PIN check
    const pin = promptPin("Enter your 4-digit PIN to confirm closure:");
    if (pin === null) return;
    if (pin !== acct.pin) { alert("Incorrect PIN."); return; }
    const idx = accounts.findIndex(a => a.number === acct.number);
    if (idx >= 0) {
      logTx(acct, "CLOSE", 0, "Account closed");
      accounts.splice(idx, 1);
      if (activeAccountNumber === acct.number) activeAccountNumber = null;
      alert("We’re sorry to see you go. Your account has been closed safely.");
    }
  }
  function allAccountSummary() {
    if (accounts.length === 0) { alert("No accounts to display."); return; }
    const lines = [
      "All Accounts Summary:",
      ...accounts.map(a => `• ${a.number} — ${a.name} (${a.type}) | Bal: ${fmtMoney(a.balance)} ${activeAccountNumber === a.number ? "[ACTIVE]" : ""}`)
    ];
    alertLines(lines);
  }
  function exportSessionSummary() {
    const confirm = promptChoice(
      "Exporting your session summary will include recent transactions and activity.\n [1] Proceed\n [2] Cancel",
      ["1","2"]
    );
    if (confirm === null || confirm === "2") { alert("Action cancelled."); return; }
    const payload = {
      exportedAt: now(),
      activeAccountNumber,
      accounts
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MakeCodeLitBank_Session.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    alert("Export successful! A JSON file has been downloaded.");
  }
  function exit() {
    const confirm = promptChoice("Are you sure you want to exit?\n [1] Yes\n [2] No", ["1","2"]);
    if (confirm === null) return;
    if (confirm === "1") {
      running = false;
      alert("Session ended successfully. Thank you for choosing MakeCodeLit Bank!");
    } else {
      alert("Exit cancelled. Returning to main menu…");
    }
  }
  // The Main Loop
  function menu() {
    return prompt(
`Menu: Welcome to MakeCodeLitBank!
[1] Open Account
[2] Deposit
[3] Withdraw
[4] View Balance
[5] View Transactions
[6] Switch active account
[7] Close account
[8] All accounts summary
[9] Export session summary
[0] Exit
Select an option:`
    );
  }
  while (running) {
    const choice = menu();
    if (choice === null) { // treat cancel as exit prompt
      exit();
      continue;
    }
    switch (choice.trim()) {
      case "1": openAccount(); break;
      case "2": deposit(); break;
      case "3": withdraw(); break;
      case "4": viewBalance(); break;
      case "5": viewTransactions(); break;
      case "6": switchActiveAccount(); break;
      case "7": closeAccount(); break;
      case "8": allAccountSummary(); break;
      case "9": exportSessionSummary(); break;
      case "0": exit(); break;
      default: alert("Invalid input."); break;
    }
  }
})();
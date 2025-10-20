debugger
let accounts = [];

function myBank(){
    debugger
    let choice = prompt("Menu: Welcome to MakeCodeLitBank!\n [1.] Open Account\n [2.] Deposit\n [3.] Withdraw\n [4.] View Balance\n [5.] View Transaction\n [6.] Switch active account\n [7.] Close accounts\n [8.] All accounts summary\n [9.] Export session summary\n [0.] Exit\n Enter choice");
    if(choice === "1"){
        return openAccount();
    } else if(choice === "2"){
        return deposit();
    } else if(choice === "3"){
        return withdraw();
    } else if(choice === "4"){
        return viewBalance();
    } else if(choice === "5"){
        return viewTransacton();
    } else if(choice === "6"){
        return switchActiveAccount();
    } else if(choice === "7"){
       return closeAccount();
    } else if(choice === "8"){
        return allAccountSummary();
    } else if(choice === "9"){
        return exportSessionSummary();
    } else if(choice === "0"){
        return exit();
    } else {
        alert("Invalid Input.");
        myBank();
    }
}
myBank()

function openAccount(){
    debugger
    let open = prompt("To create an account with us, kindly provide us with the following information\n (1) Name\n (2) Phone number\n (3) Username\n (4) Password")
    if(open ==="1"){
        return prompt("Enter your fullname");
    }else if(open === "2"){
        return prompt("Enter your phone number");

    }else if(open === "3"){
        return prompt("Enter your username");

    }else if(open === "4"){
        return prompt("Enter your password");
    }else{
        alert("Please fill in your information."); 
    }
    accounts.push(open);
}    window.history.back();

function deposit(){
    debugger
    let open = prompt("Kindly provide the details\n (1) Account Number\n (2) Amount")
    if(open === "1"){
        return prompt("Account number:\n Enter your account number below")
    }else if(open === "2"){
        return prompt("Amount:\n Enter amount")
    }else{
        alert("Kindly select an option.");
    }
    accounts.push(open);
}

function withdraw(){
    debugger
    let open = prompt("Please ensure your account details are correct before proceeding with your withdrawal.\n 1. Account number\n 2. Amount")
    if(open === "1"){
        return prompt("Account number:\n Enter your account number below")
    }else if(open === "2"){
        return prompt("Amount:\n Enter amount")
    }else{
        alert("Kindly selct an option.")
    }
    
}

function viewBalance(){
    debugger
    let open = prompt("For security, enter your 4-digit PIN.\n 1. Pin")
    if(open === "1"){
        return prompt("Enter your PIN below");
    }else{
        alert("Kindly select an option");
    }
}

function viewTransacton(){
    debugger
    let open = prompt("Select the account to view transaction history:\n 1. Current\n 2. Savings\n 3. Cancel")
    if(open === "1"){
        alert("Account History")
    }else if(open === "2"){
        alert("Account History"); 
    }else if(open === "3"){
        return myBank()
    }
}

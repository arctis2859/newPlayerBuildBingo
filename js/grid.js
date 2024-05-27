(function() {
    createSessionToken();
}())

function createSessionToken() {
    var isTokenValid = false;
    if(localStorage.getItem('token') == null) {
        localStorage.setItem('token', encryptData((new Date()).toString()));
        createBingoBoard(true);
    } else {
        var decrypted = decryptData(localStorage.getItem('token'));
        var tokenDate = new Date(Date.parse(decrypted));

        if(tokenDate.setHours(0,0,0,0) != (new Date()).setHours(0,0,0,0)) {
            localStorage.clear();
            createSessionToken();
        }

        createBingoBoard(false);
    }
}

function encryptData(data) {
    var encrypted = CryptoJS.AES.encrypt(data, `Don't Cheat at HnS Bingo!`);
    return encrypted;
}

function decryptData(data) {
    var bytes = CryptoJS.AES.decrypt(data, `Don't Cheat at HnS Bingo!`);
    var decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
}

function addGridClick() {
    $('.grid-game > tr').on('click', 'td', function(event) {
        let cross = $(this).children('.cross-bingo');

        let rowNumber = $(this).attr('x');
        let rowData = localStorage.getItem(`rowState${rowNumber}`);
        let data = decryptData(rowData);
        rowData = JSON.parse(data);

        if(cross.hasClass('show')) {
            cross.removeClass('show');
            rowData[$(this).attr('y')] = '';
        } else if(!cross.hasClass('free-space')) {
            cross.addClass('show');
            rowData[$(this).attr('y')] = 'show';
        }

        localStorage.setItem(`rowState${rowNumber}`, encryptData(JSON.stringify(rowData)));
    });
}

function createBingoBoard(isTokenValid) {
    if(isTokenValid) {
        populateNewBingoBoard();
    } else {
        retrieveOldBoard();
    }
}

function populateNewBingoBoard() {
    $.get('/js/hnsbingo.txt', function(data) {
        bingoSquares = data.split('\n');

        shuffle(bingoSquares);
        
        var bingoBoard = [];
        var bingoRow = [];
        for(let i = 1; i <= 25; i++) {
            if(i == 13) {
                bingoRow.push("We shall never deny a guest, even the most ridiculous request");
            } else {
                bingoRow.push(bingoSquares[i-1]);

                if(i % 5 == 0) {
                    bingoBoard.push(bingoRow);
                    bingoRow = [];
                }
            }
        }
        $('.grid-game').empty();

        let rowNumber = 0;
        for(let row of bingoBoard) {
            newBingoRow(row, ['', '', '', '', ''], rowNumber);
            localStorage.setItem(`row${rowNumber}`, encryptData(JSON.stringify(row)));
            localStorage.setItem(`rowState${rowNumber++}`, encryptData(JSON.stringify(['', '', '', '', ''])));
        }

        addGridClick();
    })
}

function retrieveOldBoard() {
    $('.grid-game').empty();
    for(let i = 0; i <= 4; i++) {
        newBingoRow(
            JSON.parse(decryptData(localStorage.getItem(`row${i}`))),
            JSON.parse(decryptData(localStorage.getItem(`rowState${i}`))),
            i
        );
    }
    addGridClick();
}

function newBingoRow(row, state, rowNumber) {
    let freeSpace = (row[2] == 'We shall never deny a guest, even the most ridiculous request') ? 'free-space' : '';

    let newRow =
        `
        <tr>
            <td x="${rowNumber}" y="0">
                <span class="bingo-text">${row[0]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="#b13f43" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-x cross-bingo ${state[0]}">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                </svg>
            </td>
            <td x="${rowNumber}" y="1">
                <span class="bingo-text">${row[1]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="#b13f43" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-x cross-bingo ${state[1]}">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                </svg>
            </td>
            <td x="${rowNumber}" y="2">
                <span class="bingo-text">${row[2]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="#b13f43" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-x cross-bingo ${freeSpace} ${state[2]}">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                </svg>
            </td>
            <td x="${rowNumber}" y="3">
                <span class="bingo-text">${row[3]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="#b13f43" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-x cross-bingo ${state[3]}">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                </svg>
            </td>
            <td x="${rowNumber}" y="4">
                <span class="bingo-text">${row[4]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="#b13f43" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-x cross-bingo ${state[4]}">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                </svg>
            </td>
        <tr>
        `

    $('.grid-game').append(newRow);
}

function shuffle(array) {
    let currentIndex = array.length;
  
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }
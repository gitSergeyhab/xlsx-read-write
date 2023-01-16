// const XLSX = require('xlsx');


const Key = {
    Type: 'Вид сделки',
    ActiveCode: 'Код актива',
    Quantity: 'Количество',
    Comisson: "Комис\r\nсия брокера", 
    Sum: 'Сумма сделки',
    CountByOne: "Цена за едини\r\nцу"
}

const Code = {
    Silver: 'SLVRUB_TOM',
    Gold: 'GLDRUB_TOM',
    CNY: 'CNYRUB_TOM',
    HKD: 'HKDRUB_TOM',
    USD: 'USD000UTSTOM'
}

const fileInput = document.querySelector('#file');
const btnConvert = document.querySelector('#btn-convert');
const btnCount = document.querySelector('#btn-count');

const getDigitFromStr = (str) => {
    const maybeNum = +str.replace(',', '.');
    return isNaN(maybeNum) ? str : maybeNum
} 


const reader = new FileReader();
let file = null;
let readObj = {};

fileInput.addEventListener('change', (evt) => {file = evt.target.files[0]});

btnConvert.addEventListener('click', () => {
    if (file) {
        reader.readAsBinaryString(file);
        reader.onload = (evt) => {
            const data = evt.target.result;
            const workbook = XLSX.read(data, {type: "binary"});
            const sheetName = workbook.SheetNames[1];// 2!!
            readObj = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        }
    }
})


const nummirize = (obj) => {
    const repObj = {...obj};
    for (const [key, val] of Object.entries(repObj) ) {
        repObj[key] = getDigitFromStr(val)
    }
    return repObj
}


const getNeedData = (values, activeCode) => {

    const Sum = {
        BothOne: 0,
        SoldOne: 0,
        PriceBoth: 0,
        PriceSold: 0,
    };

    const needValues = values.filter((item) => item[Key.ActiveCode] === activeCode);

    const needValues1 = needValues.map((item) => nummirize(item));


    needValues1.forEach((item) => {

        if (item[Key.Type] === "Покупка") {
            Sum.BothOne += item[Key.Quantity];
            Sum.PriceBoth += item[Key.Sum] + item[Key.Comisson];
        } else if (item[Key.Type] === "Продажа") {

            Sum.SoldOne += item[Key.Quantity];
            Sum.PriceSold += item[Key.Sum] - item[Key.Comisson];
        }
    })

        const middleBoth = Sum.PriceBoth / Sum.BothOne;
        const middleSold = Sum.PriceSold / Sum.SoldOne;

        const result = (middleSold - middleBoth) * Sum.SoldOne;

        

    return  {name: activeCode, middleBoth, middleSold, quantity: Sum.SoldOne, result}
}




btnCount.addEventListener('click', () => {
    if (readObj) {
        const resultArr = [Code.Silver, Code.Gold, Code.CNY, Code.HKD, Code.USD].map((item) => getNeedData(readObj, item));
        const end = resultArr.reduce((acc, item) => acc + item.result , 0);
        const lastElem = {name: 'RESULT',  result: end}
        const resultArrWithEnd = [...resultArr, lastElem]
        const newWB = XLSX.utils.book_new();
        const newWS = XLSX.utils.json_to_sheet(resultArrWithEnd);
        XLSX.utils.book_append_sheet(newWB, newWS, 'NEW');
        XLSX.writeFile(newWB, 'new-file.xlsx');
    }
})



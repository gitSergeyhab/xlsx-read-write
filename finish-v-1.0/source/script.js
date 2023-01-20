// const XLSX = require('xlsx');

const {Code} = Settings;

let fileOwn = null;
let fileOJ = null;

let ownRawDataList = [];
let ojRawDataList = [];
let unionDataList = [];

const readerOwn = new FileReader();
const readerOJ = new FileReader();

new AirDatepicker('#air-datepicker', {autoClose: true, position: 'bottom center'});


const fileInputOwn = document.querySelector('#file-own');
const fileInputOJ = document.querySelector('#file-oj');

const btnAddData = document.querySelector('#btn-add-all');

const btnShowOwn = document.querySelector('#btn-show-own');
const btnShowOJ = document.querySelector('#btn-show-oj');

const btnConvertData = document.querySelector('#btn-convert-all');

const btnShowResult = document.querySelector('#btn-show-result');
const btnShowResultNames = document.querySelector('#btn-show-result-names');
const btnShowNames = document.querySelector('#btn-show-names');

const btnWrite = document.querySelector('#btn-write');

const picker = document.querySelector('#air-datepicker');


const table = document.querySelector('#table');
const divNames = document.querySelector('#names');
const error = document.querySelector('#error');


const clearError = () => error.textContent = '';
const addNoDateError = () => error.textContent = 'Сначала Нужно достать данные';


fileInputOwn.addEventListener('change', (evt) => {fileOwn = evt.target.files[0]});
fileInputOJ.addEventListener('change', (evt) => {fileOJ = evt.target.files[0]});




btnAddData.addEventListener('click', () => {

    if (fileOwn && fileOJ) {
		clearError();
		readerOwn.readAsBinaryString(fileOwn);
		readerOJ.readAsBinaryString(fileOJ);

		readerOwn.onload = (evt) => {
			const data = evt.target.result;
			const workbook = XLSX.read(data, {type:"binary", cellDates: true});
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			const range = XLSX.utils.decode_range(worksheet['!ref']);
			range.s.r = 2; // <-- zero-indexed, so setting to 1 will skip row 0
			worksheet['!ref'] = XLSX.utils.encode_range(range);
			ownRawDataList = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

        }

		readerOJ.onload = (evt) => {
			const data = evt.target.result;
			const workbook = XLSX.read(data, {type:"binary", cellDates: true});
			const sheetName = workbook.SheetNames[0];
			ojRawDataList = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        }
    } else if (!fileOwn && !fileOJ) {
		error.textContent = 'Файлы не загружен'
	} else if (!fileOwn) {
		error.textContent = 'Файл таблицы не загружен'
	} else if (!fileOJ) {
		error.textContent = 'Файл журнала не загружен'
	}
})


btnShowOwn.addEventListener('click', () => {
    if (ownRawDataList.length) {
		clearError();
		const showList = Convert.convertToShow(ownRawDataList)
		table.innerHTML = Render.createTable(showList, Header.Read);
		divNames.innerHTML = '';
    } else {
		addNoDateError();
	}
})

btnShowOJ.addEventListener('click', () => {
    if (ojRawDataList.length) {
		clearError();
		const showList = Convert.convertToShowOJ(ojRawDataList)
		table.innerHTML = Render.createTable(showList, Header.Read);
		divNames.innerHTML = '';
    } else {
		addNoDateError();
	}
})


const filterByNRNumber = (dataList) => {
	const {N, R} = Settings.Column.Read
	const filteredList = []
	const narDict = {};
	const rasDict = {};

	dataList.forEach((item) => {
		const narNum = item[N];
		const rasNum = item[R]
		if (narNum && !narDict[narNum]) {
			narDict[narNum] = true;
			filteredList.push(item);
		}

		if (rasNum && !rasDict[rasNum]) {
			rasDict[rasNum] = true;
			filteredList.push(item);
		} 
		if (!narNum && !rasNum) {
			filteredList.push(item);
		}

	})
	return filteredList;
}

const filterByPeriod = (dataList, date) => 
	dataList.filter((item) => Sort.compareByDate(item[Settings.Column.Read.Date], date) >= 0);


btnConvertData.addEventListener('click', () => {
	const date = picker.value;

    if (ojRawDataList.length && ownRawDataList.length && date) {
		clearError();
		const ojData = Convert.convertToFileData(ojRawDataList);
		const data = [...ojData, ...ownRawDataList];
		const sortedData = Sort.sortListByDate(data);
		const filteredList = filterByNRNumber(sortedData);
		unionDataList = filterByPeriod(filteredList, date);
    } else if (!data) {
		error.textContent = 'нужно выбрать дату начала периода'
	} else {
		addNoDateError();

	}
})





btnWrite.addEventListener('click', () => {
	// const picker = document.querySelector('#air-datepicker');
	// const xx = document.querySelector('#xx');


	console.log(picker.value)
})



// btnConvert.addEventListener('click', () => {
//     if (file) {
// 		clearError();
// 		reader.readAsBinaryString(file);

// 		reader.onload = (evt) => {
// 			const data = evt.target.result;
// 			const workbook = XLSX.read(data, {type:"binary", cellDates: true});
// 			const sheetName = workbook.SheetNames[0];
// 			const worksheet = workbook.Sheets[sheetName];
// 			const range = XLSX.utils.decode_range(worksheet['!ref']);
// 			range.s.r = 2; // <-- zero-indexed, so setting to 1 will skip row 0
// 			worksheet['!ref'] = XLSX.utils.encode_range(range);
// 			readObjList = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
//         }
//     } else {
// 		error.textContent = 'Файл не загружен'
// 	}
// })


// btnShow.addEventListener('click', () => {
//     if (readObjList.length) {
// 		clearError();
// 		const showList = Convert.convertToShow(readObjList)
// 		table.innerHTML = Render.createTable(showList, Header.Write);
// 		divNames.innerHTML = '';
//     } else {
// 		addNoDateError();
// 	}
// })

// btnWrite.addEventListener('click', () => {
//     if (readObjList.length) {
		// const newObjList = Convert.getFullObjList(readObjList)
// 		const newWB = XLSX.utils.book_new();
// 		const newWS = XLSX.utils.json_to_sheet(newObjList, {header: Header.Write});
// 		XLSX.utils.book_append_sheet(newWB, newWS, 'NEW');
// 		XLSX.writeFile(newWB, 'new-file.xlsx');
//     } else {
// 		addNoDateError();
// 	}
// })


// btnNames.addEventListener('click', () => {
//     if (readObjList.length) {
// 		const names = Convert.getNamesAndCountList(readObjList);
// 		const sortedNames = Sort.sortListByNames(names);
// 		divNames.innerHTML = Render.createUl(sortedNames);
// 		table.innerHTML = '';
// 	} else {
// 		addNoDateError();
// 	}
// })

// //_____ OJ _______


// fileInputOJ.addEventListener('change', (evt) => {fileOJ = evt.target.files[0]});

// btnConvertOJ.addEventListener('click', () => {
//     if (fileOJ) {
// 		clearError();
// 		readerOJ.readAsBinaryString(fileOJ);

// 		readerOJ.onload = (evt) => {
// 			const data = evt.target.result;
// 			const workbook = XLSX.read(data, {type:"binary", cellDates: true});
// 			const sheetName = workbook.SheetNames[0];
// 			readObjListOJ = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
//         }
//     } else {
// 		error.textContent = 'Файл не загружен'
// 	}
// })


// btnShowOJ.addEventListener('click', () => {
//     if (readObjListOJ.length) {
// 		clearError();
// 		const showList = Convert.convertToShowOJ(readObjListOJ)
// 		table.innerHTML = Render.createTable(showList, Header.Read);
// 		divNames.innerHTML = '';
//     } else {
// 		addNoDateError();
// 	}
// })

// btnWriteOJ.addEventListener('click', () => {
//     if (readObjListOJ.length) {
// 		const newObj = Convert.convertToFileData(readObjListOJ)
// 		const newWB = XLSX.utils.book_new();
// 		const newWS = XLSX.utils.json_to_sheet(newObj, {header: Header.Read});
// 		XLSX.utils.book_append_sheet(newWB, newWS, 'NEW');
// 		XLSX.writeFile(newWB, 'new-file.xlsx');
//     } else {
// 		addNoDateError();
// 	}
// })



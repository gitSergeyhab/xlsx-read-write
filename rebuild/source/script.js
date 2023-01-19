// const XLSX = require('xlsx');

const {Code} = Settings;

const fileInput = document.querySelector('#file');
const btnConvert = document.querySelector('#btn-convert');
const btnShow = document.querySelector('#btn-show');
const btnNames = document.querySelector('#btn-names');
const btnWrite = document.querySelector('#btn-write');

const fileInputOJ = document.querySelector('#file-oj');
const btnConvertOJ = document.querySelector('#btn-convert-oj');
const btnShowOJ = document.querySelector('#btn-show-oj');
const btnNamesOJ = document.querySelector('#btn-names-oj');
const btnWriteOJ = document.querySelector('#btn-write-oj');

const table = document.querySelector('#table');
const divNames = document.querySelector('#names');
const error = document.querySelector('#error');

const clearError = () => error.textContent = '';
const addNoDateError = () => error.textContent = 'Сначала Нужно достать данные';


const reader = new FileReader();
let file = null;
let readObjList = [];


fileInput.addEventListener('change', (evt) => {file = evt.target.files[0]});

btnConvert.addEventListener('click', () => {
    if (file) {
		clearError();
		reader.readAsBinaryString(file);

		reader.onload = (evt) => {
			const data = evt.target.result;
			const workbook = XLSX.read(data, {type:"binary", cellDates: true});
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			const range = XLSX.utils.decode_range(worksheet['!ref']);
			range.s.r = 2; // <-- zero-indexed, so setting to 1 will skip row 0
			worksheet['!ref'] = XLSX.utils.encode_range(range);
			readObjList = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        }
    } else {
		error.textContent = 'Файл не загружен'
	}
})


btnShow.addEventListener('click', () => {
    if (readObjList.length) {
		clearError();
		const showList = Convert.convertToShow(readObjList)
		table.innerHTML = Render.createTable(showList, Header.Write);
		divNames.innerHTML = '';
    } else {
		addNoDateError();
	}
})

btnWrite.addEventListener('click', () => {
    if (readObjList.length) {
		const newObjList = Convert.getFullObjList(readObjList)
		const newWB = XLSX.utils.book_new();
		const newWS = XLSX.utils.json_to_sheet(newObjList, {header: Header.Write});
		XLSX.utils.book_append_sheet(newWB, newWS, 'NEW');
		XLSX.writeFile(newWB, 'new-file.xlsx');
    } else {
		addNoDateError();
	}
})


btnNames.addEventListener('click', () => {
    if (readObjList.length) {
		const names = Convert.getNamesAndCountList(readObjList);
		const sortedNames = Sort.sortListByNames(names);
		divNames.innerHTML = Render.createUl(sortedNames);
		table.innerHTML = '';
	} else {
		addNoDateError();
	}
})

//_____ OJ _______
const readerOJ = new FileReader();
let fileOJ = null;
let readObjListOJ = [];

fileInputOJ.addEventListener('change', (evt) => {fileOJ = evt.target.files[0]});

btnConvertOJ.addEventListener('click', () => {
    if (fileOJ) {
		clearError();
		readerOJ.readAsBinaryString(fileOJ);

		readerOJ.onload = (evt) => {
			const data = evt.target.result;
			const workbook = XLSX.read(data, {type:"binary", cellDates: true});
			const sheetName = workbook.SheetNames[0];
			readObjListOJ = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        }
    } else {
		error.textContent = 'Файл не загружен'
	}
})


btnShowOJ.addEventListener('click', () => {
    if (readObjListOJ.length) {
		clearError();
		const showList = Convert.convertToShowOJ(readObjListOJ)
		table.innerHTML = Render.createTable(showList, Header.Read);
		divNames.innerHTML = '';
    } else {
		addNoDateError();
	}
})

btnWriteOJ.addEventListener('click', () => {
    if (readObjListOJ.length) {
		const newObj = Convert.convertToFileData(readObjListOJ)
		const newWB = XLSX.utils.book_new();
		const newWS = XLSX.utils.json_to_sheet(newObj, {header: Header.Read});
		XLSX.utils.book_append_sheet(newWB, newWS, 'NEW');
		XLSX.writeFile(newWB, 'new-file.xlsx');
    } else {
		addNoDateError();
	}
})



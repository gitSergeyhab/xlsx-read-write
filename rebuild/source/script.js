// const XLSX = require('xlsx');

const {Code} = Settings;

// const orderedHeaders = [
// 	Read.Part, Read.Date, 
// 	Read.N, Read.R, Read.Obj, Read.Work, 
// 	Read.Action, Read.PRM, Read.Watch, Read.Count, 
// 	ReadAdd.Name, ReadAdd.FilesCount
// ]

const fileInput = document.querySelector('#file');
const btnConvert = document.querySelector('#btn-convert');
const btnShow = document.querySelector('#btn-show');
const btnNames = document.querySelector('#btn-names');
const btnWrite = document.querySelector('#btn-write');
const table = document.querySelector('#table');
const divNames = document.querySelector('#names');
const error = document.querySelector('#error')


const reader = new FileReader();
let file = null;
let readObjList = [];

const clearError = () => error.textContent = '';
const addNoDateError = () => error.textContent = 'Сначала Нужно достать данные';


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
		table.innerHTML = Render.createTable(readObjList);
		divNames.innerHTML = '';
    } else {
		addNoDateError();
	}
})

btnWrite.addEventListener('click', () => {
    if (readObjList.length) {
		const newObj = Convert.getFullObj(readObjList)
		const newWB = XLSX.utils.book_new();
		const newWS = XLSX.utils.json_to_sheet(newObj, {header: Header.Write});
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
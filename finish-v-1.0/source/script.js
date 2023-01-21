// const XLSX = require('xlsx');

const {Code} = Settings;

let fileOwn = null;
let fileOJ = null;

let ownRawDataList = [];
let ojRawDataList = [];
let unionDataList = [];
const folderList = [];


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

const folders = document.querySelectorAll('.folder');

const table = document.querySelector('#table');
const divNames = document.querySelector('#names');
const error = document.querySelector('#error');

fileInputOwn.addEventListener('change', (evt) => {fileOwn = evt.target.files[0]});
fileInputOJ.addEventListener('change', (evt) => {fileOJ = evt.target.files[0]});
folders.forEach((item) => {item.addEventListener('change', (evt) => folderList.push(evt.target.files))})


const setError = (message) => {
	if (Array.isArray(message)) {
		console.log('Array')
		const text = message.join('. ');
		console.log(text)
		error.innerHTML = text;
	} else {
		error.innerHTML = message;
	}
}


const Message = {
	NoOwn: 'Не загружен файл своей таблицы',
	NoOJ: 'Не загружен файл выгрузки журнала',
	NoDate: 'Не выбрана дата',
	NoExtractData: 'Нужно сначала достать данные (п.2)',
	NoConvertData: 'Нужно сначала обработать данные (п.3)'
}


btnAddData.addEventListener('click', () => {

    if (fileOwn && fileOJ) {
		setError('');
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
		setError([Message.NoOwn, Message.NoOJ]);
	} else if (!fileOwn) {
		setError([Message.NoOwn]);
	} else if (!fileOJ) {
		setError([ Message.NoOJ]);
	}
})


btnShowOwn.addEventListener('click', () => {
    if (ownRawDataList.length) {
		setError('');
		const showList = Convert.convertToShow(ownRawDataList);
		table.innerHTML = Render.createTable(showList, Header.Read);
		divNames.innerHTML = '';
    } else {
		setError(Message.NoExtractData)
	}
})

btnShowOJ.addEventListener('click', () => {
    if (ojRawDataList.length) {
		setError('');
		const showList = Convert.convertToShowOJ(ojRawDataList);
		table.innerHTML = Render.createTable(showList, Header.Read);
		divNames.innerHTML = '';
    } else {
		setError(Message.NoExtractData);
	}
})


btnConvertData.addEventListener('click', () => {
	const date = picker.value;
    if (ojRawDataList.length && ownRawDataList.length && date) {
		setError('');
		const ojData = Convert.convertToFileData(ojRawDataList);
		const data = [...ojData, ...ownRawDataList];
		const sortedData = Sort.sortDataList(data);
		const filteredList = Convert.filterByNRNumber(sortedData);
		unionDataList = Convert.filterByPeriod(filteredList, date);
    } else if (!date && !ojRawDataList.length && !ownRawDataList.length) {
		setError([Message.NoDate, Message.NoExtractData]);
	} else {
		setError(Message.NoDate);
	}
})


btnShowResult.addEventListener('click', () => {
	if (unionDataList.length) {
		setError('');
		const showList = Convert.convertObjListToListList(Header.Read, unionDataList);
		table.innerHTML = Render.createTable(showList, Header.Read);
		divNames.innerHTML = '';
	} else {
		setError(Message.NoConvertData);
	}
})

btnShowResultNames.addEventListener('click', () => {
	if (unionDataList.length) {
		setError('');
		const fullList = Convert.getFullObjList(unionDataList);
		const showList = Convert.convertObjListToListList(Header.Write, fullList);
		table.innerHTML = Render.createTable(showList, Header.Write);
		divNames.innerHTML = '';
	} else {
		setError(Message.NoConvertData);
	}
})

btnShowNames.addEventListener('click', () => {
	const date = picker.value;
	if (unionDataList.length && folderList.length && date) {
		setError('');
		const {Name} = Settings.Column.ReadAdd;
		const folderFileNames = Utils.extractFileNamesFromFolderList(folderList);
		const filteredFolders = Utils.filterFilenamesByDate(folderFileNames, date);
		filteredFolders.sort(Sort.compareNames);
		const tableFileNames = Convert.getNamesAndCountList(unionDataList);
		tableFileNames.sort((a,b) => Sort.compareNames(a[Name], b[Name]));
		divNames.innerHTML = Render.createUlContainer(filteredFolders, tableFileNames);
		table.innerHTML = '';
    } else if (!unionDataList.length && !folderList.length && !date) {
		setError([Message.NoDate, Message.NoConvertData]);
	} else {
		setError(Message.NoDate);
	}
})


btnWrite.addEventListener('click', () => {
    if (unionDataList.length) {
		setError('');
		const newWB = XLSX.utils.book_new();
		const newWS = XLSX.utils.json_to_sheet(unionDataList, {header: Header.Read});
		XLSX.utils.book_append_sheet(newWB, newWS, 'NEW');
		XLSX.writeFile(newWB, 'new-file.xlsx');
    } else {
		setError(Message.NoConvertData);
	}
})

// const XLSX = require('xlsx');

const PART = 'ТУ';
const Column = {
	Part: 'учаcток',
	Date: 'дата',
	N: 'н',
	R: 'р',
	Obj: 'объект',
	Work: 'работа',
	Action: 'переключения',
	PRM: 'допуск',
	Watch: 'осмотр',
	Count: 'учет',
	Name: 'имя файла',
	FilesCount: 'количество файлов'
}

const Code = {
	Part: PART,
	N: 'Н',
	R: 'Р',
	Action: 'ПЕР',
	PRM: 'ПРМ',
	Watch: 'ОСМ',
	Count: 'ПУ',
	ACT: 'АКТ'
}

const orderedHeaders = [
	Column.Part, Column.Date, 
	Column.N, Column.R, Column.Obj, Column.Work, 
	Column.Action, Column.PRM, Column.Watch, Column.Count, 
	Column.Name, Column.FilesCount
]

const fileInput = document.querySelector('#file');
const btnConvert = document.querySelector('#btn-convert');
const btnShow = document.querySelector('#btn-show');
const btnWrite = document.querySelector('#btn-write');
const table = document.querySelector('#table');

const add_BP_toWork = (work) => {
	if (!work) {
		return '';
	}
	if (isNaN(+work[0])) {
		return work
	}

	return `БП ${work}`
}


const createFileName = (obj) => {

	const Part = obj[Column.Part];
	const Date = obj[Column.Date];
	const N = obj[Column.N];
	const R = obj[Column.R];
	const Obj = obj[Column.Obj];
	const Work = obj[Column.Work];
	const Action = obj[Column.Action];
	const PRM = obj[Column.PRM];
	const Watch = obj[Column.Watch];
	const Count = obj[Column.Count];

	const n = N ? `Н ${N}` : '';
	const r = R ? `Р ${R}` : '';

	const action = Action ? Code.Action : '';
	const prm = PRM ? Code.PRM : '';
	const watch = Watch ? Code.Watch : '';
	const count = Count ? Code.Count : '';

	const type = [action, prm, watch, count].filter((x) => x).join('_');
	const last = [n, r,  add_BP_toWork(Work) ].filter((x) => x).join('_');

	return [Date, Part, Obj, type, last].filter((x) => x).join('_');
}


const countFiles = (obj) => {
	const Action = obj[Column.Action];
	const PRM = obj[Column.PRM];
	const Watch = obj[Column.Watch];
	const Count = obj[Column.Count];
	const count = [Action, PRM, Watch, Count].filter((x) => x).reduce((acc, item) => acc + +item, 0);
	return count;
}


const reader = new FileReader();
let file = null;
let readObjList = [];

fileInput.addEventListener('change', (evt) => {file = evt.target.files[0]});

btnConvert.addEventListener('click', () => {
    if (file) {
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
    }
})


const convertObjListToListList = (keys, objList) => {
	const arr = [];

	objList.forEach((item) => {
		const innerArr = [];
		for (const key of keys) {
			if (item[key]) {
				innerArr.push(item[key]);
			} else {
				innerArr.push('');
			}
		}
		arr.push(innerArr);
	})
	return arr;
} 

const getR = (value) => `<tr>${value}</tr>`;
const getTH = (value) => `<th>${value}</th>`;
const getTD = (value) => `<td>${value}</td>`;


const getTDElements = (elements) => elements.map(getTD).join('');

const getTableBody = (listOfDataList) => {
	const rows = listOfDataList.map((item) => getR(getTDElements(item)));
	return rows.join('');
}


const getFullObj = (obj) => obj.map((item) => ({...item, [Column.Name]: createFileName (item), [Column.FilesCount]: countFiles (item)  }));

const createTable = (obj) => {
	const fullObj = getFullObj(obj);
	const listOfDataList = convertObjListToListList(orderedHeaders, fullObj);
	const tableBody = getTableBody(listOfDataList);
	
	const thElements = orderedHeaders.map((item) => getTH(item));
	const headerRow = getR(thElements.join(''));

	const tableStr = headerRow + tableBody;
	return tableStr
}


btnShow.addEventListener('click', () => {
    if (readObjList) {
		table.innerHTML = createTable(readObjList);
    }
})

btnWrite.addEventListener('click', () => {
    if (readObjList) {
		const newObj = getFullObj(readObjList)
        const newWB = XLSX.utils.book_new();
        const newWS = XLSX.utils.json_to_sheet(newObj);
        XLSX.utils.book_append_sheet(newWB, newWS, 'NEW');
        XLSX.writeFile(newWB, 'new-file.xlsx');
    }
})

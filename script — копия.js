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
}

const Code = {
	Part: PART,
	N: 'Н',
	R: 'Р',
	Action: 'ПЕР',
	PRM: 'ПРМ',
	Watch: 'ОСМ',
	Count: 'ПУ',
	ACT: 'АКТ',	
}



const fileInput = document.querySelector('#file');
const btnConvert = document.querySelector('#btn-convert');
const btnWrite = document.querySelector('#btn-write');




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
	const last = [n, r, Work].filter((x) => x).join('_');

	return [Date, Part, Obj, type, last].filter((x) => x).join('_');
}

const countFiles = (obj) => {
	const Action = obj[Column.Action];
	const PRM = obj[Column.PRM];
	const Watch = obj[Column.Watch];
	const Count = obj[Column.Count];
	console.log([Action, PRM, Watch, Count])
	const count = [Action, PRM, Watch, Count].filter((x) => x).reduce((acc, item) => acc + +item, 0);
	return count;
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
            const workbook = XLSX.read(data, {type:"binary", cellDates: true});

            const sheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[sheetName];
		const range = XLSX.utils.decode_range(worksheet['!ref']);
		range.s.r = 2; // <-- zero-indexed, so setting to 1 will skip row 0
		worksheet['!ref'] = XLSX.utils.encode_range(range);
            readObj = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		readObj.forEach((item) => console.log(item, createFileName (item)))

        }
    }
})







btnWrite.addEventListener('click', () => {
    if (readObj) {

	const newObj = readObj.map((item) => ({...item, 'имя файла... примерное': createFileName (item), 'количество файлов': countFiles (item)  }))
        const newWB = XLSX.utils.book_new();
        const newWS = XLSX.utils.json_to_sheet(newObj);
        XLSX.utils.book_append_sheet(newWB, newWS, 'NEW');
        XLSX.writeFile(newWB, 'new-file.xlsx');
    }
})


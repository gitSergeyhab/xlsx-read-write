const getTR = (value) => `<tr>${value}</tr>`;
const getTH = (value) => `<th>${value}</th>`;
const getTD = (value) => `<td>${value}</td>`;


const getTDElements = (elements) => elements.map(getTD).join('');

const getTableBody = (listOfDataList) => {
	console.log(listOfDataList)
	const rows = listOfDataList.map((item) => getTR(getTDElements(item)));
	return rows.join('');
}

Render.createLi = (idx, element) => {
	const {FilesCount, Name} = Settings.Column.ReadAdd;
	const fileName =  element[Name];
	const count =  element[FilesCount];
	return `
	<li>
		<i>${idx}. </i>
		<label for="${idx}">
			<input type="checkbox" class="checkbox" id="${idx}"/> 
			<strong>${fileName}</strong> 
			<i> файлов: ${count}</i>
		</label>
	</li>
	`
}


Render.createUl = (fileNameList) => {
	const liElements = fileNameList.map((item, i) => Render.createLi(i+1, item))
	return `<ul>${liElements.join('\n')}</ul>`
}


// Render.createTable = (objList) => {
// 	const fullObj = Convert.getFullObjList(objList);
// 	const listOfDataList = Convert.convertObjListToListList(Header.Write, fullObj);
// 	const tableBody = getTableBody(listOfDataList);

// 	const thElements = Header.Write.map((item) => getTH(item));
// 	const headerRow = getTR(thElements.join(''));

// 	const tableStr = headerRow + tableBody;
// 	return tableStr
// }

Render.createTable = (objList, headers) => {
	const tableBody = getTableBody(objList);
	const thElements = headers.map((item) => getTH(item));
	const headerRow = getTR(thElements.join(''));
	const tableStr = headerRow + tableBody;
	return tableStr
}
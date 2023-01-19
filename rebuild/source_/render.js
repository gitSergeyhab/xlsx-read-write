const getTR = (value) => `<tr>${value}</tr>`;
const getTH = (value) => `<th>${value}</th>`;
const getTD = (value) => `<td>${value}</td>`;


const getTDElements = (elements) => elements.map(getTD).join('');

const getTableBody = (listOfDataList) => {
	const rows = listOfDataList.map((item) => getTR(getTDElements(item)));
	return rows.join('');
}

Render.createLi = (idx, element) => {
	const fileName =  element[Column.Name];
	const count =  element[Column.FilesCount];
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


Render.createTable = (objList) => {

	const tableBody = getTableBody(objList);
	const thElements = orderedHeaders.map((item) => getTH(item));
	const headerRow = getTR(thElements.join(''));
	const tableStr = headerRow + tableBody;
	return tableStr
}
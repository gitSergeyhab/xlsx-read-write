const getTR = (value) => `<tr>${value}</tr>`;
const getTH = (value) => `<th>${value}</th>`;
const getTD = (value) => `<td>${value}</td>`;


const getTDElements = (elements) => elements.map(getTD).join('');

const getTableBody = (listOfDataList) => {
	const rows = listOfDataList.map((item) => getTR(getTDElements(item)));
	return rows.join('');
}

Render.createLi = (idx, element) => {
	const {FilesCount, Name} = Settings.Column.ReadAdd;
	const fileName =  element[Name];
	const count =  element[FilesCount];
	const marker = Utils.getMarkerStr(fileName);
	const markerBlock = marker ? `< <span class="marker"> ${marker} </span> >` : '';
	return `
	<li>
		<i>${idx}. </i>
		<label for="${idx}">
			<input type="checkbox" class="checkbox" id="${idx}"/> 
			<strong>${fileName}</strong> 
			<i> файлов: ${count}</i>
			${markerBlock}
		</label>
	</li>
	`;
}

Render.createSimpleLi = (idx, name) => {
	const marker = Utils.getMarkerStr(name);
	const markerBlock = marker ? `< <span class="marker"> ${marker} </span> >` : '';
	return `
	<li>
		<i>${idx}. </i>
		<label for="f-${idx}">
			<input type="checkbox" class="checkbox" id="f-${idx}"/> 
			<strong>${name}</strong> 
			${markerBlock}
		</label>
	</li>
	`;
} 



Render.createUl = (fileNameList, fnRenderLi, marker) => {
	const liElements = fileNameList.map((item, i) => fnRenderLi(i+1, item));

	const header = marker ? 'Такие файлы есть' : 'А примерно такие должны быть';
	return `<div><h4>${header}</h4><ul>${liElements.join('\n')}</ul></div>`;
}

Render.createUlContainer = (folderEls, tableEls) => {
	const folderUl = Render.createUl(folderEls, Render.createSimpleLi, 1);
	const tableUl = Render.createUl(tableEls, Render.createLi)
	return `<div class="ul-container">${folderUl}${tableUl}</div>`;
}

Render.createTable = (objList, headers) => {
	const tableBody = getTableBody(objList);
	const thElements = headers.map((item) => getTH(item));
	const headerRow = getTR(thElements.join(''));
	const tableStr = headerRow + tableBody;
	return tableStr
}
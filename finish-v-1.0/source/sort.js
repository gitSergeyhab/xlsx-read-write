

const getDateFromFileName = (fileName) => fileName.split('_')[0];



Sort.compareByDate = (a, b) => Utils.getDateStampFromString(a) - Utils.getDateStampFromString(b);

Sort.compareByName = (a, b) =>  a.localeCompare(b);

Sort.compareFileNames = (a, b) => {
	if (getDateFromFileName(a) === getDateFromFileName(b)) {
		return Sort.compareByName(a,b);
	}
	return Sort.compareByDate(a, b);
};

Sort.sortListByNames = (objList) => {
	const {Name} = Settings.Column.ReadAdd
	const copy = [...objList];
	copy.sort((a,b) => Sort.compareFileNames(getDateFromFileName(a[Name]), getDateFromFileName(b[Name])))
	return copy;
}

Sort.sortListByDate = (objList) => {
	const {Date} = Settings.Column.Read;
	const copy = [...objList];
	copy.sort((a,b) => Sort.compareByDate(a[Date], b[Date]) )
	return copy;
}

Sort.compareByDateNR = (a, b) => {
	const {Date, N, R} = Settings.Column.Read;
	const aDate = a[Date];
	const aN = +a[N];
	const aR = +a[R];
	const bDate = b[Date];
	const bN = +b[N];
	const bR = +b[R];

	const diffDate = Sort.compareByDate(aDate, bDate)

	if (diffDate) {
		return diffDate
	}

	if (aN && bN) {
		return aN - bN;
	}
	if (aN && !bN) {
		return 1;
	}

	if (!aN && bN) {
		return -1;
	}

	if (aR && bR) {
		return aR - bR;
	}
	if (aR && !bR) {
		return 1;
	}

	if (!aR && bR) {
		return -1;
	}

	return -1;
}

Sort.sortDataList = (objList) => {
	const copy = [...objList];
	copy.sort((a, b) => Sort.compareByDateNR(a, b));
	return copy;
}


Sort.compareNames = (a, b) => {
	const marker = '_ТУ_';
	const aNames = a.split(marker);
	const bNames = b.split(marker);

	if(aNames.length < 2) {
		return 1;
	}

	if(bNames.length < 2) {
		return -1;
	}

	const diffDate = Sort.compareByDate(aNames[0], bNames[0])



	if (diffDate) {
		return diffDate
	}
	console.log()
	return Sort.compareByName(aNames[1], bNames[1])
}

// Sort.sortNameList = (nameList) => {
// 	const copy = [...nameList];
// 	copy.sort(Sort.compareNames);
// 	return copy;
// }
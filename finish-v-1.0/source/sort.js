Sort.getDateStampFromString = (str) => {
	const [day, month, year] = str.split('.').map((x) => +x);
	const trueYear = year > 2000 ? year : 2000 + year;
	console.log(new Date(trueYear, month - 1, day).getTime() > 1671570000000, str, '21.12.2022');
	return new Date(trueYear, month - 1, day).getTime();
}

const getDateFromFileName = (fileName) => fileName.split('_')[0];



Sort.compareByDate = (a, b) => Sort.getDateStampFromString(a) - Sort.getDateStampFromString(b);

Sort.compareByName = (a, b) =>  a.localeCompare(b);

Sort.compareFileNames = (a, b) => {
	if (getDateFromFileName(a) === getDateFromFileName(b)) {
		return Sort.compareByName(a,b)
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
const getDateStr = (fileName) => fileName.split('_')[0];

const getDate = (fileName) => {
	const date = getDateStr(fileName);
	const dateArr = date.split('.').map(x => +x);
	const numDate = dateArr[0] + dateArr[1] * 30 + dateArr[2] * 365;
	return numDate;
}


Sort.compareByDate = (a, b) => getDate(a) - getDate(b);

Sort.compareByName = (a, b) =>  a.localeCompare(b);

Sort.compareFileNames = (a, b) => {
	if (getDateStr(a) === getDateStr(b)) {
		return Sort.compareByName(a,b)
	}
	return Sort.compareByDate(a, b);
};

Sort.sortListByNames = (objList) => {
	const {Name} = Settings.Column.ReadAdd
	const copy = [...objList];
	copy.sort((a,b) => Sort.compareFileNames(a[Name], b[Name]))
	return copy;
}
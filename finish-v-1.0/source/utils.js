const add_BP_toWork = (work) => {
	if (!work) {
		return '';
	}
	if (isNaN(+work[0])) {
		return work
	}

	return `БП ${work}`
}

const checkStartWork = (obj) => {
	const {Content} = Settings.Column.ReadDown;
	return (obj[Content].indexOf('закончена') === -1) && (obj[Content][0] === 'П')
}  

Utils.filterByContain = (objList) => objList.filter(checkStartWork);

Utils.getDateStampFromString = (str) => {
	const [day, month, year] = str.split('.').map((x) => +x);
	const trueYear = year > 2000 ? year : 2000 + year;
	// console.log(new Date(trueYear, month - 1, day).getTime() > 1671570000000, str, '21.12.2022');
	return new Date(trueYear, month - 1, day).getTime();
}


Utils.createFileName = (obj) => {
	const {Read} = Settings.Column 

	const Part = obj[Read.Part];
	const Date = obj[Read.Date];
	const N = obj[Read.N];
	const R = obj[Read.R];
	const Obj = obj[Read.Obj];
	const Work = obj[Read.Work];
	const Action = obj[Read.Action];
	const PRM = obj[Read.PRM];
	const Watch = obj[Read.Watch];
	const Count = obj[Read.Count];

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


Utils.countFiles = (obj) => {
	const {Read} = Settings.Column 
	const Action = obj[Read.Action];
	const PRM = obj[Read.PRM];
	const Watch = obj[Read.Watch];
	const Count = obj[Read.Count];
	const count = [Action, PRM, Watch, Count].filter((x) => x).reduce((acc, item) => acc + +item, 0);
	return count;
}

Utils.extractFileNamesFromFolderList = (folders) => {
	return folders.reduce((acc, item) => {
		for (const file of Object.values(item)) {
			acc.push(file.name)
		}
		return acc;
	} , []);
}

Utils.checkDate = (date, markerDate) => 
	Utils.getDateStampFromString(date) >= Utils.getDateStampFromString(markerDate)

Utils.filterFilenamesByDate = (filenames, markerDate) => {
	return filenames.filter((item) => {
		const splitted = item.split(Settings.Markers.SplitDate);
		if (splitted.length < 2) {
			return false;
		}

		return Utils.checkDate(splitted[0], markerDate)
	})
}
	

Utils.getMarkerStr = (name) => {
	const matchArr = name.match(Settings.Markers.Pattern);
	return matchArr ? matchArr[0].slice(1) : null;
}
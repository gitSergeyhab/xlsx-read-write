const add_BP_toWork = (work) => {
	if (!work) {
		return '';
	}
	if (isNaN(+work[0])) {
		return work
	}

	return `БП ${work}`
}

Utils.filterByContain = (objList) => objList.filter((item) => (item[Column.Content].indexOf('закончена') === -1) && (item[Column.Content][0] === 'П') );


Utils.createFileName = (obj) => {

	console.log(obj)
	const {ColumnWrite} = Settings;

	const Part = obj[ColumnWrite.Part];
	const Date = obj[ColumnWrite.Date];
	const N = obj[ColumnWrite.N];
	const R = obj[ColumnWrite.R];
	const Obj = obj[ColumnWrite.Obj];
	const Work = obj[ColumnWrite.Work];
	const Action = obj[ColumnWrite.Action];
	const PRM = obj[ColumnWrite.PRM];
	const Watch = obj[ColumnWrite.Watch];
	const Count = obj[ColumnWrite.Count];

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
	const Action = obj[Column.Action];
	const PRM = obj[Column.PRM];
	const Watch = obj[Column.Watch];
	const Count = obj[Column.Count];
	const count = [Action, PRM, Watch, Count].filter((x) => x).reduce((acc, item) => acc + +item, 0);
	return count;
}
const add_BP_toWork = (work) => {
	if (!work) {
		return '';
	}
	if (isNaN(+work[0])) {
		return work
	}

	return `БП ${work}`
}

Utils.createFileName = (obj) => {

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


Utils.countFiles = (obj) => {
	const Action = obj[Column.Action];
	const PRM = obj[Column.PRM];
	const Watch = obj[Column.Watch];
	const Count = obj[Column.Count];
	const count = [Action, PRM, Watch, Count].filter((x) => x).reduce((acc, item) => acc + +item, 0);
	return count;
}
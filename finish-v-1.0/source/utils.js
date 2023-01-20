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
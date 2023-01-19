

Convert.convertObjListToListList = (keys, objList) => {
	const arr = [];

	objList.forEach((item) => {
		const innerArr = [];
		for (const key of keys) {
			if (item[key]) {
				innerArr.push(item[key]);
			} else {
				innerArr.push('');
			}
		}
		arr.push(innerArr);
	})
	return arr;
} 

Convert.getNamesAndCount = (obj) => ({
	[Settings.Column.ReadAdd.Name]: Utils.createFileName(obj), 
	[Settings.Column.ReadAdd.FilesCount]: Utils.countFiles(obj) 
});

Convert.getFullObjList = (obj) => obj.map((item) => ({...item, ...Convert.getNamesAndCount(item)  }));

Convert.getNamesAndCountList = (objList) => objList.map((Convert.getNamesAndCount));

const getDateFromTime = (time) => time.split(' ')[0];

const getNFromContent = (content, category) => {
	if (category !== Settings.Markers.CategoryN) {
		return ''
	}

	const str = content.split(Settings.Markers.N)[1]
	if (!str) {return ''}
	const num = str.split(' ')[0];
	return num;
}

const getRFromContent = (content, category) => {
	if (category !== Settings.Markers.CategoryR) {
		return ''
	}

	const str = content.split(Settings.Markers.R)[1]
	if (!str) {return ''}
	const num = str.split(' ')[0];
	return num;
}

const delKV = (obj) => {
	const arr = obj.split(' ');

	if (arr.length < 3) {
		return obj;
	}

	const lastPart = arr.slice(2).join(' ');

	return `${arr[0]} ${lastPart}`
}

const getObjName = (obj) => {


	if (obj[0] === 'В' || obj[0] === 'К') {
		return obj.split('айк')[0];
	}
	const str = obj.split('\\');

	const name = delKV(str[0]);
	return name;

}


const getNeedColObj = (obj) => {
	console.log(obj)
	const {ReadDown, Read} = Settings.Column;

	const Part = Settings.Code.Part;
	const Date = getDateFromTime(obj[ReadDown.Time]);
	const N = getNFromContent(obj[ReadDown.Content], obj[ReadDown.Category]);
	const R = getRFromContent(obj[ReadDown.Content], obj[ReadDown.Category]);
	const Obj = getObjName(obj[ReadDown.Object]);
	const Work = '';
	const Action = '';
	const PRM = 1;
	const Watch = '';
	const Count = '';

	return {
		[Read.Part]: Part, [Read.Date]: Date, 
		[Read.N]: N, [Read.R]: R, [Read.Obj]: Obj, [Read.Work]: Work, [Read.Action]: Action, 
		[Read.PRM]: PRM, [Read.Watch]: Watch, [Read.Count]: Count
	};
}

Convert.convertToShow = (rowDataList) => {
	const fullObj = Convert.getFullObjList(rowDataList);
	const listOfDataList = Convert.convertObjListToListList(Header.Write, fullObj);
	return listOfDataList;
}

Convert.convertToShowOJ = (rowDataList) => {
	const filteredObjList = Utils.filterByContain(rowDataList);
	console.log(filteredObjList)

	const needList = filteredObjList.map(getNeedColObj);
	console.log({needList})

	const listOfDataList = Convert.convertObjListToListList(Header.Read, needList);
	return listOfDataList;
}

Convert.convertToFileData = (rowDataList) => {
	const filteredObjList = Utils.filterByContain(rowDataList);
	const needList = filteredObjList.map(getNeedColObj);
	return needList;
}
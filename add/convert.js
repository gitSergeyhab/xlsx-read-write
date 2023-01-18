
//const {Part, Date, N, R, Obj, Work, Action, PRM, Watch, Count} = Settings.ColumnWrite



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

const getObjName1 = (content) => {
	const str = content.split(Settings.Markers.Obj)[0];
	if (!str) {return ''}
	const arrWithObj = str.split(' к работе на ');
	const object = arrWithObj[arrWithObj.length - 1]
	return object;
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
	const {Part, Date, N, R, Obj, Work, Action, PRM, Watch, Count} = Settings.ColumnWrite

	const Part_ = Settings.Code.Part;
	const Date_ = getDateFromTime(obj[Settings.Column.Time]);
	const N_ = getNFromContent(obj[Settings.Column.Content], obj[Settings.Column.Category]);
	const R_ = getRFromContent(obj[Settings.Column.Content], obj[Settings.Column.Category]);
	const Obj_ = getObjName(obj[Settings.Column.Object]);
	const Work_ = '';
	const Action_ = '';
	const PRM_ = 1;
	const Watch_ = '';
	const Count_ = '';

	return {[Part]: Part_, [Date]: Date_, [N]: N_, [R]: R_, [Obj]: Obj_, [Work]: Work_, [Action]: Action_, [PRM]: PRM_, [Watch]: Watch_, [Count]: Count_};

}




const convertObjListToListList = (keys, objList) => {
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

Convert.getFullObj = (obj) => obj.map((item) => ({...item, [Settings.ColumnWrite.Name]: Utils.createFileName(item), [Settings.ColumnWrite.FilesCount]: Utils.countFiles (item)  }));

Convert.getNames = (objList) => objList.map((item) => ({[Column.Name]: Utils.createFileName(item), [Column.FilesCount]: Utils.countFiles (item) }));


Convert.convertToShow = (rowDataList) => {
	const filteredObjList = Utils.filterByContain(rowDataList);
	const needList = filteredObjList.map(getNeedColObj);
	const listOfDataList = convertObjListToListList(orderedHeaders, needList);
	return listOfDataList;
}

Convert.convertToFileData = (rowDataList) => {
	const filteredObjList = Utils.filterByContain(rowDataList);
	const needList = filteredObjList.map(getNeedColObj);
	return needList;
}

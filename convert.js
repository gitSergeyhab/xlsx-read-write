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

Convert.getFullObj = (obj) => obj.map((item) => ({...item, [Column.Name]: Utils.createFileName(item), [Column.FilesCount]: Utils.countFiles (item)  }));

Convert.getNames = (objList) => objList.map((item) => ({[Column.Name]: Utils.createFileName(item), [Column.FilesCount]: Utils.countFiles (item) }));
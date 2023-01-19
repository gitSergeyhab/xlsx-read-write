

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
/**
 * создает поля Имя файла и Количество файлов в объекте 
 * 
 */
Convert.getNamesAndCount = (obj) => ({
	[Settings.Column.ReadAdd.Name]: Utils.createFileName(obj), 
	[Settings.Column.ReadAdd.FilesCount]: Utils.countFiles(obj) 
});

Convert.getFullObjList = (obj) => obj.map((item) => ({...item, ...Convert.getNamesAndCount(item)  }));

Convert.getNamesAndCountList = (objList) => objList.map((item) => ({
	[Settings.Column.ReadAdd.Name]: Utils.createFileName(item), 
	[Settings.Column.ReadAdd.FilesCount]: Utils.countFiles (item) 
}));
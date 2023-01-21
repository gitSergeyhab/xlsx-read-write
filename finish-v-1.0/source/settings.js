PART = 'ТУ';

Settings.Column = {
	Read: {
		Part: 'учаcток',
		Date: 'дата',
		N: 'н',
		R: 'р',
		Obj: 'объект',
		Work: 'работа',
		Action: 'переключения',
		PRM: 'допуск',
		Watch: 'осмотр',
		Count: 'учет',
	},
	ReadAdd: {
		Name: 'имя файла',
		FilesCount: 'количество файлов'
	},
	ReadDown: {
		Time: 'Время события',
		Category: 'Категория',
		Object: 'Объект',
		Content: 'Содержание',
		Author: 'Автор записи'
	}
}

Settings.Code = {
	Part: PART,
	N: 'Н',
	R: 'Р',
	Action: 'ПЕР',
	PRM: 'ПРМ',
	Watch: 'ОСМ',
	Count: 'ПУ',
	ACT: 'АКТ'
}

Settings.Markers = {
	CategoryR: 'Работы по распоряжению',
	CategoryN: 'Работы по наряду',
	R:'По распоряжению № ',
	N:'По наряду-допуску № ',
	Obj:'.',
	SplitDate: '_ТУ_',
	Pattern: /_БП [0-9\/-]+|_Р [0-9\/-]+|_Н [0-9\/-]+/,
}
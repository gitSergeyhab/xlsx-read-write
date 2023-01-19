Header.Read = [
	Settings.Column.Read.Part, Settings.Column.Read.Date, 
	Settings.Column.Read.N, Settings.Column.Read.R, Settings.Column.Read.Obj, Settings.Column.Read.Work, 
	Settings.Column.Read.Action, Settings.Column.Read.PRM, Settings.Column.Read.Watch, Settings.Column.Read.Count, 
];

Header.Write = [
	...Header.Read,
	Settings.Column.ReadAdd.Name, Settings.Column.ReadAdd.FilesCount
]
class FavoriteWebsites {
	constructor() {
		this.favoriteWebsitesEl = null
		this.favoriteWebsitesFolderID = ''
	}

	SetEl() {
		this.favoriteWebsitesEl = document.createElement('div')
		this.favoriteWebsitesEl.className = 'favorite-websites-container'
		document.body.appendChild(this.favoriteWebsitesEl)
	}

	Load() {
		let myPromise = new Promise((resolve, reject) => {
			chrome.bookmarks.search('advance-chrome-theme-0100-hidden', (v) => {
				if (v.length == 0) {
					chrome.bookmarks.create(
						{parentId: '2', title: 'advance-chrome-theme-0100-hidden'},
						(v) => {
							this.favoriteWebsitesFolderID = v.id
							resolve(this.favoriteWebsitesFolderID)
						}
					)
				} else {
					this.favoriteWebsitesFolderID = v[0].id
					resolve(this.favoriteWebsitesFolderID)
				}
			})
		}).then((id) => {
			chrome.bookmarks.getChildren(id, (v) => {
				console.log(v)
			})
		})
	}

	Listener() {
		document.addEventListener('contextmenu', (e) => {
			if (e.target.closest('.favorite-websites-container') == null) {
				return
			}
			let contextmenu = new ContextMenu()
			contextmenu.Open()
			let vModel = {
				title: '',
				url: '',
			}
			contextmenu.SetEvent('Add', '03', () => {
				let dialogPopup = new DialogPopup(
					getDefaultDialogPopup(
						vModel,
						() => {
							if (!isURlValid(vModel.url)) {
								return
							}
							console.log('done event', vModel)
							dialogPopup.Close()
						},
						() => {
							console.log('cancel event')
							dialogPopup.Close()
						}
					)
				)
				dialogPopup.Open()
			})
			contextmenu.StartListener()
		})
	}
}

let favoriteWebsite = new FavoriteWebsites()
favoriteWebsite.SetEl()
favoriteWebsite.Load()
favoriteWebsite.Listener()

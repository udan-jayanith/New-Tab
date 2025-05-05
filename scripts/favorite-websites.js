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
			document.querySelectorAll('.favorite-item')?.forEach((el) => {
				el.remove()
			})
			chrome.bookmarks.getChildren(id, (v) => {
				v.forEach((item) => {
					let favoriteItemEl = document.createElement('div')
					favoriteItemEl.className = 'favorite-item'
					favoriteItemEl.dataset.url = item.url
					favoriteItemEl.dataset.id = item.id
					favoriteItemEl.title = item.title
					let favoriteItemFavicon = document.createElement('img')
					favoriteItemFavicon.alt = item.title
					favoriteItemFavicon.src = getFaviconURL(item.url)
					favoriteItemFavicon.className = 'favoriteFavicon'
					favoriteItemEl.appendChild(favoriteItemFavicon)
					let titleBarEl = document.createElement('span')
					titleBarEl.className = 'title-bar'
					titleBarEl.innerText = item.title
					favoriteItemEl.appendChild(titleBarEl)
					this.favoriteWebsitesEl.appendChild(favoriteItemEl)
				})
			})
		})
	}

	Listener() {
		document.addEventListener('contextmenu', (e) => {
			if (e.target.closest('.favorite-item')) {
				let item = e.target.closest('.favorite-item')

				let contextmenu = new ContextMenu()
				contextmenu.Open()
				let vModel = {
					title: '',
					url: '',
				}
				contextmenu.SetEvent('Edit', '03', () => {
					vModel.url = item.dataset.url
					let dialogPopup = new DialogPopup(
						getDefaultDialogPopup(
							vModel,
							() => {
								if (!isURlValid(vModel.url)) {
									return
								}
								chrome.bookmarks.update(item.dataset.id, vModel, () => {
									this.Load()
								})
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
				contextmenu.SetEvent('Delete', '04', () => {
					chrome.bookmarks.remove(item.dataset.id, () => {
						this.Load()
					})
				})
				contextmenu.StartListener()
			} else if (e.target.closest('.favorite-websites-container')) {
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
								chrome.bookmarks.create(
									{
										parentId: this.favoriteWebsitesFolderID,
										title: vModel.title,
										url: vModel.url,
									},
									() => {
										this.Load()
									}
								)
								dialogPopup.Close()
							},
							() => {
								dialogPopup.Close()
							}
						)
					)
					dialogPopup.Open()
				})
				contextmenu.StartListener()
			}
		})
		document.addEventListener('click', (e) => {
			let item = e.target.closest('.favorite-item')
			if (item) {
				window.location.href = item.dataset.url
			}
		})
	}
}

function getFaviconURL(u) {
	let url = new URL(u)
	if (url.origin == 'http://localhost:2345') {
		return 'https://cdn-icons-png.flaticon.com/512/4221/4221419.png'
	}
	const faviconUrl = `https://www.google.com/s2/favicons?sz=256&domain=${u}`
	return faviconUrl
}

let favoriteWebsite = new FavoriteWebsites()
favoriteWebsite.SetEl()
favoriteWebsite.Load()
favoriteWebsite.Listener()

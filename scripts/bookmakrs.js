class BookmarkBar {
	constructor() {
		this.bookmarkBarEl = null
	}

	Open() {
		document.body.innerHTML += `<nav class='bookmark-bar'></nav>`
		this.bookmarkBarEl = document.querySelector('.bookmark-bar')

		chrome.bookmarks.getSubTree('1', (v) => {
			this.addFolder(v[0].title, '1', null)
			v[0].children.forEach((bookmark) => {
				this.addFolderItem(
					bookmark.title,
					bookmark.url,
					bookmark.id,
					bookmark.parentId
				)
			})
		})

		chrome.bookmarks.getSubTree('2', (v) => {
			this.addFolder(v[0].title, '2', null)
		})

		document.addEventListener('click', (e) => {
			let folder = e.target.closest('.folder')
			let item = e.target.closest('.item')
			if (item) {
				window.location.href = item.dataset.url
			} else if (folder) {
				if (
					folder.querySelectorAll('.item').length != 0 ||
					folder.querySelectorAll('.folder').length != 0
				) {
					folder.querySelectorAll('.item').forEach((item) => {
						item.remove()
					})
					folder.querySelectorAll('.folder').forEach((folder) => {
						folder.remove()
					})
				} else {
					chrome.bookmarks.getSubTree(folder.dataset.id, (v) => {
						v[0].children.forEach((bookmark) => {
							this.addFolderItem(
								bookmark.title,
								bookmark.url,
								bookmark.id,
								bookmark.parentId
							)
						})
					})
				}
			}
		})

		document.addEventListener('contextmenu', function (e) {
			e.preventDefault()

			let folder = e.target.closest('.folder')
			let item = e.target.closest('.item')
			let contextmenu = new ContextMenu()
			contextmenu.Open()
			if (item) {
				contextmenu.SetEvent('Delete', '1', () => {
					console.log('Delete item clicked')
				})
				contextmenu.SetEvent('Edit', '2', () => {
					console.log('Edit item clicked')
				})
			} else if (folder) {
				contextmenu.SetEvent('Delete', '1', () => {
					console.log('folder delete item clicked')
				})
				contextmenu.SetEvent('Edit', '2', () => {
					console.log('folder edit item clicked')
				})
			}
			contextmenu.StartListener()
		})
	}

	getFaviconURL(u) {
		const url = new URL(u)
		const faviconUrl = `${url.origin}/favicon.ico`
		return faviconUrl
	}

	getFolder(folderName, id, parentId) {
		let folderHeader = `<div class='bookmark-header'>📁 ${folderName}</div>`
		return `<div class="folder folder-${id}" data-id='${id}' data-parent-id='${parentId}'>
					${folderHeader}
			</div>`
	}

	getFolderItem(title, url, id, parentId) {
		return `
			<div class='item folder-item-${id}' data-url='${url}' data-id='${id}' data-parent-id='${parentId}'>
				<img
						src='${this.getFaviconURL(url)}'
						alt='favicon'
						class='favicon'
				/>
					<p class='title'>${title}</p>
			</div>
	`
	}

	addFolder(folderName, id, parentId) {
		if (parentId == null) {
			this.bookmarkBarEl.innerHTML += this.getFolder(folderName, id, parentId)
			return
		}
	}

	addFolderItem(title, url, id, parentId) {
		if (url == null) {
			document.querySelector(`.folder-${parentId}`).innerHTML += this.getFolder(
				title,
				id,
				parentId
			)
			return
		}
		document.querySelector(`.folder-${parentId}`).innerHTML +=
			this.getFolderItem(title, url, id, parentId)
	}
}

let bookmarkBar = new BookmarkBar()
bookmarkBar.Open()

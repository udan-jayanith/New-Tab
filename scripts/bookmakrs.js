function faviconURL(u) {
	const url = new URL(u)
	const faviconUrl = `${url.origin}/favicon.ico`
	return faviconUrl
}

function getFolder(folderName, id, parentId) {
	let folderHeader =
		parentId != undefined
			? `<div class='bookmark-header'>📁 ${folderName}</div>`
			: ''
	return `<div class="folder folder-${id}" data-id='${id}' data-parent-id='${parentId}'>
					${folderHeader}
			</div>`
}

function getFolderItem(title, url, id, parentId) {
	return `
			<div class='item folder-item-${id}' data-url='${url}' data-id='${id}' data-parent-id='${parentId}'>
				<img
						src='${faviconURL(url)}'
						alt='favicon'
						class='favicon'
				/>
					<p class='title'>${title}</p>
			</div>
	`
}

let rightClickedEl = null
let bookmarkBarItemsContextMenu = [
	{
		content: 'Edit',
		class: 'bookmark-bar-item-edit',
	},
	{
		content: 'Delete',
		class: 'bookmark-bar-item-delete',
	},
]

let bookmarkBarFolderContextMenu = [
	{
		content: 'Add',
		class: 'bookmark-bar-folder-add',
	},
	{
		content: 'Delete',
		class: 'bookmark-bar-folder-delete',
	},
]

function addFolder(folderName, id, parentId) {
	if (parentId == undefined) {
		document.querySelector('.bookmark-bar').innerHTML += getFolder(
			folderName,
			id,
			parentId
		)
		document.querySelector('.bookmark-bar').addEventListener('click', (e) => {
			if (e.target.closest('.item') == null) {
				return
			}
			window.location.href = e.target.closest('.item').dataset.url
		})
		return
	}

	document.querySelector(`.folder-${parentId}`).innerHTML += getFolder(
		folderName,
		id,
		parentId
	)
}

function addFolderItem(title, url, id, parentId) {
	document.querySelector(`.folder-${parentId}`).innerHTML += getFolderItem(
		title,
		url,
		id,
		parentId
	)
}

function traverseBookmarks(nodes) {
	for (const node of nodes) {
		if (node.url) {
			addFolderItem(node.title, node.url, node.id, node.parentId)
		} else {
			addFolder(node.title, node.id, node.parentId)
			if (node.children) {
				traverseBookmarks(node.children)
			}
		}
	}
}

function renderBookmarkTree() {
	document.querySelector('.bookmark-bar').innerHTML = null
	chrome.bookmarks.getTree((bookmarkTreeNodes) => {
		traverseBookmarks(bookmarkTreeNodes)
		document
			.querySelector('.bookmark-bar')
			.addEventListener('contextmenu', (e) => {
				console.log('context menu event ran')
				let item = e.target.closest('.item')
				let folder = e.target.closest('.folder')
				if (item) {
					e.preventDefault()
					rightClickedEl = e.target.closest('.item')
					contextmenu.add(bookmarkBarItemsContextMenu)
					contextmenu.open()
				} else if (folder) {
					let contextmenu = new ContextMenu()
					contextmenu.Open(e)
					contextmenu.SetEvent('Add', 'h1', () => {
						console.log('add item clicked')
					})
					contextmenu.SetEvent('Delete', 'h2', () => {
						console.log('delete item clicked')
					})
					contextmenu.StartListener()
				}
			})
	})
}

renderBookmarkTree()

/*
contextmenu.events['bookmark-bar-folder-add'] = function () {
	dialogPopup.open(
		`		
	<div class="Add-a-bookmark">
		<h2 class='description-title'>Save a site</h2>
			<div class='input-div'>
				<input type="text" placeholder="Title" class='dialog-title-input'/>
				<input type="text" placeholder="Url" class='dialog-url-input'/>
			</div>
			<div class="button-div">
				<button class="done">Done</button>
				<button class="cancel">Cancel</button>
			</div>
	</div>`,
		{
			done: function () {
				console.log('created')
				dialogPopup.close()
			},
		}
	)
}
*/

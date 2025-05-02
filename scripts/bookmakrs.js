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
			<div class='item' data-url='${url}' data-id='${id}' data-parent-id='${parentId}'>
				<img
						src='${faviconURL(url)}'
						alt='favicon'
						class='favicon'
				/>
					<p class='title'>${title}</p>
			</div>
	`
}

function addFolder(folderName, id, parentId) {
	if (parentId == undefined) {
		document.querySelector('.bookmark-bar').innerHTML += getFolder(
			folderName,
			id,
			parentId
		)
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

chrome.bookmarks.getTree((bookmarkTreeNodes) => {
	traverseBookmarks(bookmarkTreeNodes)
})

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

document.querySelector('.bookmark-bar').addEventListener('click', (e) => {
	if (e.target.closest('.item') != null) {
		console.log(e.target.closest('.item'))
	}
})

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

let rightClickedEl = null

document.querySelector('.bookmark-bar').addEventListener('contextmenu', (e) => {
	if (e.target.closest('.item') != null) {
		e.preventDefault()
		rightClickedEl = e.target.closest('.item')
		contextmenu.add(bookmarkBarItemsContextMenu)
		contextmenu.open()
		return
	} else if (e.target.closest('.folder') != null) {
		e.preventDefault()
		rightClickedEl = e.target.closest('.folder')
		contextmenu.add(bookmarkBarFolderContextMenu)
		contextmenu.open()
		return
	}
})

contextmenu.contextmenuEl.addEventListener('bookmark-bar-folder-add', () => {
	chrome.bookmarks.create(
		{
			parentId: rightClickedEl.dataset.id,
			title: 'Extension bookmarks',
			url: 'https://chatgpt.com/c/68148901-183c-8004-9a5a-d0b9037e1ce0',
		},
		function () {
			document.querySelector('.bookmark-bar').innerHTML = null
			chrome.bookmarks.getTree((bookmarkTreeNodes) => {
				traverseBookmarks(bookmarkTreeNodes)
			})
		}
	)
})

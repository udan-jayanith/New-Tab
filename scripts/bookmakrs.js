let currentIndex1 = 0

let bookmarksArr = [
	{
		folder: '',
		items: [],
	},
	{
		folder: '',
		items: [],
	},
]

function runDisplayBookmarks() {
	chrome.bookmarks.getTree((bookmarkTreeNodes) => {
		displayBookmarks(bookmarkTreeNodes)
	})
}

document.addEventListener('DOMContentLoaded', runDisplayBookmarks)

document.querySelector('.title-book').addEventListener('click', () => {
	if (currentIndex1 == 0) currentIndex1 = 1
	else currentIndex1 = 0

	renderBookmarks(currentIndex1)
})

function displayBookmarks(bookmarkNodes) {
	bookmarkNodes.forEach((node) => {
		if (node.url) {
			const object = {
				title: node.title,
				url: node.url,
				id: node.id,
			}

			if (bookmarksArr[0].folder == '') {
				bookmarksArr[0].items.push(object)
			} else if (bookmarksArr[1].folder == '') {
				bookmarksArr[1].items.push(object)
			}
		}

		if (node.children) {
			displayBookmarks(node.children)

			if (node.title == 'Bookmarks bar') bookmarksArr[0].folder = node.title
			else if (node.title == 'Other bookmarks')
				bookmarksArr[1].folder = node.title
		}
	})

	renderBookmarks(currentIndex1)
}

function renderBookmarks(index) {
	document.querySelector('.title-book').innerHTML = bookmarksArr[index].folder
	const msvc = document.querySelector('.msvc')

	msvc.innerHTML = ''
	bookmarksArr[index].items.forEach((el) => {
		msvc.innerHTML += `
			<li title="${el.title}">
				<img src="${faviconURL(el.url)}" alt="favicon">
				<a href="${el.url}" target="_blank" class="ls">${el.title}</a>
			</li>
		`
	})
}

function faviconURL(u) {
	const url = new URL(u)
	const faviconUrl = `${url.origin}/favicon.ico`
	return faviconUrl
}


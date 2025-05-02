let cursorPosition = {
	clientX: 0,
	clientY: 0,
}

document.addEventListener('mousemove', function (event) {
	cursorPosition.clientX = event.clientX
	cursorPosition.clientY = event.clientY
})

let contextmenu = {
	contextmenuEl: document.querySelector('.contentMenu'),
	open: function () {
		this.contextmenuEl.classList.remove('hidden')
		this.contextmenuEl.style.top = cursorPosition.clientY + 10 + 'px'
		this.contextmenuEl.style.left = cursorPosition.clientX + 10 + 'px'
	},
	close: function () {
		this.contextmenuEl.classList.add('hidden')
		this.contextmenuEl.style.top = cursorPosition.clientY + 10 + 'px'
		this.contextmenuEl.style.left = cursorPosition.clientX + 10 + 'px'
	},
	add: function (items) {
		this.contextmenuEl.innerHTML = null
		items.forEach((item) => {
			this.contextmenuEl.innerHTML += `<div class="contextmenu-item ${item.class}">${item.content}</div>`
		})
	},
}

contextmenu.contextmenuEl.addEventListener('click', (e) => {
	contextmenu.close()
	e.target.classList.forEach((classname) => {
		const event = new CustomEvent(classname, e.target)
		contextmenu.contextmenuEl.dispatchEvent(event)
	})
})

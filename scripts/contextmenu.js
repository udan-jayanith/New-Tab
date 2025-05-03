let cursorPosition = {
	clientX: 0,
	clientY: 0,
}

document.addEventListener('mousemove', function (event) {
	cursorPosition.clientX = event.clientX
	cursorPosition.clientY = event.clientY
})

function getEvent(evType, evListener) {
	return {
		type: evType,
		listener: evListener,
	}
}

class ContextMenu {
	constructor() {
		this.contentMenuClass = String('contextmenu' + Math.random() * 10).replace(
			'.',
			''
		)
		this.contextMenuHTML = `<div class='contentMenu ${this.contentMenuClass}'></div>`
		this.events = {}
		this.contextMenuRef = null
	}

	Open(e) {
		e.preventDefault()
		console.log('ran open')
		document.body.innerHTML += this.contextMenuHTML
		this.contextMenuRef = document.querySelector('.' + this.contentMenuClass)
		this.contextMenuRef.style.top = cursorPosition.clientY + 10 + 'px'
		this.contextMenuRef.style.left = cursorPosition.clientX + 10 + 'px'
	}
	Close() {
		this.contextMenuRef.remove()
		this.contextMenuRef = null
	}
	SetEvent(innerText, id, callbackFunc) {
		this.contextMenuRef.innerHTML += `<div class="contextmenu-item" data-id='${id}'>${innerText}</div>`
		this.events[id] = callbackFunc
	}
	StartListener() {
		this.contextMenuRef.addEventListener('click', (e) => {
			let item = e.target.closest('.contextmenu-item')
			console.log(item)
			this.Close()
		})
	}
}

class DialogPopup {
	constructor(innerHTML) {
		this.innerHTML = innerHTML
		this.PopupEl = null
	}
	Open() {
		this.PopupEl = document.createElement('div')
		this.PopupEl.className = 'dialog-popup'
		this.PopupEl.innerHTML = this.innerHTML
		document.body.appendChild(this.PopupEl)
	}
	SetEvent(className, eventType, callback) {
		document.addEventListener('DOMContentLoaded', () => {
			document
				.querySelector(`.dialog-popup .${className}`)
				.addEventListener(eventType, () => {
					callback()
				})
		})
	}
	Close() {
		document.querySelector('.dialog-popup').remove()
		this.PopupEl = null
	}
}

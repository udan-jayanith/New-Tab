class DialogPopup {
	constructor(innerHTML) {
		this.innerHTML = innerHTML
		this.PopupEl = null
	}
	Open() {
		document.querySelectorAll('.dialog-popup').forEach((el) => {
			el.remove()
		})
		this.PopupEl = document.createElement('div')
		this.PopupEl.className = 'dialog-popup'
		this.PopupEl.appendChild(this.innerHTML)
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

function getDefaultDialogPopup(vModel, doneCallback, cancelCallback) {
	let div = document.createElement('div')
	div.className = 'dialogPopup-2-inputs-2btn'

	let inputsContainer = document.createElement('div')
	inputsContainer.className = 'inputs-container'

	let inputTitle = document.createElement('input')
	inputTitle.placeholder = 'Title'
	inputTitle.type = 'text'
	inputTitle.value = vModel.title
	inputTitle.addEventListener('input', (e) => {
		vModel.title = e.target.value
	})
	inputsContainer.appendChild(inputTitle)

	let inputUrl = document.createElement('input')
	inputUrl.placeholder = 'URL'
	inputUrl.type = 'text'
	inputUrl.value = vModel.url
	inputUrl.addEventListener('input', (e) => {
		vModel.url = e.target.value
	})
	inputsContainer.appendChild(inputUrl)

	let buttonsContainer = document.createElement('div')
	buttonsContainer.className = 'buttons-container'

	let doneBtn = document.createElement('button')
	doneBtn.innerText = 'Done'
	doneBtn.addEventListener('click', doneCallback)
	buttonsContainer.appendChild(doneBtn)

	let cancelBtn = document.createElement('button')
	cancelBtn.innerText = 'Cancel'
	cancelBtn.addEventListener('click', cancelCallback)
	buttonsContainer.appendChild(cancelBtn)

	div.appendChild(inputsContainer)
	div.appendChild(buttonsContainer)

	return div
}

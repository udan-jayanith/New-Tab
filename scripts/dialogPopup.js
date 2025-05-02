let dialogPopup = {
	HTML_Layout: `	<div class="dialogBackdrop">
			            <div class="dialogPopup"></div>
		            </div>`,
	el: null,
	open: function (content) {
		document.body.innerHTML += this.HTML_Layout
		this.el = document.querySelector('.dialogPopup')
		this.el.innerHTML = content
		this.el.addEventListener('click', (e) => {
			e.target.classList.forEach((className) => {
				let event = new CustomEvent(className, e)
				el.dispatchEvent(event)
			})
		})
	},
	close: function () {
		this.el.remove()
		this.el.removeEventListener()
		this.el = null
	},
}

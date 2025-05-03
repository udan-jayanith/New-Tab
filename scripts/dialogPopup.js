let dialogPopup = {
	HTML_Layout: `	<div class="dialogBackdrop">
			            <div class="dialogPopup"></div>
		            </div>`,
	el: null,
	open: function (content, map) {
		document.body.innerHTML += this.HTML_Layout
		this.el = document.querySelector('.dialogPopup')
		this.el.innerHTML = content
		this.el.addEventListener('click', (e) => {
			e.target.classList.forEach((className) => {
				let callback = map[className]
				if (callback != undefined) {
					callback(e, this.el)
				}
			})
		})
	},
	close: function () {
		document.querySelector('.dialogBackdrop').remove()
		this.el.innerHTML = null
	},
}

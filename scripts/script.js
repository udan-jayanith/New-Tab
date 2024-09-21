let date = moment().format('MMM Do YY')
const dateFormNow = localStorage.getItem('date')

if (!dateFormNow || dateFormNow != date) fetchBackground()
else setBackground()

async function fetchBackground() {
	const url = `https://api.unsplash.com/photos/random?query=wallpaper&orientation=landscape&client_id=JHn_5zbyTz583TZhNGUTeRl0StyNStCy54lkBBYP6dg`

	const response = await fetch(url) // Fetch the data
	const data = await response.json() // Convert the response to JSON
	getContrastingColor(data.urls.full)

	localStorage.setItem('image-url', await data.urls.full)
	localStorage.setItem('date', date)

	return 0
}

function setBackground() {
	const imageUrl = localStorage.getItem('image-url')

	if (!imageUrl) {
		fetchBackground()
		console.log('fetching Background')
		return 0
	}

	getContrastingColor(imageUrl)
}

async function getContrastingColor(url) {
	document.body.style.backgroundImage = `url(${await url})`

	var colorThief = new ColorThief()
	var img = new Image()
	img.crossOrigin = 'Anonymous' // This is important for cross-origin images
	img.src = await url
	img.onload = () => {
		var color = colorThief.getColor(img)
		const brightness = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000

		document.documentElement.style.cssText = `--text-color: ${
			brightness > 128 ? '#3C4042' : '#F2F1ED'
		}`

		return 0
	}
}


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

		document.documentElement.style.cssText = `--text-color: ${getTextColor(
			brightness
		)}`

		return 0
	}
}

function getTextColor(brightness) {
	
	if (brightness <= 28) return '#d1d1d6'
	else if (brightness <= 55) return '#d0e7ff'
	else if (brightness <= 70) return '#e2f4ea'
	else if (brightness <= 79) return '#f2f2f7'
	else if (brightness <= 91) return '#fff9d5'
	else if (brightness <= 115) return '#ffe4e1'
	else if (brightness <= 190) return '#333333'
	else if (brightness <= 223) return '#654321'
	else return '#3C4042'
	
}

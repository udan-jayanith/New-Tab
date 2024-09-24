const date = moment().format('MMM Do YY')
const dateFormNow = localStorage.getItem('date')

if (!dateFormNow || dateFormNow != date) fetchBackground()
else style()

async function fetchBackground() {
	const url = `https://api.unsplash.com/photos/random?query=wallpaper&orientation=landscape&client_id=JHn_5zbyTz583TZhNGUTeRl0StyNStCy54lkBBYP6dg`

	const response = await fetch(url) // Fetch the data
	const data = await response.json() // Convert the response to JSON

	localStorage.setItem('image-url', await data.urls.full)
	localStorage.setItem('date', date)
	getAverageColor(data.urls.full)
}

function style() {
	const imageURL = localStorage.getItem('image-url')
	const colorValue = localStorage.getItem('colorValue')

	if (!imageURL) {
		fetchBackground()
		return 0
	}

	document.body.style.backgroundImage = `url(${imageURL})`
	document.documentElement.style.cssText = colorValue

	console.log(colorValue)
	console.log(imageURL)
}

function getAverageColor(imageUrl) {
	const img = new Image()
	img.crossOrigin = 'Anonymous' // Handle CORS for external images if necessary
	img.src = imageUrl
	let returnValue = 0

	img.onload = function () {
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')

		// Set the canvas size to the image size
		canvas.width = img.width
		canvas.height = img.height

		// Draw the image onto the canvas
		context.drawImage(img, 0, 0, canvas.width, canvas.height)

		// Get the image data from the canvas
		const imageData = context.getImageData(
			0,
			0,
			img.naturalWidth,
			img.naturalHeight
		)
		const data = imageData.data
		let r = 0,
			g = 0,
			b = 0

		// Loop through all the pixels to calculate the average color
		for (let i = 0; i < data.length; i += 4) {
			r += data[i] // Red
			g += data[i + 1] // Green
			b += data[i + 2] // Blue
		}

		// Get the average values
		const pixelCount = data.length / 4
		r = Math.floor(r / pixelCount)
		g = Math.floor(g / pixelCount)
		b = Math.floor(b / pixelCount)

		returnValue = rgbToHsl(r, g, b)
		localStorage.setItem('colorValue', `--text-color: ${returnValue}`)
		style()

		return 0
	}
}

function rgbToHsl(r, g, b) {
	r /= 255
	g /= 255
	b /= 255

	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	let h,
		s,
		l = (max + min) / 2

	if (max === min) {
		h = s = 0 // achromatic
	} else {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			case b:
				h = (r - g) / d + 4
				break
		}
		h /= 6
	}

	h *= 360
	s *= 100
	l *= 100

	if (l >= 60) l = 6
	else if (l <= 40) l = 94
	else h = Math.floor(Math.random() * 361)

	return `hsl(${h}, ${s}%, ${l}%)`
}

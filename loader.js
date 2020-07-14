const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const stream = require('stream')

const ar = require('ar')
const axios = require('axios')
const gunzipMaybe = require('gunzip-maybe')
const tar = require('tar-stream')

const { urlRegexp } = require('./utils')

// Create node_modules/.cache folder
const cacheFolder = path.join(__dirname, 'node_modules', '.cache')
if (!fs.existsSync(cacheFolder)) {
	fs.mkdirSync(cacheFolder)
}

// Load node_modules/.cache/urlsLoader.json
const cacheVersion = 2
const cacheFile = path.join(__dirname, 'node_modules', '.cache', 'urlsLoader.json')
function getCacheFileContents() {
	const emptyCache = {
		version: cacheVersion,
		cache: {},
	}

	if (fs.existsSync(cacheFile)) {
		try {
			const cacheFileContents = require(cacheFile)
			if (cacheFileContents.version !== cacheVersion) return emptyCache
			if (typeof cacheFileContents.cache !== 'object') return emptyCache

			return cacheFileContents
		} catch (error) {
			return emptyCache
		}
	} else {
		return emptyCache
	}
}
const cache = getCacheFileContents().cache
let lastWrittenCache = JSON.stringify(cache)

const urlsToAssetId = {}

function getAssetIdForURL(url) {
	const result = url.match(urlRegexp)
	if (!result) throw new Error(`Bad URL: ${url}`)
	const [, owner, repo, tag] = result
	const options = {}
	if (process.env.GITHUB_TOKEN) options.headers = { Authorization: `token ${process.env.GITHUB_TOKEN}` }
	return axios
		.get(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`, options)
		.then(({ data }) => (data.assets.filter((asset) => asset.browser_download_url === url)[0] || {}).id)
		.catch(({ response }) => {
			throw new Error(response.statusText)
		})
}

function extractControlTarGunzipMaybe(data) {
	return new Promise((resolve, reject) => {
		const readableStream = new stream.Readable({
			read() {
				this.push(data)
				this.push(null)
			},
		})

		const extract = tar.extract()

		extract.on('entry', function (header, stream, next) {
			if (header.name === './control') {
				const data = []
				stream.on('data', (chunk) => {
					data.push(chunk)
				})
				stream.on('end', function () {
					resolve(Buffer.concat(data).toString())
				})
				stream.resume()
			} else {
				next()
			}
		})

		extract.on('finish', function () {
			reject(new Error('control file missing'))
		})

		readableStream.pipe(gunzipMaybe()).pipe(extract)
	})
}

function convertControlToObject(control) {
	const controlRegExp = /^([A-Za-z-]+): (.*)$/gm
	const meta = {}

	let result
	while ((result = controlRegExp.exec(control))) {
		meta[result[1]] = result[2]
	}

	delete meta.Icon
	return meta
}

async function getMetaForURL(url) {
	const { data } = await axios.get(url, { responseType: 'arraybuffer' })

	const archive = new ar.Archive(data)

	const meta = {}

	for (const file of archive.getFiles()) {
		const fileName = file.name()
		if (fileName.startsWith('control.tar')) {
			Object.assign(meta, convertControlToObject(await extractControlTarGunzipMaybe(file.fileData())))
		} else if (fileName.startsWith('data.tar') || fileName === 'debian-binary') {
			// Skip
		} else {
			console.warn('File', fileName, 'not supported; skipping')
		}
	}

	delete meta.Depiction
	delete meta.Icon

	// Calculate Size [size of package]
	meta.Size = data.length

	// Calculate MD5sum of package
	meta.MD5sum = crypto.createHash('md5').update(data).digest('hex')

	meta.Filename = `api/deb/${meta.MD5sum}.deb`

	// Calculate SHA1 of package
	meta.SHA1 = crypto.createHash('sha1').update(data).digest('hex')

	// Calculate SHA256 of package
	meta.SHA256 = crypto.createHash('sha256').update(data).digest('hex')

	return meta
}

module.exports = async function () {
	const repo = require(this.resourcePath)

	const packages = await Promise.all(
		repo.packages.map(async (url) => {
			const assetId = urlsToAssetId[url] || (urlsToAssetId[url] = await getAssetIdForURL(url))
			if (!assetId) throw new Error(`Asset with URL ${url} not found`)
			const meta = cache[assetId] || (cache[assetId] = await getMetaForURL(url))
			return { meta, url }
		}),
	)

	const currentCacheSerialized = JSON.stringify({ version: cacheVersion, cache })
	if (lastWrittenCache !== currentCacheSerialized) {
		fs.writeFileSync(cacheFile, currentCacheSerialized)
		lastWrittenCache = currentCacheSerialized
	}

	const restructuredPackages = {}
	const md5Table = {}

	for (const p of packages) {
		// package is a reserved variable name
		if (!restructuredPackages[p.meta.Name]) restructuredPackages[p.meta.Name] = {}
		restructuredPackages[p.meta.Name][p.meta.Version] = p
		md5Table[p.meta.MD5sum] = p.url
	}

	return `export const packages = ${JSON.stringify(restructuredPackages)};
export const md5Table = ${JSON.stringify(md5Table)};
export const name = ${JSON.stringify(repo.name)};
export const description = ${JSON.stringify(repo.description)};
export const icons = ${JSON.stringify(repo.icons)};`
}

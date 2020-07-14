exports.urlRegexp = /^https:\/\/github.com\/([^\/]+)\/([^\/]+)\/releases\/download\/([^\/]+)\/([^\/]+)$/

exports.getRepoUrl = function getRepoUrl(req) {
	if (req) {
		return `${
			req.headers['x-forwarded-proto']
				? req.headers['x-forwarded-proto']
				: process.env.NODE_ENV === 'production'
				? 'https'
				: 'http'
		}://${req.headers['x-forwarded-host'] ? req.headers['x-forwarded-host'] : req.headers.host}/`
	}

	return `${window.location.protocol}//${window.locations.host}/`
}

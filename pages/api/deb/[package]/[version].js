import { packages } from '../../../../loader!../../../../repo'

export default (req, res) => {
	const url = packages[req.query.package]?.[req.query.version]?.url
	if (!url) {
		res.status(404)
	} else {
		res.setHeader('Location', url)
		res.status(301)
	}
	res.end()
}

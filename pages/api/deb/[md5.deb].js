import { md5Table } from '../../../loader!../../../repo'

export default (req, res) => {
	if (req.method === 'HEAD') {
		res.status(200)
		res.end()
		return
	}

	const query = req.query['md5.deb']
	const md5 = query.substr(0, query.length - 4)
	const url = md5Table[md5]
	if (!url) {
		res.status(404)
	} else {
		res.setHeader('Location', url)
		res.status(302)
	}
	res.end()
}

import { packages, icons } from '../../loader!../../repo'
import { getRepoUrl } from '../../utils'

const spaceRegExp = /\s/g

export default (req, res) => {
	const url = getRepoUrl(req)
	const result = []
	for (const name in packages) {
		const versions = packages[name]
		for (const version in versions) {
			const p = versions[version] // package is a reserved variable name
			const strings = []
			for (const entry in p.meta) {
				strings.push(`${entry}: ${p.meta[entry]}`)
			}

			icons[name] && strings.push(`Icon: ${url}${icons[name]}`)
			strings.push(`Depiction: ${url}${name.replace(spaceRegExp, '-')}`)

			result.push(strings.join('\n'))
		}
	}

	res.setHeader('Cache-Control', 's-maxage=31536000')
	res.end(result.join('\n\n'))
}

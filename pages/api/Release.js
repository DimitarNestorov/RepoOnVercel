import { name, description } from '../../loader!../../repo'

export default (req, res) => {
	res.setHeader('Cache-Control', 's-maxage=31536000')
	res.end(`Origin: ${name}
Label: ${name}
Suite: stable
Version: 1.0
Codename: ios
Architectures: iphoneos-arm
Components: main
Description: ${description}
`)
}

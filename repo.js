exports.name = 'Repo on Vercel'
exports.description = "Repo on Vercel's example repository"

exports.packages = [
	'https://github.com/dimitarnestorov/RepoOnVercel/releases/download/red-1.0.1/example.red_1.0.1_iphoneos-arm.deb',
	'https://github.com/dimitarnestorov/RepoOnVercel/releases/download/red-1.0.0/example.red_1.0.0_iphoneos-arm.deb',
	'https://github.com/dimitarnestorov/RepoOnVercel/releases/download/green-1.0.0/example.green_1.0.0_iphoneos-arm.deb',
	'https://github.com/dimitarnestorov/RepoOnVercel/releases/download/blue-1.0.0/example.blue_1.0.0_iphoneos-arm.deb',
]

exports.icons = {
	Red: 'assets/red/icon.png',
	Blue: 'assets/blue/icon.png',
	Green: 'assets/green/icon.png',
}

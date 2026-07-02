const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
const { withTamagui } = require('@tamagui/metro-plugin')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [monorepoRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
]

const defaultResolveRequest = config.resolver.resolveRequest

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    if (defaultResolveRequest) {
      return defaultResolveRequest(context, moduleName, platform)
    }

    return context.resolveRequest(context, moduleName, platform)
  }

  const isTamagui =
    moduleName === 'tamagui' ||
    moduleName.startsWith('tamagui/') ||
    moduleName.startsWith('@tamagui/')

  if (isTamagui) {
    return context.resolveRequest(
      {
        ...context,
        unstable_conditionNames: ['react-native', 'require', 'default'],
      },
      moduleName,
      platform,
    )
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform)
  }

  return context.resolveRequest(context, moduleName, platform)
}

module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
})

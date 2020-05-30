const fs = require('fs')
const path = require('path')
const DiscordRSS = require('discord.rss')
const configPath = path.join(__dirname, '..', 'settings', 'config.bot.json')
const configFile = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {}

// This will potentially throw
DiscordRSS.config.set(configFile)

const config = DiscordRSS.config.get()
const v6 = DiscordRSS.migrations.v6

v6(config)
  .then((failures) => {
    console.log('Finished v6 migration')
    if (failures.length === 0) {
      return
    }
    for (const item of failures) {
      console.log(item.error)
      console.log(JSON.stringify(item.data, null, 2))
    }
    fs.writeFileSync(`./migrations/failures.log`, JSON.stringify(failures, null, 2))
    console.error('\n\n\x1b[31mThere were some migration failures. See output above, or failures.log in the migrations directory.\x1b[0m\n')
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

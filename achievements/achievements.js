"use strict"

function createAchievement(args) {
  if (!args.name || typeof args.name !== 'string') {
    errormsg("Achievement created without name.")
    return
  }
  if (!args.alias || typeof args.alias !== 'string') {
    errormsg(`Achievement ${args.name}: created without alias.`)
    return
  }
  if (!args.details || typeof args.details !== 'string') {
    errormsg(`Achievement ${args.name}: created without details.`)
    return
  }
  if (!args.afterDetails || typeof args.afterDetails !== 'string') {
    errormsg(`Achievement ${args.name}: created without afterDetails.`)
    return
  }
  if (!args.condition || typeof args.condition !== 'function') {
    errormsg(`Achievement ${args.name}: created without condition.`)
    return
  }

  achievements.achievementsArray.push(args)
  const achievementsArr = achievements.getAchievementsArr()
  if (!achievementsArr.find(ach => { return args.name === ach.name })) achievementsArr.push(args)
  localStorage.setItem(achievements.achievementsKey, JSON.stringify(achievementsArr))
}

const achievements = {
  achievementsArray: [],

  achievementsKey: "QJS:" + settings.title + ":achievements",

  getAchievementsArr(){
    const achievementsJSON = localStorage.getItem(this.achievementsKey)
    return achievementsJSON ? JSON.parse(achievementsJSON) : []
  },

  getAchievements(achieved) {
    const achievementsArr = this.getAchievementsArr()
    return achieved ? achievementsArr.filter(ach => { return !!ach.achieved }) : achievementsArr.filter(ach => { return !ach.achieved })
  },

  getAllAchievements() {
    const achievementsArr = this.getAchievementsArr()
    return achievementsArr.sort(function (a, b) {
      if (!a.achieved && !!b.achieved) return -1
      if (!b.achieved && !!a.achieved) return 1
      if (!!a.achieved && !!b.achieved) return a.achieved - b.achieved
      return a.alias.localeCompare(b.alias)
    })
  },

  listAchievements(achievementsArr) {
    achievementsArr.forEach(ach => {
      msg(`${ach.achieved ? "&#9745;" : "&#9744;"} ${ach.alias} - ${ach.achieved ? ach.afterDetails : ach.details}${ach.achieved ? " - " + new Date(ach.achieved).toDateString() : ''}`)
    })
  },

  setAchievement(name) {
    const achievementsArr = this.getAchievementsArr()
    const achievement = achievementsArr.find(ach => { return ach.name === name })
    if (!achievement.achieved) {
      achievement.achieved = Date.now()
      localStorage.setItem(this.achievementsKey, JSON.stringify(achievementsArr))
    }
    msg(`Achievement unlocked: ${achievement.alias} - ${achievement.afterDetails}`)
  },

  endTurn() {
    this.getAchievements(false).forEach(ach => {
      const achievement = this.achievementsArray.find(match => { return match.name === ach.name })
      if (achievement.condition()) this.setAchievement(ach.name)
    })
  },
}

settings.modulesToEndTurn.push(achievements)

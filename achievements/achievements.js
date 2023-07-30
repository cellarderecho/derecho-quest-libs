"use strict"

function createAchievement(args) {
  if (!args.name || typeof args.name !== 'string') errormsg("Achievement created without name.")
  if (!args.alias || typeof args.alias !== 'string') errormsg(`Achievement ${args.name}: created without alias.`)
  if (!args.details || typeof args.details !== 'string') errormsg(`Achievement ${args.name}: created without details.`)
  if (!args.afterDetails || typeof args.afterDetails !== 'string') errormsg(`Achievement ${args.name}: created without afterDetails.`)
  if (!args.condition || typeof args.condition !== 'function') errormsg(`Achievement ${args.name}: created without condition.`)
  achievements.achievements.push(args)
}

const achievements = {
  achievements: [],
  
  achievementsKey: "QJS:" + settings.title + ":achievements",

  getAchievements(achieved) {
    const achievementsJSON = localStorage.getItem(this.achievementsKey)
    const achievements = achievementsJSON ? JSON.parse(achievementsJSON) : []
    return achieved ? achievements.filter(ach => { return !!ach.achieved }) : achievements.filter(ach => { return !ach.achieved })
  },

  getAllAchievements() {
    const achievementsJSON = localStorage.getItem(this.achievementsKey)
    const achievements = achievementsJSON ? JSON.parse(achievementsJSON) : []
    return achievements.sort(function (a, b) {
      if (!a.achieved && !!b.achieved) return -1
      if (!b.achieved && !!a.achieved) return 1
      if (!!a.achieved && !!b.achieved) return a.achieved - b.achieved
      return a.name.localeCompare(b.name)
    })
  },

  listAchievements(achievements) {
    achievements.forEach(ach => {
      msg(`${ach.achieved ? "&#9745;" : "&#9744;"} ${ach.alias} - ${ach.achieved ? ach.afterDetails : ach.details}${ach.achieved ? " - " + new Date(ach.achieved).toDateString() : ''}`)
    })
  },

  setAchievement(name) {
    const achievementsJSON = localStorage.getItem(this.achievementsKey)
    const achievements = achievementsJSON ? JSON.parse(achievementsJSON) : []
    const achievement = achievements.find(ach => { return ach.name === name })
    if (!achievement.achieved) {
      achievement.achieved = Date.now()
      localStorage.setItem(this.achievementsKey, JSON.stringify(achievements))
    }
    msg(`Achievement unlocked: ${achievement.alias} - ${achievement.afterDetails}`)
  },

  endTurn() {
    this.getAchievements(false).forEach(ach => {
      const achievement = this.achievements.find(match => { return match.name === ach.name })
        if (achievement.condition()) this.setAchievement(ach.name)
      })
  },

  persistAchievements() {
    const achievementsJSON = localStorage.getItem(this.achievementsKey)
    const achievements = achievementsJSON ? JSON.parse(achievementsJSON) : []
    this.achievements.forEach(achievement => {
      if (!achievements.find(ach => { return achievement.name === ach.name })) achievements.push(achievement)
    })
    localStorage.setItem(this.achievementsKey, JSON.stringify(achievements))
  },
}

settings.modulesToEndTurn.push(achievements)
